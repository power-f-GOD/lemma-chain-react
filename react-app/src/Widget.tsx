import React, { ReactInstance, CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import Dropdown from './components/Dropdown';
import Get_HardCoded_Refs from './JSON_MockUp_Sample';
import Loader from './components/Loader';
import vis, { Network } from 'vis';
import { setTimeout } from 'timers';



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
  graphNodeIsHovered: boolean;
  nodeIsActive: boolean
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
    errMsg: '',
    graphNodeIsHovered: false,
    nodeIsActive: false
  };

  height = 0;

  graph: any = {
    nodes: [],
    edges: []
  }

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
          //delay till state payload is set before visualizing to avoid errors
          setTimeout(() => this.visualizeGraph(), 300);
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

    //delay till state payload is set before visualizing to avoid errors
    setTimeout(() => this.visualizeGraph(), 300);
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



  /**
   * @param getGraphNodesAndEdges: gets and pushes graph nodes and edges to network for visualization
   */
  getGraphNodesAndEdges = (_ref: Payload): void =>
  {
    let ref: any = Object.assign({}, _ref),
        refHasParents = _ref.refs ? true : false,
        //making a copy of refs (parents) to avoid modifying actual parents
        parents = _ref.refs.map((parent: any) => Object.assign({}, parent)),
        colors = {
          self: {bg: '#a111a0', bdr: '#710070'},
          required: {bg: '#ff9c10', bdr: '#ef7c00'},
          recommended: {bg: '#20dcff', bdr: '#10bcf0'},
          alien: {bg: '#c0c0c0', bdr: '#b0b0b0'}
        };
    
    //using titles of books (refs) as parent/ref id's to avoid appending duplicate book titles to network
    parents.forEach((parent: any) => {
      parent._id = parent.id;
      parent.id = parent.data.title;
      return parent;
    });
    ref._id = ref.id;
    ref.id = ref.data.title;

    //returns object of node properties e.g. color, font, background, border etc.
    let nodeProps = (_ref: Payload) => 
    {
      let color: any = {};

      //i.e. if ref is not alien to current ref (book), proceed to add required/recommended colors
      if (this.state.payload.refs.find((ref: any) => _ref.data.title === ref.data.title))
      {
        color.bg = _ref.ref_type === 'required' ? colors.required.bg : colors.recommended.bg;
        color.bdr = _ref.ref_type === 'required' ? colors.required.bdr : colors.recommended.bdr;
      }
      else {
        color.bg = colors.alien.bg;
        color.bdr = colors.alien.bdr;
      }

      return {
        font: {
          size: 14,
          face: 'Google Sans, Roboto Mono, Trebuchet MS',
          color: !_ref.ref_type ? colors.self.bdr : color.bdr,
          strokeWidth: 1,
          strokeColor: 'white'
        },
        color: {
          background: !_ref.ref_type ? colors.self.bg : color.bg,
          border: !_ref.ref_type ? colors.self.bdr : color.bdr,
          hover: {
            background: 'white',
            border: !_ref.ref_type ? colors.self.bdr : color.bdr
          },
          highlight: {
            border: !_ref.ref_type ? colors.self.bdr : color.bdr,
            background: 'white'
          }
        },
        shape: 'dot',
        size: 16
      };
    };

    let pushNodesAndEdges = (): void =>
    {
      let parent: any;
      for (parent of parents)
      {
        //prepare and push nodes for visualization
        if (!this.graph.nodes.find((_obj: any) => _obj.data.title === parent.data.title))
          this.graph.nodes.unshift(Object.assign({
            title: parent.data.title,
            label: parent.data.title.length > 10 ? `${parent.data.title.substr(0, 10).trim()}...` : parent.data.title,
            ...nodeProps(parent)
          }, parent));

        //prepare and push edges for visualization
        this.graph.edges.unshift({
          from: ref.data.title,
          to: parent.data.title,
          label: parent.ref_type === 'required' ? 'rq' : 'rc',
          arrows: 'to',
          length: 150,
          font: {...nodeProps(parent).font, size: 9}
        });

        //QUOTE OF THE CENTURY: "To iterate is human, to recurse divine." - L. Peter Deutsch :D
        this.getGraphNodesAndEdges(parent);
      }
    }

    //i.e. if 'current' book (ref) has parents and itself has not yet been added to nodes (network), proceed to add
    if (refHasParents && !this.graph.nodes.find((_obj: any) => _obj.data.title === ref.data.title))
    {
      //first add current node (ref) to nodes before pushing other nodes to network
      this.graph.nodes.unshift(Object.assign(
      {
        label: ref.data.title.replace(/\s(\w+|\d+)\s(\w+|\d+)/, ' $1\n$2'),
        ...nodeProps(ref)
      }, ref));
      pushNodesAndEdges();
    }
    else if (refHasParents)
      pushNodesAndEdges();
  }



  /**
   * @param visualizeGraph: renders graph to DOM
   */
  visualizeGraph = (): void =>
  {
    this.graph = {
      nodes: [],
      edges: []
    };

    this.getGraphNodesAndEdges(this.state.payload);

        //create an array with nodes
    let nodes = new vis.DataSet(this.graph.nodes),
        //create an array with edges
        edges = new vis.DataSet(this.graph.edges),
        container: HTMLDivElement = this.findNode(this, '#graph'),
        //set graph data
        data = {
          nodes: nodes,
          edges: edges
        },
        //set graph options
        options = {
          nodes: {borderWidth: 1.5},
          interaction: {hover: true}
        },
        //create a network
        network: Network = new vis.Network(container, data, options),
        graphTooltipEl: HTMLDivElement = this.findNode(this, '.graph-tooltip');
        
    let moveAndUpdateGraphTooltip = (params: any): void => 
        {
          let label: string = !params.node ? params.nodes[0] : params.node,
              currentNode = this.graph.nodes.find((node: any) => label === node.data.title);
          graphTooltipEl.innerHTML = 
            `${currentNode.data.title}<br />
            <i style='font-size: 11px;'>
              ${!params.node ? currentNode.data.author : ''}
            </i>
            <span style='font-size: 9px;'>
              ${!params.node ? currentNode._id : ''}
            </span>`;
          graphTooltipEl.style.left = `${Math.ceil(params.pointer.DOM.x - 10)}px`;
          graphTooltipEl.style.top = `${Math.ceil(params.pointer.DOM.y - (!params.node ? 15 : 0))}px`;
        };
    
    //network nodes event listeners
    network.on('selectNode', params =>
    {
      this.setState({
        graphNodeIsHovered: true,
        nodeIsActive: true
      })
      moveAndUpdateGraphTooltip(params);
    });
    network.on('deselectNode', () => 
      this.setState({
        graphNodeIsHovered: false,
        nodeIsActive: false
      })
    );
    network.on('hoverNode', params => 
    {
      if (!this.state.nodeIsActive)
      {
        this.setState({graphNodeIsHovered: true});
        moveAndUpdateGraphTooltip(params);
      }
    });
    network.on('blurNode', () => this.setState({graphNodeIsHovered: this.state.nodeIsActive ? true : false}));
    network.on('zoom', () => this.setState({graphNodeIsHovered: false}));
    network.on('dragStart', () => this.setState({graphNodeIsHovered: false}));
    network.on('dragEnd', () => this.setState({graphNodeIsHovered: false}));
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
  
    //delay till state payload is set before visualizing to avoid errors
    setTimeout(() => this.visualizeGraph(), 300);
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





