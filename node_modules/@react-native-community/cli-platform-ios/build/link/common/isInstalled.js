"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isInstalled;

var _isInstalled = _interopRequireDefault(require("../isInstalled"));

var _isInstalled2 = _interopRequireDefault(require("../../link-pods/isInstalled"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function isInstalled(projectConfig, // FIXME: name is never used
_name, dependencyConfig) {
  return (0, _isInstalled.default)(projectConfig, dependencyConfig) || (0, _isInstalled2.default)(projectConfig, dependencyConfig);
}