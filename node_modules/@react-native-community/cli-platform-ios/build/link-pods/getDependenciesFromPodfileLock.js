"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDependenciesFromPodfileLock;

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
    return data;
  };

  return data;
}

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

function _jsYaml() {
  const data = require("js-yaml");

  _jsYaml = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CHECKSUM_KEY = 'SPEC CHECKSUMS';

function getDependenciesFromPodfileLock(podfileLockPath) {
  _cliTools().logger.debug(`Reading ${podfileLockPath}`);

  let fileContent;

  try {
    fileContent = _fs().default.readFileSync(podfileLockPath, 'utf8');
  } catch (err) {
    _cliTools().logger.error(`Could not find "Podfile.lock" at ${_chalk().default.dim(podfileLockPath)}. Did you run "${_chalk().default.bold('pod install')}" in iOS directory?`);

    return [];
  } // Previous portions of the lock file could be invalid yaml.
  // Only parse parts that are valid


  const tail = fileContent.split(CHECKSUM_KEY).slice(1);
  const checksumTail = CHECKSUM_KEY + tail;
  return Object.keys((0, _jsYaml().safeLoad)(checksumTail)[CHECKSUM_KEY] || {});
}