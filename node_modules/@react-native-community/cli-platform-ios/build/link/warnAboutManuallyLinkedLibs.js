"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = warnAboutManuallyLinkedLibs;

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

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: move to cli-tools once platform-ios and platform-android are migrated
// to TS and unify with Android implementation
function warnAboutManuallyLinkedLibs(config, platform = 'ios', linkConfig = (0, _index.default)()) {
  let deps = [];

  for (let key in config.dependencies) {
    const dependency = config.dependencies[key];

    try {
      const projectConfig = config.project[platform];
      const dependencyConfig = dependency.platforms[platform];

      if (projectConfig && dependencyConfig) {
        const x = linkConfig.isInstalled(projectConfig, dependency.name, dependencyConfig);
        deps = deps.concat(x ? dependency.name : []);
      }
    } catch (error) {
      _cliTools().logger.debug('Checking manually linked modules failed.', error);
    }
  }

  const installedModules = [...new Set(deps)];

  if (installedModules.length) {
    _cliTools().logger.error(`React Native CLI uses autolinking for native dependencies, but the following modules are linked manually: \n${installedModules.map(x => `  - ${_chalk().default.bold(x)} ${_chalk().default.dim(`(to unlink run: "react-native unlink ${x}")`)}`).join('\n')}\nThis is likely happening when upgrading React Native from below 0.60 to 0.60 or above. Going forward, you can unlink this dependency via "react-native unlink <dependency>" and it will be included in your app automatically. If a library isn't compatible with autolinking, disregard this message and notify the library maintainers.\nRead more about autolinking: ${_chalk().default.dim.underline('https://github.com/react-native-community/cli/blob/master/docs/autolinking.md')}`);
  }
}