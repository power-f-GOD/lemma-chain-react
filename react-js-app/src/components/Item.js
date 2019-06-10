import React from 'react';


function Item(props)
{
  let ref_type_style = {
        display: 'block',
        fontSize: 10,
        right: 0,
        bottom: 0,
        position: 'absolute'
      }

  return (
    <div
      className='item-wrapper'
      data-title={props.title}
      data-author={props.author}
      data-id={props.id}
      data-ref-type={props.ref_type}
      onClick={(e) => props.handleReferenceClick(e)}
    >
      <li className='item' style={{position: 'relative'}}>
        <span className='props'>Title: <span className='title'>{props.title}</span></span>
        <span className='props'>Author: <span className='author'>{props.author}</span></span>
        <span className='props'>Ref. ID: <span className="id">{props.id}</span></span>
        <span className='props' style={ref_type_style}>{props.ref_type}</span>
      </li>
    </div>
  );
}


export default Item;