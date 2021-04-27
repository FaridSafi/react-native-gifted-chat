"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _envinfo() {
  const data = _interopRequireDefault(require("envinfo"));

  _envinfo = function () {
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

var _releaseChecker = _interopRequireDefault(require("../../tools/releaseChecker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @ts-ignore untyped
const info = async function getInfo(_argv, ctx) {
  try {
    _cliTools().logger.info('Fetching system and libraries information...');

    const output = await _envinfo().default.run({
      System: ['OS', 'CPU', 'Memory', 'Shell'],
      Binaries: ['Node', 'Yarn', 'npm', 'Watchman'],
      IDEs: ['Xcode', 'Android Studio'],
      SDKs: ['iOS SDK', 'Android SDK'],
      npmPackages: ['react', 'react-native', '@react-native-community/cli'],
      npmGlobalPackages: '*react-native*'
    });

    _cliTools().logger.log(output.trim());
  } catch (err) {
    _cliTools().logger.error(`Unable to print environment info.\n${err}`);
  } finally {
    await (0, _releaseChecker.default)(ctx.root);
  }
};

var _default = {
  name: 'info',
  description: 'Get relevant version info about OS, toolchain and libraries',
  func: info
};
exports.default = _default;