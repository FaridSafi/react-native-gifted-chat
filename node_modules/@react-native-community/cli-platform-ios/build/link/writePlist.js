"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = writePlist;

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
 * Writes to Info.plist located in the iOS project
 *
 * Returns `null` if INFOPLIST_FILE is not specified or file is non-existent.
 */
function writePlist(project, sourceDir, plist) {
  const plistPath = (0, _getPlistPath.default)(project, sourceDir);

  if (!plistPath) {
    return null;
  } // We start with an offset of -1, because Xcode maintains a custom
  // indentation of the plist.
  // Ref: https://github.com/facebook/react-native/issues/11668


  return _fs().default.writeFileSync(plistPath, // @ts-ignore Type mismatch
  `${_plist().default.build(plist, {
    indent: '\t',
    offset: -1
  })}\n`);
}