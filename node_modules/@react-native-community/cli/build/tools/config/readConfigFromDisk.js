"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readConfigFromDisk = readConfigFromDisk;
exports.readDependencyConfigFromDisk = readDependencyConfigFromDisk;

function _joi() {
  const data = _interopRequireDefault(require("@hapi/joi"));

  _joi = function () {
    return data;
  };

  return data;
}

function _cosmiconfig() {
  const data = _interopRequireDefault(require("cosmiconfig"));

  _cosmiconfig = function () {
    return data;
  };

  return data;
}

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

var _errors = require("./errors");

var schema = _interopRequireWildcard(require("./schema"));

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

var _resolveReactNativePath = _interopRequireDefault(require("./resolveReactNativePath"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MIGRATION_GUIDE = `Migration guide: ${_chalk().default.dim.underline('https://github.com/react-native-community/cli/blob/master/docs/configuration.md')}`;

/**
 * Places to look for the new configuration
 */
const searchPlaces = ['react-native.config.js'];

function readLegacyConfigFromDisk(rootFolder) {
  let config;

  try {
    config = require(_path().default.join(rootFolder, 'package.json')).rnpm;
  } catch (error) {
    // when `init` is running, there's no package.json yet
    return undefined;
  }

  if (!config) {
    return undefined;
  }

  const transformedConfig = {
    project: {
      ios: config.ios,
      android: config.android
    },
    assets: config.assets,
    commands: [],
    dependencies: {},
    // @ts-ignore - TODO: platforms can be empty, adjust types
    platforms: {},

    get reactNativePath() {
      return config.reactNativePath ? _path().default.resolve(rootFolder, config.reactNativePath) : (0, _resolveReactNativePath.default)(rootFolder);
    }

  };

  _cliTools().logger.warn(`Your project is using deprecated "${_chalk().default.bold('rnpm')}" config that will stop working from next release. Please use a "${_chalk().default.bold('react-native.config.js')}" file to configure the React Native CLI. ${MIGRATION_GUIDE}`);

  return transformedConfig;
}
/**
 * Reads a project configuration as defined by the user in the current
 * workspace.
 */


function readConfigFromDisk(rootFolder) {
  const explorer = (0, _cosmiconfig().default)('react-native', {
    searchPlaces,
    stopDir: rootFolder
  });
  const {
    config
  } = explorer.searchSync(rootFolder) || {
    config: readLegacyConfigFromDisk(rootFolder)
  };

  const result = _joi().default.validate(config, schema.projectConfig);

  if (result.error) {
    throw new _errors.JoiError(result.error);
  }

  return result.value;
}
/**
 * Reads a dependency configuration as defined by the developer
 * inside `node_modules`.
 */


function readDependencyConfigFromDisk(rootFolder) {
  const explorer = (0, _cosmiconfig().default)('react-native', {
    stopDir: rootFolder,
    searchPlaces
  });
  const searchResult = explorer.searchSync(rootFolder);
  const legacy = !searchResult;
  let config = searchResult ? searchResult.config : readLegacyDependencyConfigFromDisk(rootFolder);

  const result = _joi().default.validate(config, schema.dependencyConfig);

  if (result.error) {
    throw new _errors.JoiError(result.error);
  }

  return {
    config: result.value,
    legacy: legacy && config !== undefined
  };
}
/**
 * Returns an array of commands that are defined in the project.
 *
 * `config.project` can be either an array of paths or a single string.
 * Each of the files can export a commands (object) or an array of commands
 */


const loadProjectCommands = (root, commands) => {
  return [].concat(commands || []).reduce((acc, cmdPath) => {
    const cmds = require(_path().default.join(root, cmdPath));

    return acc.concat(cmds);
  }, []);
};
/**
 * Reads a legacy configuration from a `package.json` "rnpm" key.
 */


function readLegacyDependencyConfigFromDisk(rootFolder) {
  let config = {};

  try {
    config = require(_path().default.join(rootFolder, 'package.json')).rnpm;
  } catch (error) {
    // package.json is usually missing in local libraries that are not in
    // project "dependencies", so we just return a bare config
    // @ts-ignore - TODO: platforms can be empty, adjust types
    return {
      dependency: {
        platforms: {},
        assets: [],
        hooks: {},
        params: []
      },
      commands: [],
      platforms: {}
    };
  }

  if (!config) {
    return undefined;
  }

  const transformedConfig = {
    dependency: {
      platforms: {
        ios: config.ios,
        android: config.android
      },
      assets: config.assets,
      // @ts-ignore – likely a bug, but we don't care because legacy config is soon to be removed
      hooks: config.commands,
      params: config.params
    },
    haste: config.haste,
    commands: loadProjectCommands(rootFolder, config.plugin),
    platforms: config.platform ? require(_path().default.join(rootFolder, config.platform)) : {}
  };
  return transformedConfig;
}