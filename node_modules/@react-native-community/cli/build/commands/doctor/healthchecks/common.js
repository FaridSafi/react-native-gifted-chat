"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeMessage = removeMessage;
exports.logError = exports.logManualInstallation = exports.logMessage = void 0;

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

function _readline() {
  const data = _interopRequireDefault(require("readline"));

  _readline = function () {
    return data;
  };

  return data;
}

function _wcwidth() {
  const data = _interopRequireDefault(require("wcwidth"));

  _wcwidth = function () {
    return data;
  };

  return data;
}

function _stripAnsi() {
  const data = _interopRequireDefault(require("strip-ansi"));

  _stripAnsi = function () {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Space is necessary to keep correct ordering on screen
const logMessage = message => {
  const indentation = '   ';

  if (typeof message !== 'string') {
    _cliTools().logger.log();

    return;
  }

  const messageByLine = message.split('\n');
  return _cliTools().logger.log(`${indentation}${messageByLine.join(`\n${indentation}`)}`);
};

exports.logMessage = logMessage;

const addBlankLine = () => logMessage();

const logManualInstallation = ({
  healthcheck,
  url,
  command,
  message
}) => {
  if (message) {
    return logMessage(message);
  }

  if (url) {
    logMessage(`Read more about how to download ${healthcheck} at ${_chalk().default.dim.underline(url)}`);
    return;
  }

  if (command) {
    logMessage(`Please install ${healthcheck} by running ${_chalk().default.bold(command)}`);
  }
};

exports.logManualInstallation = logManualInstallation;

const logError = ({
  healthcheck,
  loader,
  error,
  message,
  command
}) => {
  if (loader) {
    loader.fail();
  }

  addBlankLine();
  logMessage(_chalk().default.dim(error.message));

  if (message) {
    logMessage(message);
    addBlankLine();
    return;
  }

  logMessage(`The error above occured while trying to install ${healthcheck}. Please try again manually: ${_chalk().default.bold(command)}`);
  addBlankLine();
}; // Calculate the size of a message on terminal based on rows


exports.logError = logError;

function calculateMessageSize(message) {
  return Math.max(1, Math.ceil((0, _wcwidth().default)((0, _stripAnsi().default)(message)) / (process.stdout.columns || 80)));
} // Clear the message from the terminal


function removeMessage(message) {
  _readline().default.moveCursor(process.stdout, 0, -calculateMessageSize(message));

  _readline().default.clearScreenDown(process.stdout);
}