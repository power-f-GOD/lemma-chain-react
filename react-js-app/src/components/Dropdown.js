import React from 'react';
import Item from './Item';
import Loader from './Loader';


function Dropdown(props)
{
  return (
    <section
      className='dropdown'
      style={{height: props.state.dropdownCurHeight}}
    >
      <div className='tab-links-wrapper'>
        <button
          className="back-btn"
          onClick={props.goBackInTime}
          style={{width: props.state.historyExists ? 55 : 0}}
        >❮</button>
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
      <div
        className='tabs-container'
        style={{position: 'relative'}}
      >
        <Loader
          isLoading={props.state.isLoading}
          attributes={{
            size: 12,
            color: 'white',
            rider: 'Loading References...',
            type: 'major'
          }}
        />

        <div
          className='tabs-wrapper'
          style={{opacity: props.state.isLoading ? 0 : 1}}
        >
          <ul className='tab required-tab active-tab'> 
            {
              props.state.payload.map((ref, key) => 
                ref.ref_type === 'required' ? 
                <Item
                  title={ref.title}
                  author={ref.author}
                  id={ref.id}
                  key={key}
                  ref_type={ref.ref_type}
                  handleReferenceClick={props.handleReferenceClick}
                /> : null)
            }
          </ul>
          <ul className='tab recommended-tab'>
            {
              props.state.payload.map((ref, key) => 
                ref.ref_type === 'recommended' ? 
                <Item
                  title={ref.title}
                  author={ref.author}
                  id={ref.id}
                  key={key}
                  ref_type={ref.ref_type}
                  handleReferenceClick={props.handleReferenceClick}
                /> : null)
            }
          </ul>
          <ul className='tab graph-tab'>
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