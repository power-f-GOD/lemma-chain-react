import React from 'react';
import TabLinks from './TabLinks';
import Item from './Item';
import Loader from './Loader';
import DisplayStatusMessage from './DisplayStatusMessage';
import { State } from '../Widget';
import { getCSSProps } from '../ThemeCSS';



export interface Props
{
  state: State;
  [key: string]: any;
}



function Dropdown(props: Props)
{
  let requiredRefExists: boolean = props.state.payload.refs.some((ref: any) => /required/.test(ref.ref_type)),
      recommendedRefExists: boolean = props.state.payload.refs.some((ref: any) => /recommended/.test(ref.ref_type)),
      ifCanVisualizeGraph: boolean = (requiredRefExists || recommendedRefExists) && !props.state.errOccurred,
      renderGraph: React.ReactElement = 
        <div className='tab-items-wrapper graph-wrapper'>
          <h5 className='title'>Graph (Node) Visualization of Refs:</h5>
          <div id='graph'></div>
          <div id='graph-key'>
            Key:<br />
            <span className='key key-current'></span> current ref.<br />
            <span className='key key-other'></span> other ref(s).<br />
            <span className='key key-line-required'></span> required parent(s)<br />
            <span className='key key-line-recommended'></span> recommended parent(s)
          </div>
          <span className={`graph-tooltip ${props.state.graphNodeIsHovered ? '' : 'fade-out'}`}></span>
        </div>;


  return (
    <section className='dropdown' style={{height: props.state.dropdownCurHeight, borderBottomWidth: props.state.dropdownIsCollapsed ? 0 : 2}}>
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
            color: getCSSProps().themeBg,
            rider: props.state.payload.id ? 'Populating References...' : 'Loading References...',
            type: 'major',
            wrapperHeight: props.state.dropdownCurHeight - props.height
          }}
        />
        <div className='tabs-wrapper' style={{opacity: props.state.refIsLoading ? 0 : 1}}>
          <ul className={`tab required-tab
            ${/required/.test(props.state.activeTabName) ? 'active-tab' : ''}
            ${!props.isViewedWithMobile ? 'useCustomScrollBar' : ''}`}> 
            {
              props.state.errOccurred ?
                <DisplayStatusMessage
                  typeofMsg='error'
                  errOccurred={props.state.errOccurred}
                  ref_type='required'
                  refIsLoading={props.state.refIsLoading}
                />
              : requiredRefExists ?
                  props.state.payload.refs.map((ref: any, key: number) => 
                    ref.ref_type === 'required' ? 
                    <Item
                      data={ref.data}
                      id={ref.id}
                      refs={ref.refs}
                      externLink='#!'
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
            ${!props.isViewedWithMobile ? 'useCustomScrollBar' : ''}`}>
            {
              props.state.errOccurred ?
                <DisplayStatusMessage
                  typeofMsg='error'
                  errOccurred={props.state.errOccurred}
                  ref_type='recommended'
                  refIsLoading={props.state.refIsLoading}
                />
              : recommendedRefExists ?
                  props.state.payload.refs.map((ref: any, key: number) => 
                    ref.ref_type === 'recommended' ? 
                    <Item
                      data={ref.data}
                      id={ref.id}
                      refs={ref.refs}
                      externLink='#!'
                      key={key}
                      handleReferenceClick={props.handleReferenceClick}
                    />
                  : null)
                : <DisplayStatusMessage
                    typeofMsg='no-ref'
                    ref_type='recommended'
                    errOccurred=''
                    refIsLoading={props.state.refIsLoading}
                  />
            }
          </ul>
          
          <ul className={`tab graph-tab
            ${/graph/.test(props.state.activeTabName) ? 'active-tab' : ''}
            ${!props.isViewedWithMobile ? 'useCustomScrollBar' : ''}`}>
            {
              ifCanVisualizeGraph ? renderGraph
                : <DisplayStatusMessage
                    typeofMsg='no-ref'
                    ref_type='graph'
                    errOccurred={props.state.errOccurred}
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



