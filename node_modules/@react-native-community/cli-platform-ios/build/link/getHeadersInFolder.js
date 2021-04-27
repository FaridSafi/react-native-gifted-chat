"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getHeadersInFolder;

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
const GLOB_EXCLUDE_PATTERN = ['node_modules/**', 'Pods/**', 'Examples/**', 'examples/**'];
/**
 * Given folder, it returns an array of all header files
 * inside it, ignoring node_modules and examples
 */

function getHeadersInFolder(folder) {
  return _glob().default.sync('**/*.h', {
    cwd: folder,
    nodir: true,
    ignore: GLOB_EXCLUDE_PATTERN
  }).map(file => _path().default.join(folder, file));
}