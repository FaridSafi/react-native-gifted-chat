"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.func = void 0;

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

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

var _linkDependency = _interopRequireDefault(require("./linkDependency"));

var _linkAssets = _interopRequireDefault(require("./linkAssets"));

var _linkAll = _interopRequireDefault(require("./linkAll"));

var _makeHook = _interopRequireDefault(require("./makeHook"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Updates project and links all dependencies to it.
 *
 * @param args If optional argument [packageName] is provided,
 *             only that package is processed.
 */
async function link([rawPackageName], ctx, opts) {
  let platforms = ctx.platforms;
  let project = ctx.project;

  if (opts.platforms) {
    // @ts-ignore
    platforms = (0, _lodash().pick)(platforms, opts.platforms);

    _cliTools().logger.debug('Skipping selected platforms');
  }

  _cliTools().logger.debug('Available platforms: ' + `${Object.keys(platforms).map(_getPlatformName.default).join(', ')}`);

  if (rawPackageName === undefined) {
    _cliTools().logger.debug('No package name provided, will link all possible assets.');

    return (0, _linkAll.default)(ctx, {
      linkDeps: opts.all,
      linkAssets: true
    });
  } // Trim the version / tag out of the package name (eg. package@latest)


  const packageName = rawPackageName.replace(/^(.+?)(@.+?)$/gi, '$1');

  if (!Object.keys(ctx.dependencies).includes(packageName)) {
    throw new (_cliTools().CLIError)(`
      Unknown dependency. Make sure that the package you are trying to link is
      already installed in your "node_modules" and present in your "package.json" dependencies.
    `);
  }

  const {
    [packageName]: dependency
  } = ctx.dependencies;

  _cliTools().logger.debug(`Package to link: ${rawPackageName}`);

  try {
    if (dependency.hooks.prelink) {
      await (0, _makeHook.default)(dependency.hooks.prelink)();
    }

    await (0, _linkDependency.default)(platforms, project, dependency);

    if (dependency.hooks.postlink) {
      await (0, _makeHook.default)(dependency.hooks.postlink)();
    }

    await (0, _linkAssets.default)(platforms, project, dependency.assets);
  } catch (error) {
    throw new (_cliTools().CLIError)(`Linking "${_chalk().default.bold(dependency.name)}" failed.`, error);
  }
}

const func = link;
exports.func = func;
var _default = {
  func: link,
  description: 'links assets and optionally native modules',
  name: 'link [packageName]',
  options: [{
    name: '--platforms [list]',
    description: 'Scope linking to specified platforms',
    parse: val => val.toLowerCase().split(',')
  }, {
    name: '--all [boolean]',
    description: 'Link all native modules and assets',
    parse: val => val.toLowerCase().split(',')
  }]
};
exports.default = _default;