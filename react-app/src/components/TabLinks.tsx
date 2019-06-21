import React from 'react';
import { Props } from './Dropdown';



export default function TabLinks(props: Props)
{
  return (
    <div className='tab-links-wrapper'>
      <button
        className='back-btn'
        title='Go back in time! ;)'
        onClick={props.goBackInTime}
        style={{width: props.state.historyExists ? 55 : 0}}
      >❮</button>
      <button
        className='required-tab-link tab-link active-tab-link'
        title='Required references'
        data-tab-name='required-tab'
        onClick={props.handleTabToggle}
      >Required</button>
      <button
        className='recommended-tab-link tab-link'
        title='Recommended references'
        data-tab-name='recommended-tab'
        onClick={props.handleTabToggle}
      >Recommended</button>
      <button
        className="graph-tab-link tab-link"
        title='View graph'
        data-tab-name='graph-tab'
        style={{background: /graph/.test(props.state.activeTabName) ? 'rgb(12, 179, 225)' : ''}}
        onClick={props.handleTabToggle}
      >★</button>
    </div>
  )
}