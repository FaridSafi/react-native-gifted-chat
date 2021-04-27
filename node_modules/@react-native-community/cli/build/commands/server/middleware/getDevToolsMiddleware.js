"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDevToolsMiddleware;

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

function _child_process() {
  const data = require("child_process");

  _child_process = function () {
    return data;
  };

  return data;
}

var _launchDebugger = _interopRequireDefault(require("../launchDebugger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function launchDefaultDebugger(host, port, args = '') {
  const hostname = host || 'localhost';
  const debuggerURL = `http://${hostname}:${port}/debugger-ui${args}`;

  _cliTools().logger.info('Launching Dev Tools...');

  (0, _launchDebugger.default)(debuggerURL);
}

function escapePath(pathname) {
  // " Can escape paths with spaces in OS X, Windows, and *nix
  return `"${pathname}"`;
}

function launchDevTools({
  host,
  port,
  watchFolders
}, isDebuggerConnected) {
  // Explicit config always wins
  const customDebugger = process.env.REACT_DEBUGGER;

  if (customDebugger) {
    startCustomDebugger({
      watchFolders,
      customDebugger
    });
  } else if (!isDebuggerConnected()) {
    // Debugger is not yet open; we need to open a session
    launchDefaultDebugger(host, port);
  }
}

function startCustomDebugger({
  watchFolders,
  customDebugger
}) {
  const folders = watchFolders.map(escapePath).join(' ');
  const command = `${customDebugger} ${folders}`;

  _cliTools().logger.info('Starting custom debugger by executing:', command);

  (0, _child_process().exec)(command, function (error) {
    if (error !== null) {
      _cliTools().logger.error('Error while starting custom debugger:', error.stack || '');
    }
  });
}

function getDevToolsMiddleware(options, isDebuggerConnected) {
  return function devToolsMiddleware(req, res, next) {
    if (req.url === '/launch-js-devtools') {
      launchDevTools(options, isDebuggerConnected);
      res.end('OK');
    } else {
      next();
    }
  };
}