"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getPlist;

function _plist() {
  const data = _interopRequireDefault(require("plist"));

  _plist = function () {
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

var _getPlistPath = _interopRequireDefault(require("./getPlistPath"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Returns Info.plist located in the iOS project
 *
 * Returns `null` if INFOPLIST_FILE is not specified.
 */
function getPlist(project, sourceDir) {
  const plistPath = (0, _getPlistPath.default)(project, sourceDir);

  if (!plistPath || !_fs().default.existsSync(plistPath)) {
    return null;
  }

  return _plist().default.parse(_fs().default.readFileSync(plistPath, 'utf-8'));
}