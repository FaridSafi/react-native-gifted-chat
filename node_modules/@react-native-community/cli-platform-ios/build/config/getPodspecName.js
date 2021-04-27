"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getPodspecName;

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
function getPodspecName(podspecFile) {
  return _path().default.basename(podspecFile).replace(/\.podspec$/, '');
}