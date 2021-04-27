"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = releaseChecker;

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
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

var _resolveNodeModuleDir = _interopRequireDefault(require("../config/resolveNodeModuleDir"));

var _getLatestRelease = _interopRequireDefault(require("./getLatestRelease"));

var _printNewRelease = _interopRequireDefault(require("./printNewRelease"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore - JS file
async function releaseChecker(root) {
  try {
    const {
      version: currentVersion
    } = require(_path().default.join((0, _resolveNodeModuleDir.default)(root, 'react-native'), 'package.json'));

    const {
      name
    } = require(_path().default.join(root, 'package.json'));

    const latestRelease = await (0, _getLatestRelease.default)(name, currentVersion);

    if (latestRelease) {
      (0, _printNewRelease.default)(name, latestRelease, currentVersion);
    }
  } catch (e) {
    // We let the flow continue as this component is not vital for the rest of
    // the CLI.
    _cliTools().logger.debug('Cannot detect current version of React Native, ' + 'skipping check for a newer release');

    _cliTools().logger.debug(e);
  }
}