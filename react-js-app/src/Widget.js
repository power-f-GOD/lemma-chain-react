import React from 'react';
import ReactDOM from 'react-dom';
import Dropdown from './components/Dropdown';
import Gen_JSON_Mockup from './JSON_MockUp';
import Loader from './components/Loader';




class Widget extends React.Component
{
  constructor()
  {
    super();
    this.state = 
    {
      dropdownIsCollapsed: true,              //Boolean for dropdown toggle
      dropdownCurHeight: 0,                   //holds dropdown height value change
      refID: '9v7s4gtgt9',
      isLoading: false,
      payload: Gen_JSON_Mockup(),
      historyExists: false,
      widgetHeight: 0,                        //same as this.height: used as props for loader wrapper style height computation
    };
    this.height = 0;                          //holds constant actual value of Widget height 
    this.dropdown = undefined;                //child element of Widget   
    this.activeTabLink = undefined;           //tab link/button
    this.activeTab = undefined;               //active tab/dropdown for either of three toggleable tabs
    this.history = [];                        //will hold the different state changes in order to enable going back in time
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
        dropdownCurHeight: dropdownNewHeight,
        widgetHeight: this.height                   //set state constant value of widget Height. Used mainly as props for loader wrapper style height
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

    this.setState({isLoading: true});                 //first set loading to true to enable transition fadeout
    this.setState({payload: []})
    
    setTimeout(() =>                                  //in actual sense, this setTimeout function is a kinda 
    {                                                 //placeholder for the fetch/axios API call method
      this.setState({
        refID: refID,
        payload: Gen_JSON_Mockup()
      });
      //using another setState method here to update dropdown height to activeTab height after it has been populated to avoid getting a height of 0 assuming done in the previous setState method
      this.setState(
      {
        dropdownCurHeight: this.resizeDropdownHeightTo(this.activeTab),
        historyExists: true,
        isLoading: false
      });
      
      this.history.push(this.state);
    }, 1000);
  }



  goBackInTime()
  {
    let past,
        pastIndex = this.history.length - 2,
        backInTime = {};

    if (pastIndex >= 0 && this.history[pastIndex])
      this.setState(prevState =>
      {
        past = this.history[pastIndex];

        for (let state in past)
          backInTime[state] = past[state];

        return backInTime;
      })
    else { this.setState({historyExists: false}); }
    
    this.history.pop();                     //remove/delete last history state after going back in time
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
    this.height = this.findNode(this).offsetHeight;                      //now set value of constant Widget height
    this.dropdown = this.findNode(this, '.dropdown');     
    this.activeTabLink = this.findNode(this, '.active-tab-link');
    this.activeTab = this.findNode(this, '.required-tab');
    this.history.push(this.state);
    this.history[0].dropdownCurHeight = this.resizeDropdownHeightTo(this.activeTab);      //unset history initial (first state) dropdown height from 0 to the current activeTab height to prevent dropdown from resizing to 0 on click of back button if history index is at 0.
  }



  render()
  {
    let refIDWrapperStyle = {
          position: 'relative',
          display: 'flex',
          justifyContent: 'center'
        };

    return (
      <div className='widget'>
        <section
          className='ref-tab-wrapper'
          onClick={this.handleDropdownToggle.bind(this)}
        >
          <span>LC</span>
          <span style={refIDWrapperStyle}>
            <span
              className='ref-identifier'
              style={{opacity: this.state.isLoading ? 0 : 1}}
            >{this.state.refID}</span>
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
          handleTabToggle={this.handleTabToggle.bind(this)}
          handleReferenceClick={this.handleReferenceClick.bind(this)}
          goBackInTime={this.goBackInTime.bind(this)}
        />
      </div>
    );
  }
}



export default Widget;

