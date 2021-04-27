function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import applyNativeMethods from '../../modules/applyNativeMethods';
import ColorPropType from '../ColorPropType';
import createElement from '../createElement';
import multiplyStyleLengthValue from '../../modules/multiplyStyleLengthValue';
import StyleSheet from '../StyleSheet';
import UIManager from '../UIManager';
import View from '../View';
import ViewPropTypes from '../ViewPropTypes';
import React, { Component } from 'react';
import { bool, func } from 'prop-types';
var emptyObject = {};
var thumbDefaultBoxShadow = '0px 1px 3px rgba(0,0,0,0.5)';
var thumbFocusedBoxShadow = thumbDefaultBoxShadow + ", 0 0 0 10px rgba(0,0,0,0.1)";

var Switch =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(Switch, _Component);

  function Switch() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;

    _this._handleChange = function (event) {
      var onValueChange = _this.props.onValueChange;
      onValueChange && onValueChange(event.nativeEvent.target.checked);
    };

    _this._handleFocusState = function (event) {
      var isFocused = event.nativeEvent.type === 'focus';
      var boxShadow = isFocused ? thumbFocusedBoxShadow : thumbDefaultBoxShadow;

      if (_this._thumbElement) {
        _this._thumbElement.setNativeProps({
          style: {
            boxShadow: boxShadow
          }
        });
      }
    };

    _this._setCheckboxRef = function (element) {
      _this._checkboxElement = element;
    };

    _this._setThumbRef = function (element) {
      _this._thumbElement = element;
    };

    return _this;
  }

  var _proto = Switch.prototype;

  _proto.blur = function blur() {
    UIManager.blur(this._checkboxElement);
  };

  _proto.focus = function focus() {
    UIManager.focus(this._checkboxElement);
  };

  _proto.render = function render() {
    var _this$props = this.props,
        accessibilityLabel = _this$props.accessibilityLabel,
        activeThumbColor = _this$props.activeThumbColor,
        activeTrackColor = _this$props.activeTrackColor,
        disabled = _this$props.disabled,
        onValueChange = _this$props.onValueChange,
        style = _this$props.style,
        thumbColor = _this$props.thumbColor,
        trackColor = _this$props.trackColor,
        value = _this$props.value,
        onTintColor = _this$props.onTintColor,
        thumbTintColor = _this$props.thumbTintColor,
        tintColor = _this$props.tintColor,
        other = _objectWithoutPropertiesLoose(_this$props, ["accessibilityLabel", "activeThumbColor", "activeTrackColor", "disabled", "onValueChange", "style", "thumbColor", "trackColor", "value", "onTintColor", "thumbTintColor", "tintColor"]);

    var _StyleSheet$flatten = StyleSheet.flatten(style),
        styleHeight = _StyleSheet$flatten.height,
        styleWidth = _StyleSheet$flatten.width;

    var height = styleHeight || 20;
    var minWidth = multiplyStyleLengthValue(height, 2);
    var width = styleWidth > minWidth ? styleWidth : minWidth;
    var trackBorderRadius = multiplyStyleLengthValue(height, 0.5);
    var trackCurrentColor = value ? onTintColor || activeTrackColor : tintColor || trackColor;
    var thumbCurrentColor = value ? activeThumbColor : thumbTintColor || thumbColor;
    var thumbHeight = height;
    var thumbWidth = thumbHeight;
    var rootStyle = [styles.root, style, {
      height: height,
      width: width
    }, disabled && styles.cursorDefault];
    var trackStyle = [styles.track, {
      backgroundColor: trackCurrentColor,
      borderRadius: trackBorderRadius
    }, disabled && styles.disabledTrack];
    var thumbStyle = [styles.thumb, {
      backgroundColor: thumbCurrentColor,
      height: thumbHeight,
      width: thumbWidth
    }, disabled && styles.disabledThumb];
    var nativeControl = createElement('input', {
      accessibilityLabel: accessibilityLabel,
      checked: value,
      disabled: disabled,
      onBlur: this._handleFocusState,
      onChange: this._handleChange,
      onFocus: this._handleFocusState,
      ref: this._setCheckboxRef,
      style: [styles.nativeControl, styles.cursorInherit],
      type: 'checkbox'
    });
    return React.createElement(View, _extends({}, other, {
      style: rootStyle
    }), React.createElement(View, {
      style: trackStyle
    }), React.createElement(View, {
      ref: this._setThumbRef,
      style: [thumbStyle, value && styles.thumbOn, {
        marginStart: value ? multiplyStyleLengthValue(thumbWidth, -1) : 0
      }]
    }), nativeControl);
  };

  return Switch;
}(Component);

Switch.displayName = 'Switch';
Switch.defaultProps = {
  activeThumbColor: '#009688',
  activeTrackColor: '#A3D3CF',
  disabled: false,
  style: emptyObject,
  thumbColor: '#FAFAFA',
  trackColor: '#939393',
  value: false
};
Switch.propTypes = process.env.NODE_ENV !== "production" ? _objectSpread({}, ViewPropTypes, {
  activeThumbColor: ColorPropType,
  activeTrackColor: ColorPropType,
  disabled: bool,
  onValueChange: func,
  thumbColor: ColorPropType,
  trackColor: ColorPropType,
  value: bool,

  /* eslint-disable react/sort-prop-types */
  // Equivalent of 'activeTrackColor'
  onTintColor: ColorPropType,
  // Equivalent of 'thumbColor'
  thumbTintColor: ColorPropType,
  // Equivalent of 'trackColor'
  tintColor: ColorPropType
}) : {};
var styles = StyleSheet.create({
  root: {
    cursor: 'pointer',
    userSelect: 'none'
  },
  cursorDefault: {
    cursor: 'default'
  },
  cursorInherit: {
    cursor: 'inherit'
  },
  track: _objectSpread({}, StyleSheet.absoluteFillObject, {
    height: '70%',
    margin: 'auto',
    transitionDuration: '0.1s',
    width: '100%'
  }),
  disabledTrack: {
    backgroundColor: '#D5D5D5'
  },
  thumb: {
    alignSelf: 'flex-start',
    borderRadius: '100%',
    boxShadow: thumbDefaultBoxShadow,
    start: '0%',
    transform: [{
      translateZ: 0
    }],
    transitionDuration: '0.1s'
  },
  thumbOn: {
    start: '100%'
  },
  disabledThumb: {
    backgroundColor: '#BDBDBD'
  },
  nativeControl: _objectSpread({}, StyleSheet.absoluteFillObject, {
    height: '100%',
    margin: 0,
    opacity: 0,
    padding: 0,
    width: '100%'
  })
});
export default applyNativeMethods(Switch);