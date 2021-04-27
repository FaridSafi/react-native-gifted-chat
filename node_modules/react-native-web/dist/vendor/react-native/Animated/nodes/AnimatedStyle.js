/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
'use strict';

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

import AnimatedNode from './AnimatedNode';
import AnimatedTransform from './AnimatedTransform';
import AnimatedWithChildren from './AnimatedWithChildren';
import NativeAnimatedHelper from '../NativeAnimatedHelper';
import StyleSheet from '../../../../exports/StyleSheet';
var flattenStyle = StyleSheet.flatten;

var AnimatedStyle =
/*#__PURE__*/
function (_AnimatedWithChildren) {
  _inheritsLoose(AnimatedStyle, _AnimatedWithChildren);

  function AnimatedStyle(style) {
    var _this;

    _this = _AnimatedWithChildren.call(this) || this;
    style = flattenStyle(style) || {};

    if (style.transform) {
      style = _objectSpread({}, style, {
        transform: new AnimatedTransform(style.transform)
      });
    }

    _this._style = style;
    return _this;
  } // Recursively get values for nested styles (like iOS's shadowOffset)


  var _proto = AnimatedStyle.prototype;

  _proto._walkStyleAndGetValues = function _walkStyleAndGetValues(style) {
    var updatedStyle = {};

    for (var key in style) {
      var value = style[key];

      if (value instanceof AnimatedNode) {
        if (!value.__isNative) {
          // We cannot use value of natively driven nodes this way as the value we have access from
          // JS may not be up to date.
          updatedStyle[key] = value.__getValue();
        }
      } else if (value && !Array.isArray(value) && typeof value === 'object') {
        // Support animating nested values (for example: shadowOffset.height)
        updatedStyle[key] = this._walkStyleAndGetValues(value);
      } else {
        updatedStyle[key] = value;
      }
    }

    return updatedStyle;
  };

  _proto.__getValue = function __getValue() {
    return this._walkStyleAndGetValues(this._style);
  } // Recursively get animated values for nested styles (like iOS's shadowOffset)
  ;

  _proto._walkStyleAndGetAnimatedValues = function _walkStyleAndGetAnimatedValues(style) {
    var updatedStyle = {};

    for (var key in style) {
      var value = style[key];

      if (value instanceof AnimatedNode) {
        updatedStyle[key] = value.__getAnimatedValue();
      } else if (value && !Array.isArray(value) && typeof value === 'object') {
        // Support animating nested values (for example: shadowOffset.height)
        updatedStyle[key] = this._walkStyleAndGetAnimatedValues(value);
      }
    }

    return updatedStyle;
  };

  _proto.__getAnimatedValue = function __getAnimatedValue() {
    return this._walkStyleAndGetAnimatedValues(this._style);
  };

  _proto.__attach = function __attach() {
    for (var key in this._style) {
      var value = this._style[key];

      if (value instanceof AnimatedNode) {
        value.__addChild(this);
      }
    }
  };

  _proto.__detach = function __detach() {
    for (var key in this._style) {
      var value = this._style[key];

      if (value instanceof AnimatedNode) {
        value.__removeChild(this);
      }
    }

    _AnimatedWithChildren.prototype.__detach.call(this);
  };

  _proto.__makeNative = function __makeNative() {
    _AnimatedWithChildren.prototype.__makeNative.call(this);

    for (var key in this._style) {
      var value = this._style[key];

      if (value instanceof AnimatedNode) {
        value.__makeNative();
      }
    }
  };

  _proto.__getNativeConfig = function __getNativeConfig() {
    var styleConfig = {};

    for (var styleKey in this._style) {
      if (this._style[styleKey] instanceof AnimatedNode) {
        styleConfig[styleKey] = this._style[styleKey].__getNativeTag();
      } // Non-animated styles are set using `setNativeProps`, no need
      // to pass those as a part of the node config

    }

    NativeAnimatedHelper.validateStyles(styleConfig);
    return {
      type: 'style',
      style: styleConfig
    };
  };

  return AnimatedStyle;
}(AnimatedWithChildren);

export default AnimatedStyle;