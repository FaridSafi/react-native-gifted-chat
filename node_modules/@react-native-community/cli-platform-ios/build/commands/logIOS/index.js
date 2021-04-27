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

function _os() {
  const data = _interopRequireDefault(require("os"));

  _os = function () {
    return data;
  };

  return data;
}

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function findAvailableDevice(devices) {
  for (const key of Object.keys(devices)) {
    for (const device of devices[key]) {
      if (device.availability === '(available)' && device.state === 'Booted') {
        return device;
      }
    }
  }

  return null;
}
/**
 * Starts iOS device syslog tail
 */


async function logIOS() {
  const rawDevices = (0, _child_process().execFileSync)('xcrun', ['simctl', 'list', 'devices', '--json'], {
    encoding: 'utf8'
  });
  const {
    devices
  } = JSON.parse(rawDevices);
  const device = findAvailableDevice(devices);

  if (device === null) {
    _cliTools().logger.error('No active iOS device found');

    return;
  }

  tailDeviceLogs(device.udid);
}

function tailDeviceLogs(udid) {
  const logDir = _path().default.join(_os().default.homedir(), 'Library', 'Logs', 'CoreSimulator', udid, 'asl');

  const log = (0, _child_process().spawnSync)('syslog', ['-w', '-F', 'std', '-d', logDir], {
    stdio: 'inherit'
  });

  if (log.error !== null) {
    throw log.error;
  }
}

var _default = {
  name: 'log-ios',
  description: 'starts iOS device syslog tail',
  func: logIOS
};
exports.default = _default;