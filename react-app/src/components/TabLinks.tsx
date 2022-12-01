import React from 'react';
import { Props } from './Dropdown';
import { getCSSProps } from '../ThemeCSS';



export default function TabLinks(props: Props)
{
  return (
    <div className='tab-links-wrapper' style={{height: props.state.dropdownIsCollapsed ? 0 : 48}}>
      <button
        className='back-btn'
        title='Go back in time! ;)'
        onClick={props.goBackInTime}
        style={{width: props.state.historyExists ? 55 : 0}}
      >❮</button>
      <button
        className={`required-tab-link tab-link 
          ${/required/.test(props.state.activeTabName) ? 'active-tab-link' : ''}`}
        title='Required references'
        data-tab-name='required-tab'
        onClick={props.handleTabToggle}
      >Required</button>
      <button
        className={`recommended-tab-link tab-link 
          ${/recommended/.test(props.state.activeTabName) ? 'active-tab-link' : ''}`}
        title='Recommended references'
        data-tab-name='recommended-tab'
        onClick={props.handleTabToggle}
      >Recommended</button>
      <button
        className={`graph-tab-link tab-link
          ${/graph/.test(props.state.activeTabName) ? 'active-tab-link' : ''}`}
        title='View graph'
        data-tab-name='graph-tab'
        style={{background: /graph/.test(props.state.activeTabName) ? getCSSProps().graphTablinkHoverBg : ''}}
        onClick={props.handleTabToggle}
      >★</button>
    </div>
  )
}