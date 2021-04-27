"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = warnAboutPodInstall;

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
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

var _getDependenciesFromPodfileLock = _interopRequireDefault(require("../link-pods/getDependenciesFromPodfileLock"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function warnAboutPodInstall(config) {
  const podLockDeps = (0, _getDependenciesFromPodfileLock.default)(`${config.project.ios.podfile}.lock`);
  const podDeps = Object.keys(config.dependencies).map(depName => {
    const dependency = config.dependencies[depName].platforms.ios;
    return dependency && dependency.podspecPath ? _path().default.basename(dependency.podspecPath).replace(/\.podspec/, '') : '';
  }).filter(Boolean);
  const missingPods = podDeps.filter(podDep => !podLockDeps.includes(podDep));

  if (missingPods.length) {
    _cliTools().logger.error(`Could not find the following native modules: ${missingPods.map(pod => _chalk().default.bold(pod)).join(', ')}. Did you forget to run "${_chalk().default.bold('pod install')}" ?`);
  }
}