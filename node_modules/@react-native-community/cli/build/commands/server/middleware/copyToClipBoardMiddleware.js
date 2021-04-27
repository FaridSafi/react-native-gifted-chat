"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = copyMiddleware;

var _copyToClipBoard = _interopRequireDefault(require("../copyToClipBoard"));

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

/**
 * Handle the request from JS to copy contents onto host system clipboard.
 * This is only supported on Mac for now.
 */
function copyMiddleware(req, res, next) {
  if (req.url === '/copy-to-clipboard') {
    const ret = (0, _copyToClipBoard.default)(req.rawBody);

    if (!ret) {
      _cliTools().logger.warn('Copy button is not supported on this platform!');
    }

    res.end('OK');
  } else {
    next();
  }
}