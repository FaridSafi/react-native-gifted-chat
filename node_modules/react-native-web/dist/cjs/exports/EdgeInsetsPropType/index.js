"use strict";

exports.__esModule = true;
exports.default = void 0;

var _createStrictShapeTypeChecker = _interopRequireDefault(require("../../modules/createStrictShapeTypeChecker"));

var _propTypes = require("prop-types");

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
var EdgeInsetsPropType = (0, _createStrictShapeTypeChecker.default)({
  top: _propTypes.number,
  left: _propTypes.number,
  bottom: _propTypes.number,
  right: _propTypes.number
});
var _default = EdgeInsetsPropType;
exports.default = _default;
module.exports = exports.default;