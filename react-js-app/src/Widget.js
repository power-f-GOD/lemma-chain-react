import React from 'react';
import ReactDOM from 'react-dom';
import Dropdown from './components/Dropdown';
import Gen_JSON_Mockup from './JSON_MockUp';



class Widget extends React.Component
{
  constructor()
  {
    super();
    this.state = 
    {
      dropdownIsCollapsed: true,              //Boolean for dropdown toggle
      dropdownCurHeight: 0,                   //holds dropdown height value change
      refID: '9v7s4',
      payload: Gen_JSON_Mockup()
    };
    this.height = 0;                          //holds constant actual value of Widget height 
    this.dropdown = undefined;                //child element of Widget   
    this.activeTabLink = undefined;           //tab link/button
    this.activeTab = undefined;               //active tab/dropdown for either of three toggleable tabs
    this.resizeDropdownHeightTo = this.resizeDropdownHeightTo.bind(this);   //collapses or drops dropdown menu on toggle
    this.findNode = this.findNode.bind(this);     //ReactDOM traverser
  }
  

  handleDropdownToggle()
  {
    this.setState(prevState =>
    {
      let collapsed = prevState.dropdownIsCollapsed,
          dropdownNewHeight = this.resizeDropdownHeightTo(collapsed ? this.activeTab : 0);

      return {
        dropdownIsCollapsed: !collapsed,
        dropdownCurHeight: dropdownNewHeight
      };
    });
  }


  handleTabToggle(e)
  {
    let activeTabName, tabLinks, tabs;

    this.activeTabLink = e.currentTarget;
    activeTabName = this.activeTabLink.getAttribute('data-tab-name');
    this.activeTab = this.findNode(this, `.${activeTabName}`);
    tabLinks = this.findNode(this, '.tab-link');
    tabs = this.findNode(this, '.tab');

    //remove all 'active' classNames from tabs and links
    tabLinks.forEach((tabLink, i) =>
    {
      tabLink.classList.remove('active-tab-link');
      tabs[i].classList.remove('active-tab');
    })
    //add 'active' classNames to active tab and link
    this.activeTabLink.classList.add('active-tab-link');
    this.activeTab.classList.add('active-tab');
    
    this.setState({ 
      dropdownCurHeight: this.resizeDropdownHeightTo(this.activeTab) 
    });
  }


  handleReferenceClick(e)
  {
    let refID = e.currentTarget.dataset.id;

    setTimeout(() =>
    {
      this.setState({refID: refID});
    }
    , 500)
  }


  resizeDropdownHeightTo(activeTab, constHeight = this.height)
  {
    //i.e. if the argument, activeTab, is an element and not a number (0)...
    return activeTab !== 0 ? (activeTab.offsetHeight + constHeight) : 0;
  }


  //ReactDOM traverser function
  findNode(parent, childName)
  {
    let DOMp = ReactDOM.findDOMNode(parent),
        queryAll = DOMp.querySelectorAll(childName);

    if (childName)
      return queryAll[1] ? queryAll : DOMp.querySelector(childName);
    return DOMp;
  }


  componentDidMount()
  {
    this.height = this.findNode(this).offsetHeight;     //now set value of constant Widget height
    this.dropdown = this.findNode(this, '.dropdown');     
    this.activeTabLink = this.findNode(this, '.active-tab-link');
    this.activeTab = this.findNode(this, '.required-tab');
  }


  render()
  {
    return (
      <div className='widget'>
        <section
          className='ref-tab-wrapper'
          onClick={this.handleDropdownToggle.bind(this)}
        >
          <span>LC</span>
          <span className='ref-identifier'>{this.state.refID}</span>
          <span className={`caret-icon ${this.state.dropdownIsCollapsed ? 'flip-caret-icon' : ''}`}>❮</span>
        </section>
        <Dropdown
          state={this.state}
          handleTabToggle={this.handleTabToggle.bind(this)}
          handleReferenceClick={this.handleReferenceClick.bind(this)}
        />
      </div>
    );
  }
}


export default Widget;

