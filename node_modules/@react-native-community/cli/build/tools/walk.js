"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
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
function walk(current) {
  if (!_fs().default.lstatSync(current).isDirectory()) {
    return [current];
  }

  const files = _fs().default.readdirSync(current).map(child => walk(_path().default.join(current, child)));

  const result = [];
  return result.concat.apply([current], files);
}

var _default = walk;
exports.default = _default;