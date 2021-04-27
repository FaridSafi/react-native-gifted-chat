"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = unregisterNativeModule;

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
    return data;
  };

  return data;
}

var _removePodEntry = _interopRequireDefault(require("./removePodEntry"));

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Unregister native module IOS with CocoaPods
 */
function unregisterNativeModule(dependencyConfig, iOSProject) {
  const podContent = _fs().default.readFileSync(iOSProject.podfile, 'utf8');

  const removed = (0, _removePodEntry.default)(podContent, dependencyConfig.podspecPath);

  _cliTools().logger.debug(`Writing changes to ${iOSProject.podfile}`);

  _fs().default.writeFileSync(iOSProject.podfile, removed);
}