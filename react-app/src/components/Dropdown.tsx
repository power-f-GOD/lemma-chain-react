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
  let requiredRefExists: boolean = props.state.payload.refs.some((ref: any) => /required/.test(ref.ref_type)),
      recommendedRefExists: boolean = props.state.payload.refs.some((ref: any) => /recommended/.test(ref.ref_type)),
      ifCanVisualizeGraph: boolean = (requiredRefExists || recommendedRefExists) && !props.state.errOccurred,
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
          <ul className={`tab required-tab
            ${/required/.test(props.state.activeTabName) ? 'active-tab' : ''}
            ${!props.isViewedWithMobile ? 'useCustomScrollBar' : ''}`}
            // style={{opacity: /required/.test(props.state.activeTabName) ? 1 : 0}}
          > 
            {
              props.state.errOccurred ?
                <DisplayStatusMessage
                  typeofMsg='error'
                  errMsg={props.state.errMsg}
                  ref_type='required'
                  refIsLoading={props.state.refIsLoading}
                />
              : requiredRefExists ?
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
                : <DisplayStatusMessage 
                    typeofMsg='no-ref'
                    ref_type='required'
                    refIsLoading={props.state.refIsLoading}
                  />
            }
          </ul>

          <ul className={`tab recommended-tab
            ${/recommended/.test(props.state.activeTabName) ? 'active-tab' : ''}
            ${!props.isViewedWithMobile ? 'useCustomScrollBar' : ''}`}
            // style={{opacity: /recommended/.test(props.state.activeTabName) ? 1 : 0}}
          >
            {
              props.state.errOccurred ?
                <DisplayStatusMessage
                  typeofMsg='error'
                  errMsg={props.state.errMsg}
                  ref_type='recommended'
                  refIsLoading={props.state.refIsLoading}
                />
              : recommendedRefExists ?
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
                    refIsLoading={props.state.refIsLoading}
                  />
            }
          </ul>
          
          <ul className={`tab graph-tab
            ${/graph/.test(props.state.activeTabName) ? 'active-tab' : ''}
            ${!props.isViewedWithMobile ? 'useCustomScrollBar' : ''}`}
            // style={{opacity: /graph/.test(props.state.activeTabName) ? 1 : 0}}
          >
            { 
              ifCanVisualizeGraph ? renderGraph
                : <DisplayStatusMessage
                    typeofMsg='no-ref'
                    ref_type='graph'
                    errMsg={props.state.errMsg}
                    refIsLoading={props.state.refIsLoading}
                  />
            }
          </ul>
        </div>
      </div>
    </section>
  );
}



export default Dropdown;



