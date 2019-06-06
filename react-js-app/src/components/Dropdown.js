import React from 'react';
import Item from './Item';


function Dropdown(props)
{
  return (
    <section
      className='dropdown'
      style={{height: props.state.dropdownCurHeight}}
    >
      <div className='tab-links-wrapper'>
        <button className="back-btn">❮</button>
        <button
          className='required-tab-link tab-link active-tab-link'
          data-tab-name='required-tab'
          onClick={props.handleTabToggle}
        >Required</button>
        <button
          className='recommended-tab-link tab-link'
          data-tab-name='recommended-tab'
          onClick={props.handleTabToggle}
        >Recommended</button>
        <button
          className="graph-tab-link tab-link"
          data-tab-name='graph-tab'
          onClick={props.handleTabToggle}
        >★</button>
      </div>
      <div className='tabs-wrapper'>
        <ul className='tab required-tab active-tab'>
          <Item />
        </ul>
        <ul className='tab recommended-tab'>
          <Item />
          <Item />
        </ul>
        <ul className='tab graph-tab'>
          <div className='tab-items-wrapper graph-wrapper'>
            <h1 className='title'>GRAPH ZONE!</h1>
          </div>
        </ul>
      </div>
    </section>
  );
}


export default Dropdown;