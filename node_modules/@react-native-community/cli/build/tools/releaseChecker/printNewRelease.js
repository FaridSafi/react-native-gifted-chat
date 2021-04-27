"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = printNewRelease;

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

var _releaseCacheManager = _interopRequireDefault(require("./releaseCacheManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Notifies the user that a newer version of React Native is available.
 */
function printNewRelease(name, latestRelease, currentVersion) {
  _cliTools().logger.info(`React Native v${latestRelease.version} is now available (your project is running on v${currentVersion}).`);

  _cliTools().logger.info(`Changelog: ${_chalk().default.dim.underline(latestRelease.changelogUrl)}.`);

  _cliTools().logger.info(`Diff: ${_chalk().default.dim.underline(latestRelease.diffUrl)}.`);

  _cliTools().logger.info(`To upgrade, run "${_chalk().default.bold('react-native upgrade')}".`);

  _releaseCacheManager.default.set(name, 'lastChecked', new Date().toISOString());
}