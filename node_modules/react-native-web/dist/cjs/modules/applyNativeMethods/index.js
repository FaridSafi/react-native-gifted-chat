"use strict";

exports.__esModule = true;
exports.default = void 0;

var _NativeMethodsMixin = _interopRequireDefault(require("../NativeMethodsMixin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
var applyNativeMethods = function applyNativeMethods(Component) {
  Object.keys(_NativeMethodsMixin.default).forEach(function (method) {
    if (!Component.prototype[method]) {
      Component.prototype[method] = _NativeMethodsMixin.default[method];
    }
  });
  return Component;
};

var _default = applyNativeMethods;
exports.default = _default;
module.exports = exports.default;