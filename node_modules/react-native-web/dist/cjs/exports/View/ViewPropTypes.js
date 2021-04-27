"use strict";

exports.__esModule = true;
exports.default = void 0;

var _EdgeInsetsPropType = _interopRequireDefault(require("../EdgeInsetsPropType"));

var _StyleSheetPropType = _interopRequireDefault(require("../../modules/StyleSheetPropType"));

var _ViewStylePropTypes = _interopRequireDefault(require("./ViewStylePropTypes"));

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
var stylePropType = (0, _StyleSheetPropType.default)(_ViewStylePropTypes.default);
var ViewPropTypes = {
  accessibilityComponentType: _propTypes.string,
  accessibilityLabel: _propTypes.string,
  accessibilityLiveRegion: (0, _propTypes.oneOf)(['assertive', 'none', 'polite']),
  accessibilityRole: _propTypes.string,
  accessibilityStates: (0, _propTypes.arrayOf)((0, _propTypes.oneOf)(['disabled', 'selected',
  /* web-only */
  'busy', 'checked', 'expanded', 'grabbed', 'invalid', 'pressed'])),
  accessibilityTraits: (0, _propTypes.oneOfType)([_propTypes.array, _propTypes.string]),
  accessible: _propTypes.bool,
  children: _propTypes.any,
  hitSlop: _EdgeInsetsPropType.default,
  importantForAccessibility: (0, _propTypes.oneOf)(['auto', 'no', 'no-hide-descendants', 'yes']),
  nativeID: _propTypes.string,
  onBlur: _propTypes.func,
  onClick: _propTypes.func,
  onClickCapture: _propTypes.func,
  onFocus: _propTypes.func,
  onLayout: _propTypes.func,
  onMoveShouldSetResponder: _propTypes.func,
  onMoveShouldSetResponderCapture: _propTypes.func,
  onResponderGrant: _propTypes.func,
  onResponderMove: _propTypes.func,
  onResponderReject: _propTypes.func,
  onResponderRelease: _propTypes.func,
  onResponderTerminate: _propTypes.func,
  onResponderTerminationRequest: _propTypes.func,
  onStartShouldSetResponder: _propTypes.func,
  onStartShouldSetResponderCapture: _propTypes.func,
  onTouchCancel: _propTypes.func,
  onTouchCancelCapture: _propTypes.func,
  onTouchEnd: _propTypes.func,
  onTouchEndCapture: _propTypes.func,
  onTouchMove: _propTypes.func,
  onTouchMoveCapture: _propTypes.func,
  onTouchStart: _propTypes.func,
  onTouchStartCapture: _propTypes.func,
  pointerEvents: (0, _propTypes.oneOf)(['auto', 'box-none', 'box-only', 'none']),
  style: stylePropType,
  testID: _propTypes.string,
  // web extensions
  onContextMenu: _propTypes.func,
  itemID: _propTypes.string,
  itemRef: _propTypes.string,
  itemProp: _propTypes.string,
  itemScope: _propTypes.string,
  itemType: _propTypes.string,
  // compatibility with React Native
  accessibilityViewIsModal: _propTypes.bool,
  collapsable: _propTypes.bool,
  needsOffscreenAlphaCompositing: _propTypes.bool,
  onAccessibilityTap: _propTypes.func,
  onMagicTap: _propTypes.func,
  removeClippedSubviews: _propTypes.bool,
  renderToHardwareTextureAndroid: _propTypes.bool,
  shouldRasterizeIOS: _propTypes.bool,
  tvParallaxProperties: _propTypes.object
};
var _default = ViewPropTypes;
exports.default = _default;
module.exports = exports.default;