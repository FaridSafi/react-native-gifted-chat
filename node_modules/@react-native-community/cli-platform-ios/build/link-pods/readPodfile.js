"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = readPodfile;

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
function readPodfile(podfilePath) {
  _cliTools().logger.debug(`Reading ${podfilePath}`);

  const podContent = _fs().default.readFileSync(podfilePath, 'utf8');

  return podContent.split(/\r?\n/g);
}