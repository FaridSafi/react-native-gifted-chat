"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _child_process() {
  const data = require("child_process");

  _child_process = function () {
    return data;
  };

  return data;
}

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

var _getAdbPath = _interopRequireDefault(require("./getAdbPath"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// Runs ADB reverse tcp:8081 tcp:8081 to allow loading the jsbundle from the packager
function tryRunAdbReverse(packagerPort, device) {
  try {
    const adbPath = (0, _getAdbPath.default)();
    const adbArgs = ['reverse', `tcp:${packagerPort}`, `tcp:${packagerPort}`]; // If a device is specified then tell adb to use it

    if (device) {
      adbArgs.unshift('-s', device);
    }

    _cliTools().logger.info('Connecting to the development server...');

    _cliTools().logger.debug(`Running command "${adbPath} ${adbArgs.join(' ')}"`);

    (0, _child_process().execFileSync)(adbPath, adbArgs, {
      stdio: 'inherit'
    });
  } catch (e) {
    _cliTools().logger.warn(`Failed to connect to development server using "adb reverse": ${e.message}`);
  }
}

var _default = tryRunAdbReverse;
exports.default = _default;