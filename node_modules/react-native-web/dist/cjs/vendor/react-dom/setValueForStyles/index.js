"use strict";

exports.__esModule = true;
exports.default = void 0;

var _dangerousStyleValue = _interopRequireDefault(require("../dangerousStyleValue"));

var _hyphenateStyleName = _interopRequireDefault(require("hyphenate-style-name"));

var _warnValidStyle = _interopRequireDefault(require("../warnValidStyle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable */

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * From React 16.3.0
 * 
 */

/**
 * Sets the value for multiple styles on a node.  If a value is specified as
 * '' (empty string), the corresponding style property will be unset.
 *
 * @param {DOMElement} node
 * @param {object} styles
 */
function setValueForStyles(node, styles, getStack) {
  var style = node.style;

  for (var styleName in styles) {
    if (!styles.hasOwnProperty(styleName)) {
      continue;
    }

    var isCustomProperty = styleName.indexOf('--') === 0;

    if (process.env.NODE_ENV !== 'production') {
      if (!isCustomProperty) {
        (0, _warnValidStyle.default)(styleName, styles[styleName], getStack);
      }
    }

    var styleValue = (0, _dangerousStyleValue.default)(styleName, styles[styleName], isCustomProperty);

    if (styleName === 'float') {
      styleName = 'cssFloat';
    }

    if (isCustomProperty) {
      var name = isCustomProperty ? styleName : (0, _hyphenateStyleName.default)(styleName);
      style.setProperty(name, styleValue);
    } else {
      style[styleName] = styleValue;
    }
  }
}

var _default = setValueForStyles;
exports.default = _default;
module.exports = exports.default;