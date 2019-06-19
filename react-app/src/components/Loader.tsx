import React, { CSSProperties } from 'react';



interface Props
{
  isLoading: boolean;
  attributes: 
  {
    size: number;
    type: string;
    color?: string;
    rider?: string;
    wrapperHeight?: number;
  };
}



//Loader returns 'minor loader' (without wrapper) or 'major loader' (with wrapper) depending on context 
export default function Loader(props: Props)
{
  let circlesStyle: CSSProperties = 
      {
        height: props.attributes.size,
        width: props.attributes.size,
        background: props.attributes.color || '#333',
        display: 'inline-block',
        borderRadius: '50%',
        marginRight: 5,
      },
      loaderWrapperStyle: CSSProperties = 
      {
        visibility: props.isLoading ? 'visible' : 'hidden',
        opacity: props.isLoading ? 1 : 0,
        position: 'absolute',
        width: '100%',
        background: 'rgba(50, 50, 50, 0)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        height: props.attributes.wrapperHeight,
        flexDirection: 'column',
        color: props.attributes.color
      },
      loaderStyle: CSSProperties = 
      {
        display: 'block',
        textAlign: 'center',
        position: props.attributes.type === 'minor' ? 'absolute' : 'static',
        visibility: props.isLoading ? 'visible' : 'hidden',
        opacity: props.isLoading ? 1 : 0
      },
      minorLoader: React.ReactElement = 
        <span className='loader' style={loaderStyle}>
          <span className='loader-circle' style={circlesStyle}></span>
          <span className='loader-circle' style={circlesStyle}></span>
          <span className='loader-circle' style={circlesStyle}></span>
        </span>,
      majorLoader: React.ReactElement = 
        <div className='loader-wrapper' style={loaderWrapperStyle}>
          {minorLoader}
          <br />
          <span className='load-name' style={{fontSize: 13}}>{props.attributes.rider}</span>
        </div>;
  
  //loader animation style in CSS (index.css) file

  return props.attributes.type === 'minor' ? minorLoader : majorLoader;
}