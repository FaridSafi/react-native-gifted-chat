"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = openURLMiddleware;

var _launchDefaultBrowser = _interopRequireDefault(require("../launchDefaultBrowser"));

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
 */

/**
 * Handle request from JS to open an arbitrary URL in Chrome
 */
function openURLMiddleware(req, res, next) {
  if (req.url === '/open-url') {
    const {
      url
    } = JSON.parse(req.rawBody);

    _cliTools().logger.info(`Opening ${url}...`);

    (0, _launchDefaultBrowser.default)(url);
    res.end('OK');
  } else {
    next();
  }
}