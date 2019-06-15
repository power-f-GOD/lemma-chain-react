import React from 'react';
import ReactDOM from 'react-dom';
import Dropdown from './components/Dropdown';
import Gen_JSON_Mockup from './JSON_MockUp_Sample';
import Loader from './components/Loader';



interface IState
{
  dropdownIsCollapsed: boolean;
  dropdownCurHeight: number;
  refID: string;
  isLoading: boolean;
  payload: object[];
  activeTabName: string;
  activeTabLinkName: string;
  historyExists: boolean;
  widgetHeight: number;
  isMobileDevice: boolean;
}



class Widget extends React.Component<{}, IState>
{
  /**
   * dropdownIsCollapsed: boolean for dropdown toggle
   * dropdownCurHeight: holds dropdown height value change
   * activeTabName: this and activeTabLinkName are mainly used for navigating history (going back in time)
   * historyExists: boolean to display 'back button' if true and hide if otherwise
   * widgetHeight: same as this.height; used mainly as props for loader wrapper style height computation
   * isMobileDevice: boolean to check what device app is running on (hides 'star button' if true, displays if false)
   * height: holds constant actual value of Widget height
   * dropdown: child element of Widget
   * activeTabLink: tab link/button
   * activeTab: active tab/dropdown for either of the three togglable tabs
   * history: An array of state objects; will hold the different state changes in order to enable going back in time
   */

  state: any = 
  {
    dropdownIsCollapsed: true,
    dropdownCurHeight: 0,
    refID: '9v7s4gtgt9',
    isLoading: false,
    payload: Gen_JSON_Mockup(),
    activeTabName: 'required-tab',
    activeTabLinkName: 'required-tab-link',
    historyExists: false,
    widgetHeight: 0,
    isMobileDevice: false
  };

  height: number = 0;

  dropdown: any;

  activeTabLink: any;

  activeTab: any;

  history: any = [{}];

  

  handleDropdownToggle = () =>
  {
    this.setState(prevState =>
    {
      let {dropdownIsCollapsed} = prevState,
          dropdownNewHeight = this.resizeDropdownHeightTo(dropdownIsCollapsed ? this.activeTab : 0);

      return {
        dropdownIsCollapsed: !dropdownIsCollapsed,
        dropdownCurHeight: dropdownNewHeight,
        widgetHeight: this.height
      };
    });
  }



  handleTabToggle = (e: any) =>
  {
    let activeTabName: string,
        tabLinks: Element[],
        tabs: Element[];

    //get all tab and tabLink elements
    this.activeTabLink = e.currentTarget;
    activeTabName = this.activeTabLink.getAttribute('data-tab-name');
    this.activeTab = this.findNode(this, `.${activeTabName}`);
    tabLinks = this.findNode(this, '.tab-link');
    tabs = this.findNode(this, '.tab');

    //remove all 'active' classNames from tabs and links.
    tabLinks.forEach((tabLink: Element, i: number) =>
    {
      tabLink.classList.remove('active-tab-link');
      tabs[i].classList.remove('active-tab');
    })
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
  handleReferenceClick = (e: any) =>
  {
    let refID: string = e.currentTarget.dataset.id;

    //first set loading to true to enable transition fadeout
    this.setState({isLoading: true});

    setTimeout(() => this.setState({payload: []}), 200);
    
    //in actual sense, this setTimeout function is a kinda placeholder for the fetch/axios API call method
    setTimeout(() =>                                  
    {
      this.setState({
        refID: refID,
        payload: Gen_JSON_Mockup()
      });
      //using another setState method here to update dropdown height to activeTab-height after it has been populated to avoid setting a height of 0 assuming it's done in the previous setState method
      this.setState({
        dropdownCurHeight: this.resizeDropdownHeightTo(this.activeTab),
        historyExists: true,
        isLoading: false,
        dropdownIsCollapsed: false
      });
      
      //update history
      this.history.push(this.state);                  
    }, 1500);
  }


  
  /**
   * @param goBackInTime: history navigation (time traveller) function 
   */
  goBackInTime = () =>
  {
    let past: any,
        pastIndex: number = this.history.length - 2,
        backInTime: any = {},
        tabLinks: any = this.findNode(this, '.tab-link'),
        tabs: any = this.findNode(this, '.tab');

    if (pastIndex >= 0 && this.history[pastIndex])
      this.setState(varNotNeeded =>
      {
        past = this.history[pastIndex];

        for (let state in past)
          backInTime[state] = past[state];

        return backInTime;
      })
    else { return this.setState({historyExists: false}); }

    //remove all current active tab and tablink classes
    tabLinks.forEach((tabLink: any, i: any) => 
    {
      tabLink.classList.remove('active-tab-link');
      tabs[i].classList.remove('active-tab');
    })

    //reset active tab and tabLink to active tab and tabLink in the past
    this.activeTab = this.findNode(this, `.${this.history[pastIndex].activeTabName}`);
    this.activeTab.classList.add('active-tab')
    this.activeTabLink = this.findNode(this, `.${this.history[pastIndex].activeTabLinkName}`);
    this.activeTabLink.classList.add('active-tab-link');
  
    //remove/delete past future having travelled back in time
    this.history.pop();                     
  }



  /**
   * @param resizeDropdownHeightTo: Resizes dropdown menu to current activeTab; or collapses dropdown to 0 height
   */
  resizeDropdownHeightTo = (activeTab: any, constHeight = this.height) =>
  {
    //i.e. if the argument, activeTab, is an element and not a number (0)...
    return activeTab !== 0 ? (activeTab.offsetHeight + constHeight) : 0;
  }



  /**
   * @param findNode: ReactDOM traverser function - querySelector
   */
  findNode = (parent: any, childName?:string) =>
  {
    let DOMp: any = ReactDOM.findDOMNode(parent),
        queryAll: Element[] = DOMp.querySelectorAll(childName);

    if (childName)
      return queryAll[1] ? queryAll : DOMp.querySelector(childName);
    return DOMp;
  }



  componentDidMount = () =>
  {
    //check what device user is running
    if (/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i.test(window.navigator.userAgent))
      this.setState({isMobileDevice: true});
    
    //delay till isMobileDevice state is set 
    setTimeout(() =>
    {
      //now set value of constant Widget height
      this.height = this.findNode(this).offsetHeight;                      
      this.dropdown = this.findNode(this, '.dropdown');     
      this.activeTabLink = this.findNode(this, '.active-tab-link');
      this.activeTab = this.findNode(this, '.required-tab');

      //using for loop to set props in  history to avoid referencing this.state in history (assuming I used 'this.history.push(this.state)') due to the next two assignment lines after the for loop
      for (let prop in this.state)
        this.history[0][prop] = this.state[prop];

      //unset history initial (first state) dropdown height from 0 to the current activeTab height to prevent dropdown from resizing to 0 on click of back button assuming history index is at 0 (first state).
      this.history[0].dropdownCurHeight = this.resizeDropdownHeightTo(this.activeTab);
      
      //prevent caret-icon-flip bug if gone back in time to first state i.e. if history index is at 0
      this.history[0].dropdownIsCollapsed = false;                       
    }, 100)
  }



  render = () =>
  {
    let refIDWrapperStyle: object =
        {
          position: 'relative',
          display: 'flex',
          justifyContent: 'center'
        };

    return (
      <div className={`widget ${this.state.isMobileDevice ? 'isMobileDevice' : ''}`}>
        <section
          className='ref-tab-wrapper'
          onClick={this.handleDropdownToggle.bind(this)} 
        >
          <span>LC</span>
          <span style={refIDWrapperStyle}>
            <span className='ref-identifier' style={{opacity: this.state.isLoading ? 0 : 1}}>
              {this.state.refID}
            </span>
            <Loader
              isLoading={this.state.isLoading}
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
          handleTabToggle={this.handleTabToggle}
          handleReferenceClick={this.handleReferenceClick}
          goBackInTime={this.goBackInTime}
        />
      </div>
    );
  }
}



export default Widget;

