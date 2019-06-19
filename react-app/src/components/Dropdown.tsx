import React, { CSSProperties } from 'react';
import Item from './Item';
import Loader from './Loader';
import { StateObject as StateObjectInterface } from '../Widget';



interface Props
{
  state: StateObjectInterface;
  [key: string]: any;
}



function Dropdown(props: Props): JSX.Element
{
  let requiredRefsExist = props.state.payload.refs.some((ref: {[key: string]: any}) => /required/.test(ref.ref_type)),
      recommendedRefsExist = props.state.payload.refs.some((ref: {[key: string]: any}) => /recommended/.test(ref.ref_type));

  let nothingToShowWrapperStyle: CSSProperties = 
      {
        padding: 80,
        color: '#888',
        fontStyle: 'italic',
        textAlign: 'center',
        position: 'relative'
      };
  

  function DisplayNothingToShowMessage(prop: {for_ref_type: string})
  {
    return (
      <div className='item-wrapper' style={nothingToShowWrapperStyle}>
        <span className='props'>Nothing to show.<br />Book has no <b>{prop.for_ref_type}</b> references.</span>
      </div>
    );
  }
  

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
          <ul className={`tab required-tab active-tab ${!props.state.isMobileDevice ? 'useCustomScrollBar' : null}`}> 
            {
              requiredRefsExist ?
                props.state.payload.refs.map((ref: any, key: number) => 
                  ref.ref_type === 'required' ? 
                  <Item
                    data={ref.data}
                    id={ref.id}
                    ref_type={`#${ref.ref_type}`}
                    key={key}
                    handleReferenceClick={props.handleReferenceClick}
                  />
                : null)
              : <DisplayNothingToShowMessage for_ref_type='required' />
            }
          </ul>
          <ul className={`tab recommended-tab ${!props.state.isMobileDevice ? 'useCustomScrollBar' : ''}`}>
            {
              recommendedRefsExist ?
                props.state.payload.refs.map((ref: any, key: number) => 
                  ref.ref_type === 'recommended' ? 
                  <Item
                  data={ref.data}
                    author={ref.author}
                    id={ref.id}
                    ref_type={`#${ref.ref_type}`}
                    key={key}
                    handleReferenceClick={props.handleReferenceClick}
                  />
                : null)
              : <DisplayNothingToShowMessage for_ref_type='recommended' />
            }
          </ul>
          <ul className={`tab graph-tab ${!props.state.isMobileDevice ? 'useCustomScrollBar' : ''}`}>
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