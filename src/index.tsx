import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';

/* We need to add these Object methods
because JavaScript support on IE is lacking
and this application won't work on IE without them */
import 'mdn-polyfills/Array.from';
import 'mdn-polyfills/Array.of';
import 'mdn-polyfills/Array.prototype.find';
import 'mdn-polyfills/Array.prototype.findIndex';
import 'mdn-polyfills/Array.prototype.includes';
import 'mdn-polyfills/Element.prototype.closest';
import 'mdn-polyfills/Element.prototype.matches';
import 'mdn-polyfills/Element.prototype.toggleAttribute';
import 'mdn-polyfills/Node.prototype.after';
import 'mdn-polyfills/Node.prototype.append';
import 'mdn-polyfills/Node.prototype.before';
import 'mdn-polyfills/Node.prototype.children';
import 'mdn-polyfills/Node.prototype.prepend';
import 'mdn-polyfills/Node.prototype.remove';
import 'mdn-polyfills/Node.prototype.replaceWith';
import 'mdn-polyfills/NodeList.prototype.forEach';
import 'mdn-polyfills/Number.isNaN';
import 'mdn-polyfills/Object.assign';
import 'mdn-polyfills/Object.entries';
import 'mdn-polyfills/Object.values';
import 'mdn-polyfills/String.prototype.includes';


ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);

