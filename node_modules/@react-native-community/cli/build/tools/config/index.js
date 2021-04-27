"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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

var _findDependencies = _interopRequireDefault(require("./findDependencies"));

var _findProjectRoot = _interopRequireDefault(require("./findProjectRoot"));

var _resolveReactNativePath = _interopRequireDefault(require("./resolveReactNativePath"));

var _findAssets = _interopRequireDefault(require("./findAssets"));

var _readConfigFromDisk = require("./readConfigFromDisk");

var _assign = _interopRequireDefault(require("../assign"));

var _merge = _interopRequireDefault(require("../merge"));

var _resolveNodeModuleDir = _interopRequireDefault(require("./resolveNodeModuleDir"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getDependencyConfig(root, dependencyName, finalConfig, config, userConfig, isPlatform) {
  return (0, _merge.default)({
    root,
    name: dependencyName,
    platforms: Object.keys(finalConfig.platforms).reduce((dependency, platform) => {
      const platformConfig = finalConfig.platforms[platform];
      dependency[platform] = // Linking platforms is not supported
      isPlatform || !platformConfig ? null : platformConfig.dependencyConfig(root, config.dependency.platforms[platform]);
      return dependency;
    }, {}),
    assets: (0, _findAssets.default)(root, config.dependency.assets),
    hooks: config.dependency.hooks,
    params: config.dependency.params
  }, userConfig.dependencies[dependencyName] || {});
}
/**
 * Loads CLI configuration
 */


function loadConfig(projectRoot = (0, _findProjectRoot.default)()) {
  let lazyProject;
  const userConfig = (0, _readConfigFromDisk.readConfigFromDisk)(projectRoot);
  const initialConfig = {
    root: projectRoot,

    get reactNativePath() {
      return userConfig.reactNativePath ? _path().default.resolve(projectRoot, userConfig.reactNativePath) : (0, _resolveReactNativePath.default)(projectRoot);
    },

    dependencies: userConfig.dependencies,
    commands: userConfig.commands,

    get assets() {
      return (0, _findAssets.default)(projectRoot, userConfig.assets);
    },

    platforms: userConfig.platforms,
    haste: {
      providesModuleNodeModules: [],
      platforms: Object.keys(userConfig.platforms)
    },

    get project() {
      if (lazyProject) {
        return lazyProject;
      }

      lazyProject = {};

      for (const platform in finalConfig.platforms) {
        const platformConfig = finalConfig.platforms[platform];

        if (platformConfig) {
          lazyProject[platform] = platformConfig.projectConfig(projectRoot, userConfig.project[platform] || {});
        }
      }

      return lazyProject;
    }

  };
  let depsWithWarnings = [];
  const finalConfig = Array.from(new Set([...Object.keys(userConfig.dependencies), ...(0, _findDependencies.default)(projectRoot)])).reduce((acc, dependencyName) => {
    const localDependencyRoot = userConfig.dependencies[dependencyName] && userConfig.dependencies[dependencyName].root;
    let root;
    let config;

    try {
      root = localDependencyRoot || (0, _resolveNodeModuleDir.default)(projectRoot, dependencyName);
      const output = (0, _readConfigFromDisk.readDependencyConfigFromDisk)(root);
      config = output.config;

      if (output.legacy && !localDependencyRoot) {
        const pkg = require(_path().default.join(root, 'package.json'));

        const link = pkg.homepage || `https://npmjs.com/package/${dependencyName}`;
        depsWithWarnings.push([dependencyName, link]);
      }
    } catch (error) {
      _cliTools().logger.warn((0, _cliTools().inlineString)(`
          Package ${_chalk().default.bold(dependencyName)} has been ignored because it contains invalid configuration.

          Reason: ${_chalk().default.dim(error.message)}`));

      return acc;
    }

    const isPlatform = Object.keys(config.platforms).length > 0;
    /**
     * Legacy `rnpm` config required `haste` to be defined. With new config,
     * we do it automatically.
     *
     * @todo: Remove this once `rnpm` config is deprecated and all major RN libs are converted.
     */

    const haste = config.haste || {
      providesModuleNodeModules: isPlatform ? [dependencyName] : [],
      platforms: Object.keys(config.platforms)
    };
    return (0, _assign.default)({}, acc, {
      dependencies: (0, _assign.default)({}, acc.dependencies, {
        get [dependencyName]() {
          return getDependencyConfig(root, dependencyName, finalConfig, config, userConfig, isPlatform);
        }

      }),
      commands: [...acc.commands, ...config.commands],
      platforms: _objectSpread({}, acc.platforms, config.platforms),
      haste: {
        providesModuleNodeModules: [...acc.haste.providesModuleNodeModules, ...haste.providesModuleNodeModules],
        platforms: [...acc.haste.platforms, ...haste.platforms]
      }
    });
  }, initialConfig);

  if (depsWithWarnings.length) {
    _cliTools().logger.warn(`The following packages use deprecated "rnpm" config that will stop working from next release:\n${depsWithWarnings.map(([name, link]) => `  - ${_chalk().default.bold(name)}: ${_chalk().default.dim(_chalk().default.underline(link))}`).join('\n')}\nPlease notify their maintainers about it. You can find more details at ${_chalk().default.dim.underline('https://github.com/react-native-community/cli/blob/master/docs/configuration.md#migration-guide')}.`);
  }

  return finalConfig;
}

var _default = loadConfig;
exports.default = _default;