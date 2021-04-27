"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = savePodFile;

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
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
function savePodFile(podfilePath, podLines) {
  const newPodfile = podLines.join('\n');

  _cliTools().logger.debug(`Writing changes to ${podfilePath}`);

  _fs().default.writeFileSync(podfilePath, newPodfile);
}