"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = applyPatch;

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
function applyPatch(file, patch) {
  if (file) {
    _cliTools().logger.debug(`Patching ${file}`);
  }

  _fs().default.writeFileSync(file, _fs().default.readFileSync(file, 'utf8').replace(patch.pattern, match => `${match}${patch.patch}`));
}