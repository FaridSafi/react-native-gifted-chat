function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import ensureComponentIsNative from '../../modules/ensureComponentIsNative';
import Image from '../Image';
import StyleSheet from '../StyleSheet';
import View from '../View';
import ViewPropTypes from '../ViewPropTypes';
import React, { Component } from 'react';
var emptyObject = {};
/**
 * Very simple drop-in replacement for <Image> which supports nesting views.
 */

var ImageBackground =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(ImageBackground, _Component);

  function ImageBackground() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this._viewRef = null;

    _this._captureRef = function (ref) {
      _this._viewRef = ref;
    };

    return _this;
  }

  var _proto = ImageBackground.prototype;

  _proto.setNativeProps = function setNativeProps(props) {
    // Work-around flow
    var viewRef = this._viewRef;

    if (viewRef) {
      ensureComponentIsNative(viewRef);
      viewRef.setNativeProps(props);
    }
  };

  _proto.render = function render() {
    var _this$props = this.props,
        children = _this$props.children,
        style = _this$props.style,
        imageStyle = _this$props.imageStyle,
        imageRef = _this$props.imageRef,
        props = _objectWithoutPropertiesLoose(_this$props, ["children", "style", "imageStyle", "imageRef"]);

    return React.createElement(View, {
      ref: this._captureRef,
      style: style
    }, React.createElement(Image, _extends({}, props, {
      ref: imageRef,
      style: [StyleSheet.absoluteFill, {
        // Temporary Workaround:
        // Current (imperfect yet) implementation of <Image> overwrites width and height styles
        // (which is not quite correct), and these styles conflict with explicitly set styles
        // of <ImageBackground> and with our internal layout model here.
        // So, we have to proxy/reapply these styles explicitly for actual <Image> component.
        // This workaround should be removed after implementing proper support of
        // intrinsic content size of the <Image>.
        width: style.width,
        height: style.height,
        zIndex: -1
      }, imageStyle]
    })), children);
  };

  return ImageBackground;
}(Component);

ImageBackground.defaultProps = {
  style: emptyObject
};
ImageBackground.propTypes = process.env.NODE_ENV !== "production" ? _objectSpread({}, Image.propTypes, {
  imageStyle: Image.propTypes.style,
  style: ViewPropTypes.style
}) : {};
export default ImageBackground;