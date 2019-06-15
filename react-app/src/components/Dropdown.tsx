import React from 'react';
import Item from './Item';
import Loader from './Loader';



function Dropdown(props: any)
{
  return (
    <section className='dropdown' style={{height: props.state.dropdownCurHeight}}>
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
          onClick={props.handleTabToggle}
        >★</button>
      </div>
      <div className='tabs-container' style={{position: 'relative'}}>
        <Loader
          isLoading={props.state.isLoading}
          attributes={{
            size: 12,
            color: '#333',
            rider: 'Loading References...',
            type: 'major',
            wrapperHeight: props.state.dropdownCurHeight - props.state.widgetHeight
          }}
        />

        <div className='tabs-wrapper' style={{opacity: props.state.isLoading ? 0 : 1}}>
          <ul className={`tab required-tab active-tab ${!props.state.isMobileDevice ? 'usePCScrollBar' : null}`}> 
            {
              props.state.payload.map((ref: any, key: number) => 
                ref.ref_type === 'required' ? 
                <Item
                  title={ref.title}
                  author={ref.author}
                  id={ref.id}
                  key={key}
                  ref_type={ref.ref_type}
                  handleReferenceClick={props.handleReferenceClick}
                />
              : null)
            }
          </ul>
          <ul className={`tab recommended-tab ${!props.state.isMobileDevice ? 'usePCScrollBar' : ''}`}>
            {
              props.state.payload.map((ref: any, key: number) => 
                ref.ref_type === 'recommended' ? 
                <Item
                  title={ref.title}
                  author={ref.author}
                  id={ref.id}
                  key={key}
                  ref_type={ref.ref_type}
                  handleReferenceClick={props.handleReferenceClick}
                />
              : null)
            }
          </ul>
          <ul className={`tab graph-tab ${!props.state.isMobileDevice ? 'usePCScrollBar' : ''}`}>
            <div className='tab-items-wrapper graph-wrapper'>
              <h1 className='title'>GRAPH ZONE!</h1>
            </div>
          </ul>
        </div>
      </div>
    </section>
  );
}


export default Dropdown;