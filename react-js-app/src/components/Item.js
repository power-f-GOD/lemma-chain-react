import React from 'react';


function Item(props)
{
  let ref_type_style = {
        display: 'block',
        textAlign: 'right',
        fontSize: '10px'
      }

  return (
    <div
      className='tab-items-wrapper'
      data-title={props.title}
      data-author={props.author}
      data-id={props.id}
      data-ref-type={props.ref_type}
      onClick={(e) => props.handleReferenceClick(e)}
    >
      <li className='tab-items'>
        <span className='props'>Title: <span className='title'>{props.title}</span></span>
        <span className='props'>Author: <span className='author'>{props.author}</span></span>
        <span className='props'>Ref. ID: <span className="id">{props.id}</span></span>
        <span className='props' style={ref_type_style}>{props.ref_type}</span>
      </li>
    </div>
  );
}


export default Item;