import React, { ReactInstance, CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import Dropdown from './components/Dropdown';
import Loader from './components/Loader';
import vis, { Network, Options } from 'vis';
import { setTimeout } from 'timers';
import Get_HardCoded_Refs from './JSON_MockUp_Sample';
import { getCSSProps } from './ThemeCSS';
import widgetconfig from './widgetconfig.json';



export interface Payload
{
  data: {
    title: string,
    authors: string[],
    url?: string;
  };
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
  graphNodeIsActive: boolean;
  tooltipIsActive: boolean;
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
    refID: '@powerofgod/17t8kcjuw',
    activeTabName: 'required-tab',
    activeTabLinkName: 'required-tab-link',
    historyExists: false,
    refIsLoading: true,
    payload: {
      data: {
        title: '',
        authors: [''],
        url: ''
      },
      id: '',
      refs: [{}]
    },
    errOccurred: false,
    errMsg: '',
    graphNodeIsHovered: false,
    graphNodeIsActive: false,
    tooltipIsActive: false
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

  serverHostURL: string = /localhost/.test(window.location.href) ? 'localhost:1323' : widgetconfig.lemmaChainServerHost;

  //copy initial/first state object and set at index 0 of history
  history: State[] = [];

  cssProps = getCSSProps();

  

  handleDropdownToggle = (e: any) =>
  {
    if (e.target.className.match('ref-identifier'))
      this.setState({tooltipIsActive: !this.state.tooltipIsActive});
    else {
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
  }



  copyRefID = (e: React.MouseEvent<HTMLButtonElement>) =>
  {
    let tooltip = e.currentTarget,
        refIDInputEl = this.findNode(this, '#refIDCopy');
    
    refIDInputEl.select();
    document.execCommand("copy");
    tooltip.innerHTML = 'Copied to clipboard';
    setTimeout(() => {
      this.setState({tooltipIsActive: false});
      setTimeout(() => {
        tooltip.innerHTML = 'Copy';
      }, 300);
    }, 1500);
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
  handleReferenceClick = (e: any): void =>
  {
    //i.e. if link is clicked, prevent click event for ref
    if (/extern-link/.test(e.target.className))
      return;
    
    let refID: any = e.currentTarget.dataset.id;

    //first set loading to true to visualize fadeout
    this.setState({refIsLoading: true});

    setTimeout(() => 
    {
      let ref: any;
      for (ref of this.state.payload.refs)
      {
        if (ref.id === refID)
        {
          this.setState({
            refID: ref.id,
            payload: ref
          });
          setTimeout(() => 
          {
            this.setState({
              refIsLoading: false,
              historyExists: true,
              dropdownCurHeight: this.resizeDropdownHeightTo(this.activeTab)
            });
            //update history
            this.history.push(Object.assign({}, this.state));
            //delay till state payload is set before visualizing to avoid errors
            setTimeout(() => this.visualizeGraph(), 200);
          }, 300)
          break;
        }
        else continue;
      }
    }, 300);
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
    setTimeout(() => this.visualizeGraph(), 200);
  }



  /**
   * @param resizeDropdownHeightTo: Returns height of current activeTab, or 0 if 'dropdownIsCollapsed'; used to compute and set height of dropdown menu
   */
  resizeDropdownHeightTo(activeTab: any, constHeight = this.height): number
  {
    //i.e. if the argument, activeTab, is an element and not a number (0)... PS: Add 2px for border-bottom extension
    return activeTab !== 0 ? (activeTab.offsetHeight + constHeight) + 2 : 0;
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
   * @param setGraphNodesAndEdges: gets and pushes graph nodes and edges to network for visualization
   */
  setGraphNodesAndEdges = (_ref: Payload): void =>
  {
    let themeCSS = this.cssProps,
        ref: any = Object.assign({}, _ref),
        refHasParents = _ref.refs.length > 0 ? true : false,
        //making a copy of refs (parents) to avoid modifying actual parents
        parents = _ref.refs.map((parent: any) => Object.assign({}, parent)),
        colors = {
          self: {bg: themeCSS.graphCurrentNodeBg, bdr: themeCSS.graphCurrentNodeBorderColor},
          required: {bg: themeCSS.graphParentNodesBg, bdr: themeCSS.graphParentNodesBorderColor},
          recommended: {bg: '#20dcff', bdr: '#10bcf0'},
          alien: {bg: '#c0c0c0', bdr: '#b0b0b0'},
          other: {bg: themeCSS.graphParentNodesBg, bdr: themeCSS.graphParentNodesBorderColor}
        };

        
    //returns object of node properties e.g. color, font, background, border etc.
    let nodeProps = (_ref: Payload): object => 
    {
      let color: any = {},
          isCurrentRef: boolean = _ref.id === this.state.refID;

      //i.e. if ref is not alien to current ref (book), proceed to add required/recommended colors
      // if (this.state.payload.refs.find((ref: any) => _ref.id.replace(/.*\/(.*)/, '$1') === ref.id.replace(/.*\/(.*)/, '$1')))
      // {
      //   color.bg = _ref.ref_type === 'required' ? colors.required.bg : colors.recommended.bg;
      //   color.bdr = _ref.ref_type === 'required' ? colors.required.bdr : colors.recommended.bdr;
      // }
      // else {
        color.bg = colors.other.bg;
        color.bdr = colors.other.bdr;
      // }

      return {
        font: {
          size: 14,
          face: 'Google Sans, Roboto Mono, Trebuchet MS',
          color: isCurrentRef ? colors.self.bdr : color.bdr,
          strokeWidth: 1,
          strokeColor: this.cssProps.dropdownBg
        },
        color: {
          background: isCurrentRef ? colors.self.bg : color.bg,
          border: isCurrentRef ? colors.self.bdr : color.bdr,
          hover: {
            background: this.cssProps.dropdownBg,
            border: isCurrentRef ? colors.self.bdr : color.bdr
          },
          highlight: {
            border: isCurrentRef ? colors.self.bdr : color.bdr,
            background: this.cssProps.dropdownBg
          }
        },
        shape: 'dot',
        size: 16
      };
    };

    let pushNodesAndEdges = (): void =>
    {
      let parent: Payload;
      for (parent of parents)
      {
        let _nodeProps: any = nodeProps(parent),
            nodeExists: boolean = false;

        //prepare and push nodes for visualization. 
        //PS: If parent (ref) doesn't already exist in network, push to network
        for (let node of this.graph.nodes)
        {
          if (node.id.replace(/.*\/(.*)/, '$1') === parent.id.replace(/.*\/(.*)/, '$1'))
          {
            nodeExists = true;
            break;
          }
        }

        if (!nodeExists)
        {
          this.graph.nodes.unshift(Object.assign({
            _id: parent.id,
            title: parent.data.title,
            label: parent.data.title.length > 10 ? `${parent.data.title.substr(0, 10).trim()}...` : parent.data.title,
            ..._nodeProps
          }, parent));
          //extract hashID part of refID
          this.graph.nodes[0].id = parent.id.replace(/.*\/(.*)/, '$1');
        }
          

        //prepare and push edges for visualization
        this.graph.edges.unshift({
          from: ref.id.replace(/.*\/(.*)/, '$1'),
          to: parent.id.replace(/.*\/(.*)/, '$1'),
          arrows: 'to',
          length: 50,
          font: {..._nodeProps.font, size: 9},
          color: { 
            color: parent.ref_type === 'required' ? this.cssProps.graphNetworkRequiredEdgeColor : this.cssProps.graphNetworkRecommendedEdgeColor,
            highlight: parent.ref_type === 'required' ? this.cssProps.graphNetworkRequiredEdgeColor : this.cssProps.graphNetworkRecommendedEdgeColor,
            hover: parent.ref_type === 'required' ? this.cssProps.graphNetworkRequiredEdgeColor : this.cssProps.graphNetworkRecommendedEdgeColor
          }
        });

        //QUOTE OF THE CENTURY: "To iterate is human, to recurse divine." - L. Peter Deutsch :D
        this.setGraphNodesAndEdges(parent);
      }
    }

    //i.e. if 'current' book (ref) has parents and itself has not yet been added to nodes (network), proceed to add
    if (refHasParents && !this.graph.nodes.find((node: any) => node.id.replace(/.*\/(.*)/, '$1') === ref.id.replace(/.*\/(.*)/, '$1')))
    {
      //first add current node (ref) to nodes before pushing other nodes to network
      this.graph.nodes.unshift(Object.assign(
      {
        _id: ref.id,
        label: ref.data.title.replace(/\s(\w+|\d+)\s(\w+|\d+)/, ' $1\n$2'),
        ...nodeProps(ref)
      }, ref));
      //extract hashID part of refID
      this.graph.nodes[0].id = ref.id.replace(/.*\/(.*)/, '$1');
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

    this.setGraphNodesAndEdges(this.state.payload);

    //if no nodes exist (which implies no parent(s)), do not proceed to visualize graph to avoid errors
    if (this.graph.nodes.length < 1)
      return;

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
        options: Options = {
          nodes: {borderWidth: 1.5},
          edges: {
            color: { inherit: false }
          },
          interaction: {hover: true}
        },
        //create a network
        network: Network = new vis.Network(container, data, options),
        graphTooltipEl: HTMLDivElement = this.findNode(this, '.graph-tooltip');
        
    let moveAndUpdateGraphTooltip = (params: any): void => 
        {
          //'params.node' implies event is triggered by node-hover event while 'params.nodes[0]' implies event is triggered by node-click event
          let label: string = !params.node ? params.nodes[0] : params.node,
              currentNode = this.graph.nodes.find((node: any) => label === node.id);

          graphTooltipEl.innerHTML = 
            `${currentNode.data.title}<br />
            <i style='font-size: 11px;'>
              ${!params.node ? currentNode.data.authors.join(', ') : ''}
            </i>
            <span style='font-size: 9px;'>
              ${!params.node ? currentNode._id : ''}
            </span>`;
          graphTooltipEl.style.left = `${Math.ceil(params.pointer.DOM.x) - 10}px`;
          graphTooltipEl.style.top = `${Math.ceil(params.pointer.DOM.y) - (!params.node ? 15 : 0)}px`;
        };
    
    //network nodes event listeners
    network.on('selectNode', params =>
    {
      this.setState({
        graphNodeIsHovered: true,
        graphNodeIsActive: true
      })
      moveAndUpdateGraphTooltip(params);
    });
    network.on('deselectNode', () => 
      this.setState({
        graphNodeIsHovered: false,
        graphNodeIsActive: false
      })
    );
    network.on('hoverNode', params => 
    {
      if (!this.state.graphNodeIsActive)
      {
        this.setState({graphNodeIsHovered: true});
        moveAndUpdateGraphTooltip(params);
      }
    });
    network.on('blurNode', () => this.setState({graphNodeIsHovered: this.state.graphNodeIsActive ? true : false}));
    network.on('dragStart', () => this.setState({graphNodeIsHovered: false}));
    network.on('dragEnd', () => this.setState({graphNodeIsHovered: false}));
    
    let graphIsZoomed = false,
        initialScale = this.graph.nodes.length < 10 ? 0.85 : 0.55;

    network.on('zoom', (params) => 
    {
      initialScale = network.getScale();
      this.setState({graphNodeIsHovered: false});
    });
    network.on('doubleClick', () => 
    {
      if (!graphIsZoomed)
        network.moveTo({scale: initialScale + 0.5});
      else
        network.moveTo({scale: initialScale});
      graphIsZoomed = !graphIsZoomed;
    });
    network.once('stabilized', () => network.moveTo({scale: initialScale}));
  }



  async componentDidMount()
  {
    //check what device user is running
    if (/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i.test(window.navigator.userAgent))
      this.isViewedWithMobile = true;

    //now set value of constant Widget height which will also be used in computing loader wrapper height in Dropdown.tsx
    this.height = this.findNode(this).offsetHeight;
    this.dropdown = this.findNode(this, '.dropdown');     
    this.activeTabLink = this.findNode(this, '.active-tab-link');
    this.activeTab = this.findNode(this, '.required-tab');
    
    this.setState({refIsLoading: true});
    
    try
    {
      await fetch(`http://${this.serverHostURL}/${this.state.refID}`)
        .then((response: Response) => response.json())
        .then((data: Payload) =>
        {
          //throw Error (i.e. do not proceed to try populating UI) if server returns an error [message]
          if (Object.keys(data).includes('error'))
            throw new Error(data.error);
          else 
          {
            this.setState({ payload: data });
            //using another setState method here to update dropdown height to activeTab-height after it has been populated to avoid setting a height of 0 assuming it's done in the previous setState method
            this.setState({
              errOccurred: false,
              refIsLoading: false,
              dropdownCurHeight: !this.state.dropdownIsCollapsed ? this.resizeDropdownHeightTo(this.activeTab) : this.state.dropdownCurHeight
            });
          }
          //delay till state payload is set before visualizing to avoid errors
          setTimeout(() => this.visualizeGraph(), 200);
        })
    }
    //NOTE: This block of code must be re-edited for production. It was modified just for testing purposes
    //TO-DO: Remodify code: Make url prop not optional in Payload interface at very top...
    catch (e) 
    {
      //TO-DO: delete this line in production
      alert('Hi, there. \n\nLemma Chain GUI could not establish connection with server, hence, got hard-coded refs instead for testing purposes.\n\n- Godspower');

      //just for proper English grammar sentence casing
      let errMsg = String(e).replace(/(\w+)?error:/i, '').trim(),
          appendDot = errMsg.substr(-1) !== '.' ? `${errMsg}.` : errMsg,
          grammarfiedErrMsg = appendDot.charAt(0).toUpperCase() + appendDot.substr(1,);

      this.setState({
        //TO-DO: delete this line in production
        payload: Get_HardCoded_Refs(),
        //TO-DO: uncomment this line in production
        // errOccurred: true,
        errMsg: `${grammarfiedErrMsg}`,
        refIsLoading: false
      });
      //HACK: The following setTimeout function is for a case where user toggles dropdown while Lemma Chain is still fetching data and has not yet resolved
      //PS: Delay till after above state props is set in order to correctly set dropdown height
      setTimeout(() => 
      {
        this.setState({
          dropdownCurHeight: !this.state.dropdownIsCollapsed ? this.resizeDropdownHeightTo(this.activeTab) : this.state.dropdownCurHeight
        });
        //TO-DO: delete this line in production
        this.visualizeGraph();
      }, 200);
    }
    finally 
    {
      
      //hide clipboard tool-tip if anywhere else in document/page is clicked
      document.body.onclick = (e: any) => 
      {
        if (!/tool-tip|ref-identifier/.test(e.target.className))
          this.setState({tooltipIsActive: false});
      }

      let googleFontCDN = document.getElementById('font-cdn') as HTMLElement;

      //HACK: This is for to wait or delay till fonts are loaded before getting height of activeTab in order not to get a height below height of tab with loaded fonts since offset height of container is set to auto and relative to size of font
      let awaitFontLoad = async () => 
      {
        try { await fetch(`${googleFontCDN.getAttribute('href')}`); }
        finally 
        {
          //set maximum height of dropdown to height of three items [before adding scroll bar]
          let heightRef = this.findNode(this, '.item-wrapper')[0].offsetHeight;
          this.findNode(this, '.tab').forEach((tab: any) => 
          {
            //exclude graph-tab from getting max-height since graph should be displayed full
            if (!/graph-tab/.test(tab.className))
              tab.style.maxHeight = `${heightRef * (widgetconfig.widgetMaxNumOfRefsDisplayableAtOnce || 3) + 2}px`;
          });
          //HACK: unset history initial (first state) dropdown height from 0 to current activeTab height to prevent dropdown from resizing to 0 on click of back button assuming history index is at 0 (first state).
          this.history[0].dropdownCurHeight = this.resizeDropdownHeightTo(this.activeTab);
          this.history[0].dropdownIsCollapsed = false;
        }
      }
      awaitFontLoad();

      //update history
      this.history.push(Object.assign({}, this.state));
    }
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
        <button
          className={`tool-tip ${this.state.tooltipIsActive ? '' : 'fade-out'}`}
          onClick={this.copyRefID}>Copy
        </button>
        <section className='dropdown-toggle-bar' onClick={this.handleDropdownToggle}>
          <span>LC</span>
          <span style={refIDWrapperStyle}>
            <span
              className='ref-identifier'
              title={`Title: ${this.state.payload.data.title}\nAuthor(s): ${this.state.payload.data.authors.join(', ')}\nRef. ID: ${this.state.refID}`}
              style={{
                opacity: this.state.refIsLoading ? 0 : 1,
                transition: '0.3s'
              }}>
              {this.state.refID.length > 20 ? `${this.state.refID.substr(0, 20)}...` : this.state.refID}
              {/*HACK: This is for copying to clipboard as _NODE_.select() doesn't work for non-input elements, and TypeScript throws some error when trying to 'window.getSelection()'*/}
              <input
                type='text'
                value={this.state.refID}
                id='refIDCopy'
                style={{
                  position: 'absolute',
                  width: 1,
                  height: 1,
                  border: 'none',
                  top: -100
                }}
                onChange={(e) => e.target.value = this.state.refID}
              />
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





