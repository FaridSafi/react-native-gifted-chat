"use strict";

exports.__esModule = true;
exports.default = void 0;

var _createStrictShapeTypeChecker = _interopRequireDefault(require("../../modules/createStrictShapeTypeChecker"));

var _propTypes = require("prop-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
var PointPropType = (0, _createStrictShapeTypeChecker.default)({
  x: _propTypes.number,
  y: _propTypes.number
});
var _default = PointPropType;
exports.default = _default;
module.exports = exports.default;