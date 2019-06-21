import React, { ReactInstance, CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import Dropdown from './components/Dropdown';
import Get_HardCoded_Refs from './JSON_MockUp_Sample';
import Loader from './components/Loader';



interface Payload
{
  data: {title: string, author: string};
  id: string;
  refs: Array<object>;
  [key: string]: any;
}



export interface StateObject
{
  dropdownIsCollapsed: boolean;
  dropdownCurHeight: number;
  refID: string;
  activeTabName: string;
  activeTabLinkName: string;
  historyExists: boolean;
  refIsLoading: boolean;
  payload: Payload;
  errOccurred: boolean;
  errMsg: string;
}



class Widget extends React.Component<{}, StateObject>
{
  /**
   * dropdownIsCollapsed: boolean for dropdown toggle
   * dropdownCurHeight: holds dropdown height value change
   * activeTabName: this and activeTabLinkName are mainly used for navigating history (going back in time)
   * historyExists: boolean to display 'back button' if true and hide if otherwise
   * isViewedWithMobile: boolean to check what device app is running on (hides 'star button' if true, displays if false)
   * height: holds constant actual value of Widget height
   * dropdown: child element of Widget
   * activeTabLink: tab link/button
   * activeTab: active tab/dropdown for either of the three togglable tabs
   * history: An array of state objects; will hold the different state changes in order to enable and set state going back in time
   */

  state: StateObject = 
  {
    dropdownIsCollapsed: true,
    dropdownCurHeight: 0,
    refID: '@alpha/1v1t2ulhg',
    activeTabName: 'required-tab',
    activeTabLinkName: 'required-tab-link',
    historyExists: false,
    refIsLoading: false,
    payload: Get_HardCoded_Refs(),
    errOccurred: false,
    errMsg: ''
  };

  height = 0;

  isViewedWithMobile: boolean = false;

  dropdown: HTMLDivElement | any = null;

  activeTabLink: HTMLButtonElement | any = null;

  activeTab: HTMLUListElement | any = null;

  //copy initial/first state object and set at index 0 of history
  history: StateObject[] = [Object.assign({}, this.state)]; 

  

  handleDropdownToggle = (): void =>
  {
    this.setState(prevState =>
    {
      let {dropdownIsCollapsed} = prevState,
          dropdownNewHeight = this.resizeDropdownHeightTo(dropdownIsCollapsed ? this.activeTab : 0);

      return {
        dropdownIsCollapsed: !dropdownIsCollapsed,
        dropdownCurHeight: dropdownNewHeight
      };
    });
  }



  handleTabToggle = (e: React.MouseEvent<HTMLButtonElement>): void =>
  {
    let activeTabName: string,
        tabLinks: HTMLButtonElement[],
        tabs: HTMLUListElement[];

    //get all tab and tabLink elements
    this.activeTabLink = e.currentTarget;
    activeTabName = this.activeTabLink.getAttribute('data-tab-name');
    this.activeTab = this.findNode(this, `.${activeTabName}`);
    tabLinks = this.findNode(this, '.tab-link');
    tabs = this.findNode(this, '.tab');

    //remove all 'active' classNames from tabs and links.
    tabLinks.forEach((tabLink, i) =>
    {
      tabLink.classList.remove('active-tab-link');
      tabs[i].classList.remove('active-tab');
    });
    //add 'active' classNames to active tab and link
    this.activeTabLink.classList.add('active-tab-link');
    this.activeTab.classList.add('active-tab');
    
    this.setState({
      dropdownCurHeight: this.resizeDropdownHeightTo(this.activeTab),
      activeTabName: activeTabName,
      activeTabLinkName: `${activeTabName}-link`
    });
  }



  /**
   * @param handleReferenceClick: Reference click handler; fetches recommended and required refs for clicked ref
   */
  handleReferenceClick = (e: React.MouseEvent<HTMLDivElement>): void =>
  {
    let refID: any = e.currentTarget.dataset.id,
        init: RequestInit = {
          method: 'GET',
          cache: 'no-cache',
          //PLACEHOLDER: header props values should be gotten from the users session (or maybe not) and not hardcoded as this
          headers: {
            'Content-Type': 'application/json',
            'X-AUTH-ACCOUNT': 'alpha',
            'X-AUTH-PASSWORD': 'password123'
          }
        };

    //first set loading to true to visualize fadeout
    this.setState({refIsLoading: true});

    setTimeout(() => 
    {
      //clear/empty initial payload before updating it
      this.setState({payload: {
        data: { title: '', author: ''},
        id: '',
        refs: [{}]
      }});
      
      fetch(`https://68.183.123.0:1323/${refID}`, init)
        .then((response: Response) => response.json())
        .then((data: Payload) =>
        {
          //throw Error (i.e. do not proceed to try populating UI) if server returns an error [message]
          if (Object.keys(data).includes('error'))
            throw new Error(data.error);
          else {
            this.setState({
              refID: refID,
              payload: data
            });
            //using another setState method here to update dropdown height to activeTab-height after it has been populated to avoid setting a height of 0 assuming it's done in the previous setState method
            this.setState({
              errOccurred: false,
              dropdownCurHeight: this.resizeDropdownHeightTo(this.activeTab),
              historyExists: true,
              refIsLoading: false,
              dropdownIsCollapsed: false
            });
          }
          //update history
          this.history.push(Object.assign({}, this.state));
        })
        .catch(err => {
          //just for proper English sentence casing and grammar
          let errMsg = String(err).replace(/(\w+)?error:/i, '').trim(),
              appendDot = errMsg.substr(-1) !== '.' ? `${errMsg}.` : errMsg,
              grammarfiedErrMsg = appendDot.charAt(0).toUpperCase() + appendDot.substr(1,);
          
          this.setState({
            errOccurred: true,
            errMsg: `${grammarfiedErrMsg}`,
            dropdownCurHeight: this.resizeDropdownHeightTo(this.activeTab),
            historyExists: true,
            refIsLoading: false,
            dropdownIsCollapsed: false
          });
          //update history
          this.history.push(Object.assign({}, this.state));
        });
    }, 150);
  }


  
  /**
   * @param goBackInTime: history navigation (time traveller) function; handles going back one depth on click of 'back button' 
   */
  goBackInTime = (): any =>
  {
    let past: object,
        pastIndex = this.history.length - 2,
        backInTime: object,
        tabLinks: HTMLButtonElement[] = this.findNode(this, '.tab-link'),
        tabs: HTMLUListElement[] = this.findNode(this, '.tab');

    if (pastIndex >= 0 && this.history[pastIndex])
      this.setState(() => {
        past = this.history[pastIndex];
        backInTime = Object.assign({}, past);
        return backInTime;
      }); 
    else { return this.setState({historyExists: false}); }

    //remove all current active tab and tablink classes
    tabLinks.forEach((tabLink, i) => 
    {
      tabLink.classList.remove('active-tab-link');
      tabs[i].classList.remove('active-tab');
    });
    //reset active tab and tabLink to active tab and tabLink in the past
    this.activeTab = this.findNode(this, `.${this.history[pastIndex].activeTabName}`);
    this.activeTab.classList.add('active-tab');
    this.activeTabLink = this.findNode(this, `.${this.history[pastIndex].activeTabLinkName}`);
    this.activeTabLink.classList.add('active-tab-link');
  
    //remove/delete past future having travelled back in time
    this.history.pop();                 
  }



  /**
   * @param resizeDropdownHeightTo: Returns height of current activeTab, or 0 if 'dropdownIsCollapsed'; used to compute and set height of dropdown menu
   */
  resizeDropdownHeightTo(activeTab: any, constHeight = this.height): number
  {
    //i.e. if the argument, activeTab, is an element and not a number (0)...
    return activeTab !== 0 ? (activeTab.offsetHeight + constHeight) : 0;
  }



  /**
   * @param findNode: ReactDOM traverser function - querySelector; returns a DOM node
   */
  findNode(parent: ReactInstance, childName?:string): any
  {
    let DOMp: any = ReactDOM.findDOMNode(parent),
        queryAll: HTMLElement[] = DOMp.querySelectorAll(childName);

    if (childName)
      return queryAll[1] ? queryAll : DOMp.querySelector(childName);
    return DOMp;
  }



  componentDidMount()
  {
    //check what device user is running
    if (/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i.test(window.navigator.userAgent))
      this.isViewedWithMobile = true;

    //delay till isViewedWithMobile is set 
    setTimeout(() =>
    {
      //now set value of constant Widget height which will also be used in computing loader wrapper height in Dropdown.js
      this.height = this.findNode(this).offsetHeight;                      
      this.dropdown = this.findNode(this, '.dropdown');     
      this.activeTabLink = this.findNode(this, '.active-tab-link');
      this.activeTab = this.findNode(this, '.required-tab'); 

      //HACK: unset history initial (first state) dropdown height from 0 to current activeTab height to prevent dropdown from resizing to 0 on click of back button assuming history index is at 0 (first state).
      this.history[0].dropdownCurHeight = this.resizeDropdownHeightTo(this.activeTab);
      //HACK: prevent caret-icon-flip bug if gone back in time to first state i.e. if history index is at 0 on 'back button' click
      this.history[0].dropdownIsCollapsed = false;                       
    }, 100);
  }



  render()
  {
    let refIDWrapperStyle: CSSProperties =
        {
          position: 'relative',
          display: 'flex',
          justifyContent: 'center'
        };

    return (
      <div className={`widget ${this.isViewedWithMobile ? 'isViewedWithMobile' : ''}`}>
        <section
          className='ref-tab-wrapper'
          onClick={this.handleDropdownToggle} 
        >
          <span>LC</span>
          <span style={refIDWrapperStyle}>
            <span className='ref-identifier' style={{opacity: this.state.refIsLoading ? 0 : 1}}>
              {this.state.refID}
            </span>
            <Loader
              refIsLoading={this.state.refIsLoading}
              attributes={{
                size: 8,
                color: 'white',
                type: 'minor'
              }}
            />
          </span>
          <span className={`caret-icon ${this.state.dropdownIsCollapsed ? 'flip-caret-icon' : ''}`}>❮</span>
        </section>
        <Dropdown
          state={this.state}
          height={this.height}
          isViewedWithMobile={this.isViewedWithMobile}
          handleTabToggle={this.handleTabToggle}
          handleReferenceClick={this.handleReferenceClick}
          goBackInTime={this.goBackInTime}
        />
      </div>
    );
  }
}



export default Widget;

