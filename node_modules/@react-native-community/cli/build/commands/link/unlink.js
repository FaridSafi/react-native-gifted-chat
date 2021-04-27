"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _lodash() {
  const data = require("lodash");

  _lodash = function () {
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

var _getPlatformName = _interopRequireDefault(require("./getPlatformName"));

var _makeHook = _interopRequireDefault(require("./makeHook"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _toPropertyKey(key) { if (typeof key === "symbol") { return key; } else { return String(key); } }

const unlinkDependency = (platforms, project, dependency, packageName, otherDependencies) => {
  Object.keys(platforms || {}).forEach(platform => {
    const projectConfig = project[platform];
    const dependencyConfig = dependency.platforms[platform];

    if (!projectConfig || !dependencyConfig) {
      return;
    }

    const linkConfig = platforms[platform] && platforms[platform].linkConfig && platforms[platform].linkConfig();

    if (!linkConfig || !linkConfig.isInstalled || !linkConfig.unregister) {
      return;
    }

    const isInstalled = linkConfig.isInstalled(projectConfig, packageName, dependencyConfig);

    if (!isInstalled) {
      _cliTools().logger.info(`${(0, _getPlatformName.default)(platform)} module "${packageName}" is not installed`);

      return;
    }

    _cliTools().logger.info(`Unlinking "${packageName}" ${(0, _getPlatformName.default)(platform)} dependency`);

    linkConfig.unregister(packageName, dependencyConfig, projectConfig, otherDependencies);

    _cliTools().logger.info(`${(0, _getPlatformName.default)(platform)} module "${dependency.name}" has been successfully unlinked`);
  });
};
/**
 * Updates project and unlink specific dependency
 *
 * If optional argument [packageName] is provided, it's the only one
 * that's checked
 */


async function unlink(args, ctx, opts) {
  const packageName = args[0];
  let platforms = ctx.platforms;

  if (opts.platforms) {
    // @ts-ignore
    platforms = (0, _lodash().pick)(platforms, opts.platforms);

    _cliTools().logger.debug('Skipping selected platforms');
  }

  _cliTools().logger.debug(`Available platforms: ${Object.keys(platforms).map(_getPlatformName.default).join(', ')}`);

  const _ctx$dependencies = ctx.dependencies,
        {
    [packageName]: dependency
  } = _ctx$dependencies,
        otherDependencies = _objectWithoutProperties(_ctx$dependencies, [packageName].map(_toPropertyKey));

  if (!dependency) {
    throw new (_cliTools().CLIError)(`
      Failed to unlink "${packageName}". It appears that the project is not linked yet.
    `);
  }

  const dependencies = (0, _lodash().values)(otherDependencies);

  try {
    if (dependency.hooks.preunlink) {
      await (0, _makeHook.default)(dependency.hooks.preunlink)();
    }

    unlinkDependency(platforms, ctx.project, dependency, packageName, dependencies);

    if (dependency.hooks.postunlink) {
      await (0, _makeHook.default)(dependency.hooks.postunlink)();
    }
  } catch (error) {
    throw new (_cliTools().CLIError)(`Something went wrong while unlinking. Reason ${error.message}`, error);
  } // @todo move all these to above try/catch
  // @todo it is possible we could be unlinking some project assets in case of duplicate


  const assets = (0, _lodash().difference)(dependency.assets, (0, _lodash().flatMap)(dependencies, d => d.assets));

  if (assets.length === 0) {
    return;
  }

  Object.keys(platforms || {}).forEach(platform => {
    const projectConfig = ctx.project[platform];
    const linkConfig = platforms[platform] && platforms[platform].linkConfig && platforms[platform].linkConfig();

    if (!linkConfig || !linkConfig.unlinkAssets || !projectConfig) {
      return;
    }

    _cliTools().logger.info(`Unlinking assets from ${platform} project`);

    linkConfig.unlinkAssets(assets, projectConfig);
  });

  _cliTools().logger.info(`${packageName} assets has been successfully unlinked from your project`);
}

var _default = {
  func: unlink,
  description: 'unlink native dependency',
  name: 'unlink <packageName>',
  options: [{
    name: '--platforms [list]',
    description: 'Scope unlinking to specified platforms',
    parse: val => val.toLowerCase().split(',')
  }]
};
exports.default = _default;