import React from 'react';
import TabLinks from './TabLinks';
import Item from './Item';
import Loader from './Loader';
import DisplayStatusMessage from './DisplayStatusMessage';
import { StateObject } from '../Widget';



export interface Props
{
  state: StateObject;
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
      <TabLinks
        state={props.state}
        goBackInTime={props.goBackInTime}
        handleTabToggle={props.handleTabToggle}
      />
      <div className='tabs-container' style={{position: 'relative'}}>
        <Loader
          refIsLoading={props.state.refIsLoading}
          attributes={{
            size: 12,
            color: 'rgb(145, 0, 145)',
            rider: 'Loading References...',
            type: 'major',
            wrapperHeight: props.state.dropdownCurHeight - props.height
          }}
        />
        <div className='tabs-wrapper' style={{opacity: props.state.refIsLoading ? 0 : 1}}>
          <ul className={`tab required-tab active-tab ${!props.isViewedWithMobile ? 'useCustomScrollBar' : null}`}> 
            {
              props.state.errOccurred ?
                <DisplayStatusMessage
                  typeofMsg='error'
                  errMsg={props.state.errMsg}
                  ref_type='required'
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
                : <DisplayStatusMessage typeofMsg='no-ref' ref_type='required' />
            }
          </ul>
          <ul className={`tab recommended-tab ${!props.isViewedWithMobile ? 'useCustomScrollBar' : ''}`}>
            {
              props.state.errOccurred ?
                <DisplayStatusMessage
                  typeofMsg='error'
                  errMsg={props.state.errMsg}
                  ref_type='recommended'
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
                : <DisplayStatusMessage
                    typeofMsg='no-ref'
                    ref_type='recommended'
                    errMsg=''
                  />
            }
          </ul>
          <ul className={`tab graph-tab ${!props.isViewedWithMobile ? 'useCustomScrollBar' : ''}`}>
            { 
              ifCanVisualizeGraph ? renderGraph
                : <DisplayStatusMessage
                    typeofMsg='no-ref'
                    ref_type='graph'
                    errMsg={props.state.errMsg}
                  />
            }
          </ul>
        </div>
      </div>
    </section>
  );
}



export default Dropdown;



