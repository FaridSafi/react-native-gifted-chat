"use strict";

exports.__esModule = true;
exports.default = void 0;

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
var ensureComponentIsNative = function ensureComponentIsNative(component) {
  (0, _invariant.default)(component && typeof component.setNativeProps === 'function', 'Touchable child must either be native or forward setNativeProps to a native component');
};

var _default = ensureComponentIsNative;
exports.default = _default;
module.exports = exports.default;