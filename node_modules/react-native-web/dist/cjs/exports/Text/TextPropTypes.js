"use strict";

exports.__esModule = true;
exports.default = void 0;

var _StyleSheetPropType = _interopRequireDefault(require("../../modules/StyleSheetPropType"));

var _TextStylePropTypes = _interopRequireDefault(require("./TextStylePropTypes"));

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
var TextPropTypes = {
  accessibilityComponentType: _propTypes.string,
  accessibilityLabel: _propTypes.string,
  accessibilityLiveRegion: (0, _propTypes.oneOf)(['assertive', 'none', 'polite']),
  accessibilityRole: (0, _propTypes.oneOf)(['button', 'header', 'heading', 'label', 'link', 'listitem', 'none', 'text']),
  accessibilityTraits: (0, _propTypes.oneOfType)([_propTypes.array, _propTypes.string]),
  accessible: _propTypes.bool,
  children: _propTypes.any,
  importantForAccessibility: (0, _propTypes.oneOf)(['auto', 'no', 'no-hide-descendants', 'yes']),
  maxFontSizeMultiplier: _propTypes.number,
  nativeID: _propTypes.string,
  numberOfLines: _propTypes.number,
  onBlur: _propTypes.func,
  onFocus: _propTypes.func,
  onLayout: _propTypes.func,
  onPress: _propTypes.func,
  selectable: _propTypes.bool,
  style: (0, _StyleSheetPropType.default)(_TextStylePropTypes.default),
  testID: _propTypes.string,
  // web extensions
  onContextMenu: _propTypes.func,
  itemID: _propTypes.string,
  itemRef: _propTypes.string,
  itemProp: _propTypes.string,
  itemScope: _propTypes.string,
  itemType: _propTypes.string
};
var _default = TextPropTypes;
exports.default = _default;
module.exports = exports.default;