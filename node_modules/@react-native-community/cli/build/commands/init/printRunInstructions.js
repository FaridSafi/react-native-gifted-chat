"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
    return data;
  };

  return data;
}

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
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
 * @format
 */
function printRunInstructions(projectDir, projectName) {
  const iosProjectDir = _path().default.resolve(projectDir, 'ios');

  const iosPodsFile = _path().default.resolve(iosProjectDir, `${projectName}.xcworkspace`);

  const isUsingPods = _fs().default.existsSync(iosPodsFile);

  const relativeXcodeProjectPath = _path().default.relative('..', isUsingPods ? iosPodsFile : _path().default.resolve(iosProjectDir, `${projectName}.xcodeproj`));

  _cliTools().logger.log(`
  ${_chalk().default.cyan(`Run instructions for ${_chalk().default.bold('iOS')}`)}:
    • cd "${projectDir}" && npx react-native run-ios
    ${_chalk().default.dim('- or -')}
    • Open ${relativeXcodeProjectPath} in Xcode or run "xed -b ios"
    • Hit the Run button

  ${_chalk().default.green(`Run instructions for ${_chalk().default.bold('Android')}`)}:
    • Have an Android emulator running (quickest way to get started), or a device connected.
    • cd "${projectDir}" && npx react-native run-android
`);
}

var _default = printRunInstructions;
exports.default = _default;