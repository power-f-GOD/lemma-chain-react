import React from 'react';
import { Payload } from '../Widget';



function Item(props: Payload): JSX.Element
{
  return (
    <div
      className='item-wrapper'
      data-data={props.data}
      data-id={props.id}
      onClick={(e) => props.handleReferenceClick(e)}>
      <li className='item'>
        <span className='props'>Title: <b>{props.data.title}</b></span>
        <span className='props'>Author{props.data.authors.length > 1 ? 's' : ''}: {props.data.authors.join(', ')}</span>
        <span className='props'>Ref. ID: <b>{props.id}</b></span>
        <a href={props.externLink} target='' className='extern-link'>
          <img className='extern-link-icon' src="link.png" alt="link" />
        </a>
      </li>
    </div>
  );
}



export default Item;