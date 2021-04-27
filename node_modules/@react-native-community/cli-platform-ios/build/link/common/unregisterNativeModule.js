"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = unregisterNativeModule;

function _lodash() {
  const data = require("lodash");

  _lodash = function () {
    return data;
  };

  return data;
}

var _isInstalled = _interopRequireDefault(require("../isInstalled"));

var _isInstalled2 = _interopRequireDefault(require("../../link-pods/isInstalled"));

var _unregisterNativeModule = _interopRequireDefault(require("../unregisterNativeModule"));

var _unregisterNativeModule2 = _interopRequireDefault(require("../../link-pods/unregisterNativeModule"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function unregisterNativeModule(_name, dependencyConfig, projectConfig, // FIXME: Add type signature here
otherDependencies) {
  const isIosInstalled = (0, _isInstalled.default)(projectConfig, dependencyConfig);
  const isPodInstalled = (0, _isInstalled2.default)(projectConfig, dependencyConfig);

  if (isIosInstalled) {
    const iOSDependencies = (0, _lodash().compact)(otherDependencies.map(d => d.platforms.ios));
    (0, _unregisterNativeModule.default)(dependencyConfig, projectConfig, iOSDependencies);
  } else if (isPodInstalled) {
    (0, _unregisterNativeModule2.default)(dependencyConfig, projectConfig);
  }
}