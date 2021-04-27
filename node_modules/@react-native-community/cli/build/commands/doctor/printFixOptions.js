"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.KEYS = void 0;

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
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

const KEYS = {
  FIX_ALL_ISSUES: 'f',
  FIX_ERRORS: 'e',
  FIX_WARNINGS: 'w',
  EXIT: '\r'
};
exports.KEYS = KEYS;

const printOption = option => _cliTools().logger.log(` \u203A ${option}`);

const printOptions = () => {
  _cliTools().logger.log();

  _cliTools().logger.log(_chalk().default.bold('Usage'));

  printOption(`${_chalk().default.dim('Press')} ${KEYS.FIX_ALL_ISSUES} ${_chalk().default.dim('to try to fix issues.')}`);
  printOption(`${_chalk().default.dim('Press')} ${KEYS.FIX_ERRORS} ${_chalk().default.dim('to try to fix errors.')}`);
  printOption(`${_chalk().default.dim('Press')} ${KEYS.FIX_WARNINGS} ${_chalk().default.dim('to try to fix warnings.')}`);
  printOption(`${_chalk().default.dim('Press')} Enter ${_chalk().default.dim('to exit.')}`);
};

var _default = (_ref) => {
  let {
    onKeyPress
  } = _ref;
  printOptions();

  if (process.stdin.setRawMode) {
    process.stdin.setRawMode(true);
  }

  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', onKeyPress);
};

exports.default = _default;