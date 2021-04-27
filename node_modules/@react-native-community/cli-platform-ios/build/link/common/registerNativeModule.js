"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = registerNativeModule;

var _registerNativeModule = _interopRequireDefault(require("../registerNativeModule"));

var _registerNativeModule2 = _interopRequireDefault(require("../../link-pods/registerNativeModule"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function registerNativeModule(name, dependencyConfig, // FIXME: Params is never used
_params, projectConfig) {
  if (projectConfig.podfile && dependencyConfig.podspecPath) {
    (0, _registerNativeModule2.default)(name, dependencyConfig.podspecPath, projectConfig);
  } else {
    (0, _registerNativeModule.default)(dependencyConfig, projectConfig);
  }
}