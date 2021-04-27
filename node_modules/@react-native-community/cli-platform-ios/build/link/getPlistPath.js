"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getPlistPath;

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

var _getBuildProperty = _interopRequireDefault(require("./getBuildProperty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function getPlistPath(project, sourceDir) {
  const plistFile = (0, _getBuildProperty.default)(project, 'INFOPLIST_FILE');

  if (!plistFile) {
    return null;
  }

  return _path().default.join(sourceDir, plistFile.replace(/"/g, '').replace('$(SRCROOT)', ''));
}