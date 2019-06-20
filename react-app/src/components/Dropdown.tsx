import React from 'react';
import Item from './Item';
import Loader from './Loader';
import DisplayStatusMessage from './DisplayStatusMessage';
import { StateObject as StateObjectInterface } from '../Widget';



interface Props
{
  state: StateObjectInterface;
  [key: string]: any;
}



function Dropdown(props: Props)
{
  let requiredRefsExist: boolean = props.state.payload.refs.some((ref: any) => /required/.test(ref.ref_type)),
      recommendedRefsExist: boolean = props.state.payload.refs.some((ref: any) => /recommended/.test(ref.ref_type)),
      ifCanVisualizeGraph: boolean = (requiredRefsExist || recommendedRefsExist) && !props.state.errOccurred,
      renderGraph: React.ReactElement = 
        <div className='tab-items-wrapper graph-wrapper'>
          <h1 className='title'>GRAPH BE VISUALIZED!</h1>
        </div>;
  
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
            color: 'rgb(204, 0, 100)',
            rider: 'Loading References...',
            type: 'major',
            wrapperHeight: props.state.dropdownCurHeight - props.height
          }}
        />

        <div className='tabs-wrapper' style={{opacity: props.state.isLoading ? 0 : 1}}>
          <ul className={`tab required-tab active-tab ${!props.state.isMobileDevice ? 'useCustomScrollBar' : null}`}> 
            {
              props.state.errOccurred ?
                <DisplayStatusMessage
                  type='error'
                  errMsg={props.state.errMsg}
                  for_ref_type='required'
                />
              : requiredRefsExist ?
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
                : <DisplayStatusMessage type='no-ref' for_ref_type='required' />
            }
          </ul>
          <ul className={`tab recommended-tab ${!props.state.isMobileDevice ? 'useCustomScrollBar' : ''}`}>
            {
              props.state.errOccurred ?
                <DisplayStatusMessage
                  type='error'
                  errMsg={props.state.errMsg}
                  for_ref_type='recommended'
                />
              : recommendedRefsExist ?
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
                : <DisplayStatusMessage type='no-ref' for_ref_type='recommended' />
            }
          </ul>
          <ul className={`tab graph-tab ${!props.state.isMobileDevice ? 'useCustomScrollBar' : ''}`}>
            { ifCanVisualizeGraph ? renderGraph : <DisplayStatusMessage type='no-ref' for_ref_type='graph' /> }
          </ul>
        </div>
      </div>
    </section>
  );
}



export default Dropdown;



