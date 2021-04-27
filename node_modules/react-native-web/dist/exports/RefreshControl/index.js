function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import ColorPropType from '../ColorPropType';
import View from '../View';
import ViewPropTypes from '../ViewPropTypes';
import { arrayOf, bool, func, number, oneOf, string } from 'prop-types';
import React, { Component } from 'react';

var RefreshControl =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(RefreshControl, _Component);

  function RefreshControl() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = RefreshControl.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        colors = _this$props.colors,
        enabled = _this$props.enabled,
        onRefresh = _this$props.onRefresh,
        progressBackgroundColor = _this$props.progressBackgroundColor,
        progressViewOffset = _this$props.progressViewOffset,
        refreshing = _this$props.refreshing,
        size = _this$props.size,
        tintColor = _this$props.tintColor,
        title = _this$props.title,
        titleColor = _this$props.titleColor,
        rest = _objectWithoutPropertiesLoose(_this$props, ["colors", "enabled", "onRefresh", "progressBackgroundColor", "progressViewOffset", "refreshing", "size", "tintColor", "title", "titleColor"]);

    return React.createElement(View, rest);
  };

  return RefreshControl;
}(Component);

RefreshControl.propTypes = process.env.NODE_ENV !== "production" ? _objectSpread({}, ViewPropTypes, {
  colors: arrayOf(ColorPropType),
  enabled: bool,
  onRefresh: func,
  progressBackgroundColor: ColorPropType,
  progressViewOffset: number,
  refreshing: bool.isRequired,
  size: oneOf([0, 1]),
  tintColor: ColorPropType,
  title: string,
  titleColor: ColorPropType
}) : {};
export default RefreshControl;