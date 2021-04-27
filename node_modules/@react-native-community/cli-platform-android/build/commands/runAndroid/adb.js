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

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Parses the output of the 'adb devices' command
 */
function parseDevicesResult(result) {
  if (!result) {
    return [];
  }

  const devices = [];
  const lines = result.trim().split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const words = lines[i].split(/[ ,\t]+/).filter(w => w !== '');

    if (words[1] === 'device') {
      devices.push(words[0]);
    }
  }

  return devices;
}
/**
 * Executes the commands needed to get a list of devices from ADB
 */


function getDevices(adbPath) {
  try {
    const devicesResult = (0, _child_process().execSync)(`${adbPath} devices`);
    return parseDevicesResult(devicesResult.toString());
  } catch (e) {
    return [];
  }
}
/**
 * Gets available CPUs of devices from ADB
 */


function getAvailableCPUs(adbPath, device) {
  try {
    const baseArgs = ['-s', device, 'shell', 'getprop'];
    let cpus = (0, _child_process().execFileSync)(adbPath, baseArgs.concat(['ro.product.cpu.abilist'])).toString(); // pre-Lollipop

    if (!cpus || cpus.trim().length === 0) {
      cpus = (0, _child_process().execFileSync)(adbPath, baseArgs.concat(['ro.product.cpu.abi'])).toString();
    }

    return (cpus || '').trim().split(',');
  } catch (e) {
    return [];
  }
}

var _default = {
  getDevices,
  getAvailableCPUs
};
exports.default = _default;