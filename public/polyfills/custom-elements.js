!function(){"use strict";function e(e){Promise.resolve().then(e)}function t(e){return null==e.parentNode?e:t(e.parentNode)}function n(e){return t(e).nodeType===window.Node.DOCUMENT_NODE}function r(e){return"custom"===window.customElements._getState(e)}function o(e){return function t(){var n=Object.getPrototypeOf(this);if(n===t.prototype)throw new TypeError("Illegal Constructor");var r=e._lookupByConstructor(this.constructor);if(null==r)throw new Error("no definition found for element");var o=r.constructionStack,i=r.prototype;if(!o.length){var a=document.createElement(r.localName);return r.localName!==r.name&&a.setAttribute("is",r.name),Reflect.setPrototypeOf(a,i),e._customElementState.set(a,"custom"),a}var u=o[o.length-1];if(u===w)throw new Error("invalid state e.g. nested element construction before calling super()");return Reflect.setPrototypeOf(u,i),o[o.length-1]=w,u}}function i(e){var t=window.HTMLElement,n=o(e);n.prototype=Object.create(t.prototype),window.HTMLElement=n,b.forEach(function(e){var t="HTML"+e+"Element",n=window[t];if(n){var r=n.prototype;Object.setPrototypeOf(r,window.HTMLElement.prototype);var o=function(){return window.HTMLElement.apply(this,arguments)};o.prototype=r,window[t]=o}})}function a(){var e="dummy-button-"+Date.now();try{var t=function(e){function t(){return l(this,t),d(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return f(t,e),t}(window.HTMLButtonElement);window.customElements.define(e,t,{extends:"button"});var n=document.createElement("button",{is:e});if(!(n instanceof t))return!1;if(n.getAttribute("is")!==e)return!1}catch(e){return!1}return!0}function u(e,t){return function(n){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},o=e.call(this,n),i=r.is,a=t._getElementDefinition(o,i);if(null!=i&&null==a)throw new Error("no definition found for element "+n);return null!=a&&t._upgradeElement(o,a),null!=i&&o.setAttribute("is",r.is),o}}var c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},l=(function(){function e(e){this.value=e}function t(t){function n(e,t){return new Promise(function(n,o){var u={key:e,arg:t,resolve:n,reject:o,next:null};a?a=a.next=u:(i=a=u,r(e,t))})}function r(n,i){try{var a=t[n](i),u=a.value;u instanceof e?Promise.resolve(u.value).then(function(e){r("next",e)},function(e){r("throw",e)}):o(a.done?"return":"normal",a.value)}catch(e){o("throw",e)}}function o(e,t){switch(e){case"return":i.resolve({value:t,done:!0});break;case"throw":i.reject(t);break;default:i.resolve({value:t,done:!1})}i=i.next,i?r(i.key,i.arg):a=null}var i,a;this._invoke=n,"function"!=typeof t.return&&(this.return=void 0)}return"function"==typeof Symbol&&Symbol.asyncIterator&&(t.prototype[Symbol.asyncIterator]=function(){return this}),t.prototype.next=function(e){return this._invoke("next",e)},t.prototype.throw=function(e){return this._invoke("throw",e)},t.prototype.return=function(e){return this._invoke("return",e)},{wrap:function(e){return function(){return new t(e.apply(this,arguments))}},await:function(t){return new e(t)}}}(),function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}),s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},d=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t},h=["annotation-xml","color-profile","font-face","font-face-src","font-face-uri","font-face-format","font-face-name","missing-glyph"],p=/[a-z][\-.0-9a-z_]*-[\-.0-9a-z_]*$/,m=function(e){return h.indexOf(e)===-1&&p.test(e)},y=function(){function t(){l(this,t),this.polyfilled=!0,this._names=new Set,this._constructors=new Set,this._definitions={},this._whenDefined={},this._customElementState=new WeakMap,this._customElementDefinition=new WeakMap}return s(t,[{key:"get",value:function(e){if(this._definitions.hasOwnProperty(e))return this._definitions[e].constructor}},{key:"whenDefined",value:function(e){if(!m(e))return Promise.reject(new SyntaxError("the element name "+e+" is not valid"));if(this._definitions.hasOwnProperty(e))return Promise.resolve();var t=this._whenDefined;if(!t.hasOwnProperty(e)){var n=void 0,r=new Promise(function(e){return n=e});t[e]={promise:r,resolve:n}}var o=t[e];return o.promise}},{key:"define",value:function(e,t){var n=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};if(e=e.toLowerCase(),"function"!=typeof t)throw new TypeError("constructor is not a constructor");if(!m(e))throw new SyntaxError("the element name "+e+" is not valid");if(this._names.has(e))throw new Error("an element with name '"+e+"' is already defined");if(this._constructors.has(t))throw new Error("this constructor is already registered");var o=e,i=r.extends||null;if(null!==i){if(m(i))throw new Error("extends must be a native element");o=i}var a=t.prototype;if("object"!==("undefined"==typeof a?"undefined":c(a)))throw new TypeError("constructor.prototype must be an object");var u={connectedCallback:null,disconnectedCallback:null,adoptedCallback:null,attributeChangedCallback:null};Object.keys(u).forEach(function(e){var t=a[e];void 0!==t&&(u[e]=t)});var l=[];if(null!==u.attributeChangedCallback){var s=t.observedAttributes;null!=s&&(l=Array.from(s).map(function(e){return String(e)}))}var f={name:e,localName:o,constructor:t,prototype:a,observedAttributes:l,lifecycleCallbacks:u,constructionStack:[]};this._definitions[e]=f,this._names.add(e),this._constructors.add(t);var d=window.document,h=o;null!=i&&(h+='[is="'+e+'"]');var p=d.querySelectorAll(h);if(Array.from(p).forEach(function(e){return n._upgradeElement(e,f)}),this._whenDefined.hasOwnProperty(e)){var y=this._whenDefined[e];y.resolve(),delete this._whenDefined[e]}}},{key:"_upgradeElement",value:function(e,t){var r=this._getState(e);if("custom"!==r&&"failed"!==r){for(var o=0;o<e.attributes.length;o++){var i=e.attributes[o];this._callbackReaction(e,"attributeChangedCallback",[i.localName,null,i.value,i.namespaceURI])}n(e)&&this._callbackReaction(e,"connectedCallback",[]),t.constructionStack.push(e);var a=t.constructor,u=void 0;try{u=Reflect.construct(a,[]),t.constructionStack.pop()}catch(t){throw this._customElementState.set(e,"failed"),t}if(u!==e)throw new Error("invalid state error");this._customElementState.set(e,"custom"),this._customElementDefinition.set(e,t)}}},{key:"_getElementDefinition",value:function(e,t){var n=e.localName.toLowerCase(),r=n;t=t||e.getAttribute("is"),null!=t&&(r=t);var o=this._definitions[r];return null==o||n!==o.localName?null:o}},{key:"_lookupByConstructor",value:function(e){var t=this,n=null;return Object.keys(this._definitions).forEach(function(r){var o=t._definitions[r];o.constructor===e&&(n=o)}),n}},{key:"_tryUpgradeElement",value:function(t){var n=this,r=this._getElementDefinition(t);null!=r&&e(function(){n._upgradeElement(t,r)})}},{key:"_callbackReaction",value:function(t,n,r){var o=this._getElementDefinition(t),i=o.lifecycleCallbacks[n];null!==i&&("attributeChangedCallback"===n&&o.observedAttributes.indexOf(r[0])===-1||e(function(){i.apply(t,r)}))}},{key:"_getState",value:function(e){return this._customElementState.get(e)}}]),t}(),v=function(){function t(e){l(this,t),this._registry=e}return s(t,[{key:"observe",value:function(){var e=this,t=new window.MutationObserver(function(t){var n=new Set,r=new Set;t.forEach(function(t){"attributes"===t.type&&e._attributeChange(t),"childList"===t.type&&(Array.from(t.addedNodes).forEach(function(t){return e._addNode(t,n)}),Array.from(t.removedNodes).forEach(function(t){return e._removeNode(t,r)}))})});t.observe(document,{childList:!0,attributes:!0,subtree:!0,attributeOldValue:!0})}},{key:"_addNode",value:function(t,n){var o=this;if(!n.has(t)&&t.nodeType===window.Node.ELEMENT_NODE){n.add(t);for(var i=this._registry,a=function(r){e(function(){o._addNode(t.childNodes[r],n)})},u=0;u<t.childNodes.length;u++)a(u);return r(t)?i._callbackReaction(t,"connectedCallback",[]):void i._tryUpgradeElement(t)}}},{key:"_removeNode",value:function(t,n){var o=this;if(!n.has(t)&&t.nodeType===window.Node.ELEMENT_NODE&&r(t)){n.add(t);for(var i=function(r){e(function(){o._removeNode(t.childNodes[r],n)})},a=0;a<t.childNodes.length;a++)i(a);this._registry._callbackReaction(t,"disconnectedCallback",[])}}},{key:"_attributeChange",value:function(e){var t=e.target;if(r(t)){var n=e.attributeName;this._registry._callbackReaction(t,"attributeChangedCallback",[n,e.oldValue,t.getAttribute(n),e.attributeNamespace])}}}]),t}(),w={},b=["Anchor","Area","Audio","Base","Quote","Body","BR","Button","Canvas","TableCaption","TableCol","MenuItem","Data","DataList","Mod","Details","Dialog","Div","DList","Embed","FieldSet","Form","Heading","Head","HR","Html","IFrame","Image","Input","Keygen","Label","Legend","LI","Link","Map","Menu","Meta","Meter","Object","OList","OptGroup","Option","Output","Paragraph","Param","Picture","Pre","Progress","Script","Select","Slot","Source","Span","Style","Table","TableSection","TableCell","Template","TextArea","Time","Title","TableRow","Track","UList","Video","Unknown"];!function(){if(!a()){var e=new y,t=new v(e);Object.defineProperty(window,"customElements",{value:e});var n=window.HTMLDocument.prototype;n.createElement=u(n.createElement,e),i(e),t.observe()}}()}();
