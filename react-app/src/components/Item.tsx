import React, { CSSProperties } from 'react';



interface Props
{
  data: {title: string, author: string};
  id: string;
  ref_type: string;
  [key: string]: any;
}



function Item(props: Props): JSX.Element
{
  let ref_type_style: CSSProperties = 
      {
        display: 'block',
        fontSize: 10,
        right: 0,
        bottom: 0,
        position: 'absolute',
        color: '#999'
      }

      
  return (
    <div
      className='item-wrapper'
      data-title={props.data.title}
      data-author={props.data.author}
      data-id={props.id}
      data-ref-type={props.ref_type}
      onClick={(e) => props.handleReferenceClick(e)}
    >
      <li className='item' style={{position: 'relative'}}>
        <span className='props'>Title: <b>{props.data.title}</b></span>
        <span className='props'>Author: {props.data.author}</span>
        <span className='props'>Ref. ID: <b>{props.id}</b></span>
        <span className='props' style={ref_type_style}>{props.ref_type}</span>
      </li>
    </div>
  );
}



export default Item;