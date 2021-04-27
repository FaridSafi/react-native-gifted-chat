"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _PickerItem = _interopRequireDefault(require("./PickerItem"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
var PickerItemPropType = function PickerItemPropType(props, propName, componentName) {
  var prop = props[propName];
  var error = null;

  _react.default.Children.forEach(prop, function (child) {
    if (child.type !== _PickerItem.default) {
      error = new Error('`Picker` children must be of type `Picker.Item`.');
    }
  });

  return error;
};

var _default = PickerItemPropType;
exports.default = _default;
module.exports = exports.default;