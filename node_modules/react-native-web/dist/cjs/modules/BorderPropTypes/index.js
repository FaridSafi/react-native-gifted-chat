"use strict";

exports.__esModule = true;
exports.default = void 0;

var _ColorPropType = _interopRequireDefault(require("../../exports/ColorPropType"));

var _propTypes = require("prop-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
var numberOrString = (0, _propTypes.oneOfType)([_propTypes.number, _propTypes.string]);
var BorderStylePropType = (0, _propTypes.oneOf)(['solid', 'dotted', 'dashed']);
var BorderPropTypes = {
  borderColor: _ColorPropType.default,
  borderBottomColor: _ColorPropType.default,
  borderEndColor: _ColorPropType.default,
  borderLeftColor: _ColorPropType.default,
  borderRightColor: _ColorPropType.default,
  borderStartColor: _ColorPropType.default,
  borderTopColor: _ColorPropType.default,
  borderRadius: numberOrString,
  borderBottomEndRadius: numberOrString,
  borderBottomLeftRadius: numberOrString,
  borderBottomRightRadius: numberOrString,
  borderBottomStartRadius: numberOrString,
  borderTopEndRadius: numberOrString,
  borderTopLeftRadius: numberOrString,
  borderTopRightRadius: numberOrString,
  borderTopStartRadius: numberOrString,
  borderStyle: BorderStylePropType,
  borderBottomStyle: BorderStylePropType,
  borderEndStyle: BorderStylePropType,
  borderLeftStyle: BorderStylePropType,
  borderRightStyle: BorderStylePropType,
  borderStartStyle: BorderStylePropType,
  borderTopStyle: BorderStylePropType
};
var _default = BorderPropTypes;
exports.default = _default;
module.exports = exports.default;