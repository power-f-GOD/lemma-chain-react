import React from 'react';
import ReactDOM from 'react-dom';
import Widget from './Widget';
import './index.css';



export interface Props
{
  endpointURL: string;
}



let WidgetProps: Props = {
  endpointURL: ''
};



ReactDOM.render(
  <Widget
    endpointURL={WidgetProps.endpointURL ? WidgetProps.endpointURL : '68.183.123.0:1323'}
  />,
document.querySelector('#root'));
