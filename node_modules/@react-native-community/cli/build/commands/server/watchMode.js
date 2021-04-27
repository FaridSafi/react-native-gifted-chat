"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _readline() {
  const data = _interopRequireDefault(require("readline"));

  _readline = function () {
    return data;
  };

  return data;
}

var _hookStdout = _interopRequireDefault(require("../../tools/hookStdout"));

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function printWatchModeInstructions() {
  _cliTools().logger.log('\n\nTo reload the app press "r"\nTo open developer menu press "d"');
}

function enableWatchMode(messageSocket) {
  // We need to set this to true to catch key presses individually.
  // As a result we have to implement our own method for exiting
  // and other commands (e.g. ctrl+c & ctrl+z)
  if (!process.stdin.setRawMode) {
    _cliTools().logger.debug('Watch mode is not supported in this environment');

    return;
  }

  _readline().default.emitKeypressEvents(process.stdin);

  process.stdin.setRawMode(true); // We have no way of knowing when the dependency graph is done loading
  // except by hooking into stdout itself. We want to print instructions
  // right after its done loading.

  const restore = (0, _hookStdout.default)(output => {
    if (output.includes('Loading dependency graph, done.')) {
      printWatchModeInstructions();
      restore();
    }
  });
  process.stdin.on('keypress', (_key, data) => {
    const {
      ctrl,
      name
    } = data;

    if (ctrl === true) {
      switch (name) {
        case 'c':
          process.exit();
          break;

        case 'z':
          process.emit('SIGTSTP');
          break;
      }
    } else if (name === 'r') {
      messageSocket.broadcast('reload', null);

      _cliTools().logger.info('Reloading app...');
    } else if (name === 'd') {
      messageSocket.broadcast('devMenu', null);

      _cliTools().logger.info('Opening developer menu...');
    }
  });
}

var _default = enableWatchMode;
exports.default = _default;