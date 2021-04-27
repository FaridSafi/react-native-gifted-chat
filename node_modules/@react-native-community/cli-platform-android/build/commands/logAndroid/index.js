"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _logkitty() {
  const data = require("logkitty");

  _logkitty = function () {
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
 */
async function logAndroid() {
  _cliTools().logger.info('Starting logkitty');

  const emitter = (0, _logkitty().logkitty)({
    platform: 'android',
    priority: _logkitty().AndroidPriority.VERBOSE,
    filter: (0, _logkitty().makeTagsFilter)('ReactNative', 'ReactNativeJS')
  });
  emitter.on('entry', entry => {
    _cliTools().logger.log((0, _logkitty().formatEntry)(entry));
  });
  emitter.on('error', error => {
    _cliTools().logger.log((0, _logkitty().formatError)(error));
  });
}

var _default = {
  name: 'log-android',
  description: 'starts logkitty',
  func: logAndroid
};
exports.default = _default;