import React from 'react';
import ReactDOM from 'react-dom';
import Dropdown from './components/Dropdown';
import Gen_JSON_Mockup from './JSON_MockUp_Sample';
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
      activeTabName: 'required-tab',              //this and activeTabLink will be used heavily when going back in time and for reseting active tab and tab link and resizing dropdown height to activeTab in the past
      activeTabLinkName: 'required-tab-link',
      historyExists: false,                   //displays back button if true and hides if otherwise
      widgetHeight: 0,                        //same as this.height: only used as props for loader wrapper style height computation
    };
    this.height = 0;                          //holds constant actual value of Widget height 
    this.dropdown = undefined;                //child element of Widget   
    this.activeTabLink = undefined;           //tab link/button
    this.activeTab = undefined;               //active tab/dropdown for either of the three toggleable tabs
    this.history = [{}];                      //will hold the different state changes in order to enable going back in time
    this.resizeDropdownHeightTo = this.resizeDropdownHeightTo.bind(this);   //collapses or drops dropdown menu on toggle
    this.findNode = this.findNode.bind(this);     //ReactDOM traverser
  }

  

  handleDropdownToggle()
  {
    this.setState(prevState =>
    {
      let isCollapsed = prevState.dropdownIsCollapsed,
          dropdownNewHeight = this.resizeDropdownHeightTo(isCollapsed ? this.activeTab : 0);

      return {
        dropdownIsCollapsed: !isCollapsed,
        dropdownCurHeight: dropdownNewHeight,
        widgetHeight: this.height                   //set state constant value of widget Height. Used mainly as props for loader wrapper style height
      };
    });
  }



  handleTabToggle(e)
  {
    let activeTabName, tabLinks, tabs;

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
      //using another setState method here to update dropdown height to activeTab-height after it has been populated to avoid setting a height of 0 assuming it's done in the previous setState method
      this.setState(
      {
        dropdownCurHeight: this.resizeDropdownHeightTo(this.activeTab),
        historyExists: true,
        isLoading: false
      });
      
      this.history.push(this.state);                  //update history
    }, 1000);
  }


  
  //time traveller function
  goBackInTime()
  {
    let past,
        pastIndex = this.history.length - 2,
        backInTime = {},
        tabLinks = this.findNode(this, '.tab-link'),
        tabs = this.findNode(this, '.tab');

    if (pastIndex >= 0 && this.history[pastIndex])
      this.setState(varNotNeeded =>
      {
        past = this.history[pastIndex];

        for (let state in past)
          backInTime[state] = past[state];

        return backInTime;
      })
    else { this.setState({historyExists: false}); }

    //remove all current active tab and tablink classes
    tabLinks.forEach((tabLink, i) => 
    {
      tabLink.classList.remove('active-tab-link');
      tabs[i].classList.remove('active-tab');
    })

    //reset active tab and tabLink to active tab and tabLink in the past
    this.activeTab = this.findNode(this, `.${this.history[pastIndex].activeTabName}`);
    this.activeTab.classList.add('active-tab')
    this.activeTabLink = this.findNode(this, `.${this.history[pastIndex].activeTabLinkName}`);
    this.activeTabLink.classList.add('active-tab-link');
  
    this.history.pop();                     //remove/delete current past after going back in time
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

    //using for loop to set props in  history to avoid referencing this.state in history (assuming I used 'this.history.push(this.state)') due to the next two assignment lines after the for loop
    for (let prop in this.state)
      this.history[0][prop] = this.state[prop];

    this.history[0].dropdownCurHeight = this.resizeDropdownHeightTo(this.activeTab);      //unset history initial (first state) dropdown height from 0 to the current activeTab height to prevent dropdown from resizing to 0 on click of back button if history index is at 0.
    this.history[0].dropdownIsCollapsed = false;                       //prevent caret-icon-flip bug if gone back in time to first state i.e. if history index is at 0
  }



  render()
  {
    let refIDWrapperStyle =
        {
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
          handleTabToggle={this.handleTabToggle.bind(this)}
          handleReferenceClick={this.handleReferenceClick.bind(this)}
          goBackInTime={this.goBackInTime.bind(this)}
        />
      </div>
    );
  }
}



export default Widget;

