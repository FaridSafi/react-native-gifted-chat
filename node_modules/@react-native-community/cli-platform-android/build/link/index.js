"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAndroidLinkConfig = getAndroidLinkConfig;
exports.default = void 0;

var _isInstalled = _interopRequireDefault(require("./isInstalled"));

var _registerNativeModule = _interopRequireDefault(require("./registerNativeModule"));

var _unregisterNativeModule = _interopRequireDefault(require("./unregisterNativeModule"));

var _copyAssets = _interopRequireDefault(require("./copyAssets"));

var _unlinkAssets = _interopRequireDefault(require("./unlinkAssets"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function getAndroidLinkConfig() {
  return {
    isInstalled: _isInstalled.default,
    register: _registerNativeModule.default,
    unregister: _unregisterNativeModule.default,
    copyAssets: _copyAssets.default,
    unlinkAssets: _unlinkAssets.default
  };
}

var _default = getAndroidLinkConfig;
exports.default = _default;