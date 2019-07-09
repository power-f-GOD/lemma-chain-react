import React from 'react';
import ReactDOM from 'react-dom';
import Widget from './Widget';
import './index.css';
import getThemeCSSText from './ThemeCSS';



export interface Props
{
  serverHostURL: string;
  maxWidth: number;
  maxHeight: number;
}



//customize widget to taste/context
//PS: Put in own values in empty string (before double pipe symbols) to alter widget props or leave blank to use default
let widgetProps: Props = 
{
  serverHostURL: '' || '68.183.123.0:1323',       //lemma-chain server host
  maxHeight: 0,
  maxWidth: 0
};



ReactDOM.render(
  <Widget
    serverHostURL={widgetProps.serverHostURL}
    maxHeight={widgetProps.maxHeight}
    maxWidth={widgetProps.maxWidth}
  />,
  document.querySelector('#root')
);



let cssText = getThemeCSSText(),
    styleElement = document.createElement('style') as any;

if (styleElement.styleSheet)
  styleElement.styleSheet.cssText = cssText;
else 
  styleElement.appendChild(document.createTextNode(cssText));

document.head.appendChild(styleElement);
