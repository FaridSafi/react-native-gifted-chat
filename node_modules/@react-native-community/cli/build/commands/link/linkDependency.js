"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = linkDependency;

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

var _pollParams = _interopRequireDefault(require("./pollParams"));

var _getPlatformName = _interopRequireDefault(require("./getPlatformName"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function linkDependency(platforms, project, dependency) {
  const params = await (0, _pollParams.default)(dependency.params);
  Object.keys(platforms || {}).forEach(platform => {
    const projectConfig = project[platform];
    const dependencyConfig = dependency.platforms[platform];

    if (!projectConfig || !dependencyConfig) {
      return;
    }

    const {
      name
    } = dependency;
    const linkConfig = platforms[platform] && platforms[platform].linkConfig && platforms[platform].linkConfig();

    if (!linkConfig || !linkConfig.isInstalled || !linkConfig.register) {
      return;
    }

    const isInstalled = linkConfig.isInstalled(projectConfig, name, dependencyConfig);

    if (isInstalled) {
      _cliTools().logger.info(`${(0, _getPlatformName.default)(platform)} module "${_chalk().default.bold(name)}" is already linked`);

      return;
    }

    _cliTools().logger.info(`Linking "${_chalk().default.bold(name)}" ${(0, _getPlatformName.default)(platform)} dependency`);

    linkConfig.register(name, dependencyConfig, params, projectConfig);

    _cliTools().logger.info(`${(0, _getPlatformName.default)(platform)} module "${_chalk().default.bold(dependency.name)}" has been successfully linked`);
  });
}