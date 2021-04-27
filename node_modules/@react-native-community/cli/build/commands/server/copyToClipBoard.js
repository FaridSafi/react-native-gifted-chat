"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _child_process() {
  const data = require("child_process");

  _child_process = function () {
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

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
const xsel = _path().default.join(__dirname, 'external/xsel');

try {
  _fs().default.chmodSync(xsel, '0755');
} catch (e) {
  _cliTools().logger.warn(`Failed to chmod xsel: ${e.message}`);
}
/**
 * Copy the content to host system clipboard.
 */


function copyToClipBoard(content) {
  switch (process.platform) {
    case 'darwin':
      {
        const child = (0, _child_process().spawn)('pbcopy', []);
        child.stdin.end(Buffer.from(content, 'utf8'));
        return true;
      }

    case 'win32':
      {
        const child = (0, _child_process().spawn)('clip', []);
        child.stdin.end(Buffer.from(content, 'utf8'));
        return true;
      }

    case 'linux':
      {
        const child = (0, _child_process().spawn)(xsel, ['--clipboard', '--input']);
        child.stdin.end(Buffer.from(content, 'utf8'));
        return true;
      }

    default:
      return false;
  }
}

var _default = copyToClipBoard;
exports.default = _default;