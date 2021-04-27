"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findManifest;

function _glob() {
  const data = _interopRequireDefault(require("glob"));

  _glob = function () {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function findManifest(folder) {
  const manifestPath = _glob().default.sync(_path().default.join('**', 'AndroidManifest.xml'), {
    cwd: folder,
    ignore: ['node_modules/**', '**/build/**', '**/debug/**', 'Examples/**', 'examples/**']
  })[0];

  return manifestPath ? _path().default.join(folder, manifestPath) : null;
}