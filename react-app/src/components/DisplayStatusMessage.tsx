import React, { CSSProperties } from 'react';



/**
 * @param DisplayStatusMessage: Displays error message or 'book has no-ref' message depending on context.
 */
export default function DisplayStatusMessage(props: any)
{
  let messageWrapperStyle: CSSProperties = 
      {
        padding: '20px 30px',
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#888',
        fontSize: 14,
        minHeight: 200,
        opacity: props.refIsLoading ? 0 : 1,
        transition: '0.3s'
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
        <><b>Suggest:</b> Must be a network issue. Check internet connection then try again.</>,
      errMsg: React.ReactFragment = 
        <>
          Sorry. Could not load <b>{props.ref_type}</b> references for this book.<br /><br />
          {/fetch/i.test(props.errMsg) ? suggestMsg : 'An unexpected error occurred. Please, try again.'}
        </>,
      nothingToShowMessage: React.ReactFragment =
        <>Nothing to show.<br />Book has no <b>{props.ref_type}</b> references.</>,
      graphStatusMessage: React.ReactFragment =
        <>
          Sorry. Can't visualize <b>graph</b>.<br />
          <b>{props.errMsg ? '' : 'Reason: '}</b>{props.errMsg ? '' : 'Book has no parent refs.'}
        </>;


  return (
    <div className='item-wrapper' style={messageWrapperStyle}>
      <span className='props'>
        <img src='err_grey.png' alt='Status' style={errImgStyle}/><br />
        {
          /graph/.test(props.ref_type) ? 
            graphStatusMessage : (/error/.test(props.typeofMsg) ? errMsg : nothingToShowMessage)
        }
      </span>
    </div>
  );
}