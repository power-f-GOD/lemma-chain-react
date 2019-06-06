import React from 'react';


function Items(props)
{
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
      </li>
    </div>
  );
}


export default Items;