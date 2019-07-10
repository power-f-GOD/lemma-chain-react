/**
 * To customize or configure widget, edit values in widgetconfig.json
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Widget from './Widget';
import './index.css';
import getThemeCSSText from './ThemeCSS';



ReactDOM.render(<Widget />, document.querySelector('#root'));



let cssText = getThemeCSSText(),
    styleElement = document.createElement('style') as any;

if (styleElement.styleSheet)
  styleElement.styleSheet.cssText = cssText;
else 
  styleElement.appendChild(document.createTextNode(cssText));

document.head.appendChild(styleElement);
