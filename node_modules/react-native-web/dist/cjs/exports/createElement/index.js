"use strict";

exports.__esModule = true;
exports.default = void 0;

var _AccessibilityUtil = _interopRequireDefault(require("../../modules/AccessibilityUtil"));

var _createDOMProps = _interopRequireDefault(require("../../modules/createDOMProps"));

var _unstableNativeDependencies = require("react-dom/unstable-native-dependencies");

var _normalizeNativeEvent = _interopRequireDefault(require("../../modules/normalizeNativeEvent"));

var _react = _interopRequireDefault(require("react"));

var _ResponderEventPlugin = _interopRequireDefault(require("../../modules/ResponderEventPlugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
(0, _unstableNativeDependencies.injectEventPluginsByName)({
  ResponderEventPlugin: _ResponderEventPlugin.default
});

var isModifiedEvent = function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
};
/**
 * Ensure event handlers receive an event of the expected shape. The 'button'
 * role – for accessibility reasons and functional equivalence to the native
 * button element – must also support synthetic keyboard activation of onclick,
 * and remove event handlers when disabled.
 */


var eventHandlerNames = {
  onBlur: true,
  onClick: true,
  onClickCapture: true,
  onContextMenu: true,
  onFocus: true,
  onResponderRelease: true,
  onTouchCancel: true,
  onTouchCancelCapture: true,
  onTouchEnd: true,
  onTouchEndCapture: true,
  onTouchMove: true,
  onTouchMoveCapture: true,
  onTouchStart: true,
  onTouchStartCapture: true
};

var adjustProps = function adjustProps(domProps) {
  var onClick = domProps.onClick,
      onResponderRelease = domProps.onResponderRelease,
      role = domProps.role;
  var isButtonLikeRole = _AccessibilityUtil.default.buttonLikeRoles[role];

  var isDisabled = _AccessibilityUtil.default.isDisabled(domProps);

  var isLinkRole = role === 'link';
  Object.keys(domProps).forEach(function (propName) {
    var prop = domProps[propName];
    var isEventHandler = typeof prop === 'function' && eventHandlerNames[propName];

    if (isEventHandler) {
      if (isButtonLikeRole && isDisabled) {
        domProps[propName] = undefined;
      } else {
        // TODO: move this out of the render path
        domProps[propName] = function (e) {
          e.nativeEvent = (0, _normalizeNativeEvent.default)(e.nativeEvent);
          return prop(e);
        };
      }
    }
  }); // Cancel click events if the responder system is being used on a link
  // element. Click events are not an expected part of the React Native API,
  // and browsers dispatch click events that cannot otherwise be cancelled from
  // preceding mouse events in the responder system.

  if (isLinkRole && onResponderRelease) {
    domProps.onClick = function (e) {
      if (!e.isDefaultPrevented() && !isModifiedEvent(e.nativeEvent) && !domProps.target) {
        e.preventDefault();
      }
    };
  } // Button-like roles should trigger 'onClick' if SPACE or ENTER keys are pressed.


  if (isButtonLikeRole && !isDisabled) {
    domProps.onKeyPress = function (e) {
      if (!e.isDefaultPrevented() && (e.which === 13 || e.which === 32)) {
        e.preventDefault();

        if (onClick) {
          onClick(e);
        }
      }
    };
  }
};

var createElement = function createElement(component, props) {
  // use equivalent platform elements where possible
  var accessibilityComponent;

  if (component && component.constructor === String) {
    accessibilityComponent = _AccessibilityUtil.default.propsToAccessibilityComponent(props);
  }

  var Component = accessibilityComponent || component;
  var domProps = (0, _createDOMProps.default)(Component, props);
  adjustProps(domProps);

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return _react.default.createElement.apply(_react.default, [Component, domProps].concat(children));
};

var _default = createElement;
exports.default = _default;
module.exports = exports.default;