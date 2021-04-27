"use strict";

exports.__esModule = true;
exports.default = validate;

var _ImageStylePropTypes = _interopRequireDefault(require("../Image/ImageStylePropTypes"));

var _TextInputStylePropTypes = _interopRequireDefault(require("../TextInput/TextInputStylePropTypes"));

var _TextStylePropTypes = _interopRequireDefault(require("../Text/TextStylePropTypes"));

var _ViewStylePropTypes = _interopRequireDefault(require("../View/ViewStylePropTypes"));

var _warning = _interopRequireDefault(require("fbjs/lib/warning"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
// import { STYLE_SHORT_FORM_EXPANSIONS } from './constants';
var validProperties = [].concat(Object.keys(_ImageStylePropTypes.default), Object.keys(_TextInputStylePropTypes.default), Object.keys(_TextStylePropTypes.default), Object.keys(_ViewStylePropTypes.default), ['appearance', 'borderCollapse', 'borderSpacing', 'clear', 'cursor', 'fill', 'float', 'listStyle', 'objectFit', 'objectPosition', 'pointerEvents', 'placeholderTextColor', 'tableLayout']).sort().reduce(function (acc, curr) {
  acc[curr] = true;
  return acc;
}, {});
var invalidShortforms = {
  background: true,
  borderBottom: true,
  borderLeft: true,
  borderRight: true,
  borderTop: true,
  font: true,
  grid: true,
  outline: true,
  textDecoration: true
};
/*
const singleValueShortForms = Object.keys(STYLE_SHORT_FORM_EXPANSIONS).reduce((a, c) => {
  a[c] = true;
  return a;
}, {});
*/

function error(message) {
  (0, _warning.default)(false, message);
}

function validate(key, styles) {
  var obj = styles[key];

  for (var k in obj) {
    var prop = k.trim();
    var value = obj[prop];
    var isInvalid = false;

    if (value === null) {
      continue;
    }

    if (validProperties[prop] == null) {
      var suggestion = '';

      if (prop === 'animation' || prop === 'animationName') {
        suggestion = 'Did you mean "animationKeyframes"?'; // } else if (prop === 'boxShadow') {
        //  suggestion = 'Did you mean "shadow{Color,Offset,Opacity,Radius}"?';
      } else if (prop === 'direction') {
        suggestion = 'Did you mean "writingDirection"?';
      } else if (prop === 'verticalAlign') {
        suggestion = 'Did you mean "textAlignVertical"?';
      } else if (invalidShortforms[prop]) {
        suggestion = 'Please use long-form properties.';
      }

      isInvalid = true;
      error("Invalid style property of \"" + prop + "\". " + suggestion);
    } // else if (singleValueShortForms[prop]) {
    //   TODO: fix check
    //   if (typeof value === 'string' && value.indexOf(' ') > -1) {
    //     error(
    //       `Invalid style declaration "${prop}:${value}". This property must only specify a single value.`
    //     );
    //     isInvalid = true;
    //   }
    // }
    else if (typeof value === 'string' && value.indexOf('!important') > -1) {
        error("Invalid style declaration \"" + prop + ":" + value + "\". Values cannot include \"!important\"");
        isInvalid = true;
      }

    if (isInvalid) {
      delete obj[k];
    }
  }
}

module.exports = exports.default;