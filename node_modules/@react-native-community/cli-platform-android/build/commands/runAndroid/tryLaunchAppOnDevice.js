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

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function tryLaunchAppOnDevice(device, packageNameWithSuffix, packageName, adbPath, mainActivity) {
  try {
    const adbArgs = ['shell', 'am', 'start', '-n', `${packageNameWithSuffix}/${packageName}.${mainActivity}`];

    if (device) {
      adbArgs.unshift('-s', device);

      _cliTools().logger.info(`Starting the app on "${device}"...`);
    } else {
      _cliTools().logger.info('Starting the app...');
    }

    _cliTools().logger.debug(`Running command "${adbPath} ${adbArgs.join(' ')}"`);

    (0, _child_process().spawnSync)(adbPath, adbArgs, {
      stdio: 'inherit'
    });
  } catch (error) {
    throw new (_cliTools().CLIError)('Failed to start the app.', error);
  }
}

var _default = tryLaunchAppOnDevice;
exports.default = _default;