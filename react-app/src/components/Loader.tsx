import React from 'react';


//Loader returns 'minor loader' (without wrapper) or 'major loader' (with wrapper) depending on context 
export default function Loader(props: any)
{
  let circlesStyle: object = 
      {
        height: props.attributes.size,
        width: props.attributes.size,
        background: props.attributes.color,
        display: 'inline-block',
        borderRadius: '50%',
        marginRight: 5,
      },
      loaderWrapperStyle: object = 
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
      loaderStyle: object = 
      {
        display: 'block',
        textAlign: 'center',
        position: props.attributes.type === 'minor' ? 'absolute' : '',
        visibility: props.isLoading ? 'visible' : 'hidden',
        opacity: props.isLoading ? 1 : 0
      },
      minorLoader = 
        <span className='loader' style={loaderStyle}>
          <span className='loader-circle' style={circlesStyle}></span>
          <span className='loader-circle' style={circlesStyle}></span>
          <span className='loader-circle' style={circlesStyle}></span>
        </span>,
      majorLoader = 
        <div className='loader-wrapper' style={loaderWrapperStyle}>
          {minorLoader}<br />
          <span className='load-name' style={{fontSize: '13px'}}>{props.attributes.rider}</span>
        </div>;
  
  //loader animation style in CSS (index.css) file

  return props.attributes.type === 'minor' ? minorLoader : majorLoader;
}