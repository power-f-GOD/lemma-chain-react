import React, { ReactInstance, CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import Dropdown from './components/Dropdown';
import Get_HardCoded_Refs from './JSON_MockUp_Sample';
import Loader from './components/Loader';
import vis from 'vis';



interface Payload
{
  data: {title: string, author: string};
  id: string;
  refs: Array<object>;
  [key: string]: any;
}



export interface State
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



class Widget extends React.Component<{}, State>
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

  state: State = 
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

  endpointLink: string = /localhost/.test(window.location.href) ? 'localhost:1323' : '68.183.123.0:1323';

  //copy initial/first state object and set at index 0 of history
  history: State[] = [Object.assign({}, this.state)]; 

  

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
    let activeTabName: string;

    //get all tab and tabLink elements
    this.activeTabLink = e.currentTarget;
    activeTabName = this.activeTabLink.getAttribute('data-tab-name');
    this.activeTab = this.findNode(this, `.${activeTabName}`);
    //HACK: see Dropdown.tsx for code used to remove 'active' classNames from inactive elements (tabs/tab-links)
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
    let refID: any = e.currentTarget.dataset.id;

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

      let url = `http://${this.endpointLink}/${refID}`;
      
      fetch(url)
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
        backInTime: object;

    if (pastIndex >= 0 && this.history[pastIndex])
      this.setState(() => {
        past = this.history[pastIndex];
        backInTime = Object.assign({}, past);
        return backInTime;
      }); 
    else { return this.setState({historyExists: false}); }

    //reset active tab and tabLink to active tab and tabLink in the past
    this.activeTab = this.findNode(this, `.${this.history[pastIndex].activeTabName}`);
    this.activeTabLink = this.findNode(this, `.${this.history[pastIndex].activeTabLinkName}`);
  
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

    //now set value of constant Widget height which will also be used in computing loader wrapper height in Dropdown.js
    this.height = this.findNode(this).offsetHeight;                      
    this.dropdown = this.findNode(this, '.dropdown');     
    this.activeTabLink = this.findNode(this, '.active-tab-link');
    this.activeTab = this.findNode(this, '.required-tab');

    //HACK: unset history initial (first state) dropdown height from 0 to current activeTab height to prevent dropdown from resizing to 0 on click of back button assuming history index is at 0 (first state).
    //PS: Wait or delay till fonts are loaded before getting height of activeTab in order not to get a height below height of tab with loaded fonts since height is set to auto
    window.onload = (): any =>
    {
      //set maximum height of dropdown to height of three items [before adding scroll bar]
      let heightRef = this.findNode(this, '.item-wrapper')[0].offsetHeight;
      this.findNode(this, '.tab').forEach((tab: any) => tab.style.maxHeight = `${heightRef * 3}px`);
      this.history[0].dropdownCurHeight = this.resizeDropdownHeightTo(this.activeTab);
    }
    //HACK: prevent caret-icon-flip bug if gone back in time to first state i.e. if history index is at 0 on 'back button' click
    this.history[0].dropdownIsCollapsed = false;

    let node: Object[] = [],
        edge: Object[] = [];

    function getNodesAndEdges(obj: Payload)
    {
      let [objHasParents, parents] = [obj.refs ? true : false, obj.refs],
          color = {
            required: {bg: 'darkorange', bdr: '#d77e10'},
            recommended: {bg: 'skyblue', bdr: 'rgb(12, 179, 225)'}
          };

      let nodeProps = (obj: Payload) => ({
        font: {
          size: 16,
          face: 'Google Sans, Roboto Mono, Trebuchet MS',
          color: !obj.ref_type ? 'purple' : (obj.ref_type === 'required' ? color.required.bdr : color.recommended.bdr)
        },
        color: {
          background: !obj.ref_type ? 'purple' : (obj.ref_type === 'required' ? color.required.bg : color.recommended.bg),
          border: !obj.ref_type ? 'rgb(215, 105, 215)' : (obj.ref_type === 'required' ? color.required.bdr : color.recommended.bdr),
          hover: {
            background: 'white',
            border: !obj.ref_type ? '#c253c2' : (obj.ref_type === 'required' ? color.required.bdr : color.recommended.bdr)
          },
          highlight: {
            border: !obj.ref_type ? '#c253c2' : (obj.ref_type === 'required' ? color.required.bdr : color.recommended.bdr),
            background: 'white'
          }
        },
        shape: 'dot',
        size: 18
      });

      let parent: any;

      if (objHasParents && !node.find((_obj: any) => _obj.id === obj.id))
      {
        node.push(Object.assign({
          label: obj.id,
          ...nodeProps(obj)
        }, obj));
        
        pushNodesAndEdges();
      }
      else if (objHasParents)
        pushNodesAndEdges();

      // console.log(edge);

      function pushNodesAndEdges()
      {
        for (parent of parents)
        {
          if (!node.find((_obj: any) => _obj.id === parent.id))
            node.push(Object.assign({
              label: parent.id.length > 10 ? `${parent.id.substr(0, 10)}...` : parent.id,
              ...nodeProps(parent)
            }, parent));

          edge.push({
            from: obj.id,
            to: parent.id,
            arrows: 'to'
          });
          
          getNodesAndEdges(parent);
        }
      }
    }

    getNodesAndEdges(this.state.payload);

    

    // create an array with nodes
    let nodes = 
    // new vis.DataSet([
    //   {id: 1, label: 'Node 1'},
    //   {id: 2, label: 'Node 2'},
    //   {id: 3, label: 'Node 3'},
    //   {id: 4, label: 'Node 4'},
    //   {id: 5, label: 'Node 5'}
    // ]);
    new vis.DataSet(node);

    // create an array with edges
    let edges = 
    // new vis.DataSet([
    //   {from: 1, to: 3},
    //   {from: 1, to: 2},
    //   {from: 2, to: 4},
    //   {from: 2, to: 5},
    //   {from: 3, to: 3}
    // ]);
    new vis.DataSet(edge);

    // create a network
    let container: HTMLDivElement = this.findNode(this, '#graph');
    let data = {
      nodes: nodes,
      edges: edges
    };
    let options = {
      nodes: {borderWidth: 1.5},
      interaction: {hover: true}
    };
    let network = new vis.Network(container, data, options);
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
        <section className='ref-tab-wrapper' onClick={this.handleDropdownToggle}>
          <span>LC</span>
          <span style={refIDWrapperStyle}>
            <span
              className='ref-identifier'
              style={{
                opacity: this.state.refIsLoading ? 0 : 1,
                transition: '0.3s'
              }}>
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





