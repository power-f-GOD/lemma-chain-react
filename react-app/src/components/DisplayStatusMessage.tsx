import React, { CSSProperties } from 'react';


/**
 * @param DisplayStatusMessage: Displays error message or 'book has no-ref' message depending on context.
 */
export default function DisplayStatusMessage(props: any)
{
  let messageWrapperStyle: CSSProperties = 
    {
      padding: 20,
      display: 'flex',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#888',
      fontStyle: 'italic',
      fontSize: 14,
      minHeight: 'auto',
      height: 260
    },
    errImgStyle: CSSProperties = 
    {
      opacity: 0.5,
      borderRadius: '50%',
      width: 80,
      height: 'auto',
      marginBottom: 10
    },
    suggestMsg: React.ReactFragment =
      <><b>Suggest:</b> Check internet connection.</>,
    errMsg: React.ReactFragment = 
      <>
        Sorry. Could not load <b>{props.for_ref_type}</b> references for this book.<br /><b>ErrorMessage:</b> {props.errMsg}<br /><br />
        {/fetch/i.test(props.errMsg) ? suggestMsg : ''}
      </>,
    nothingToShowMessage: React.ReactFragment =
      <>Nothing to show.<br />Book has no <b>{props.for_ref_type}</b> references.</>,
    graphStatusMessage: React.ReactFragment =
      <>
        Sorry. Can't visualize <b>graph</b>.<br />
        <b>Reason:</b> {props.errMsg || 'Book has no parents.'}
      </>;

  return (
    <div className='item-wrapper' style={messageWrapperStyle}>
      <span className='props'>
        <img src='err_grey.png' alt='Error' style={errImgStyle}/><br />
        {
          /graph/.test(props.for_ref_type) ? 
            graphStatusMessage : (props.type.match('error') ? errMsg : nothingToShowMessage)
        }
      </span>
    </div>
  );
}