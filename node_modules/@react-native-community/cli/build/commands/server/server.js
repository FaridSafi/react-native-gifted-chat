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

var _runServer = _interopRequireDefault(require("./runServer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var _default = {
  name: 'start',
  func: _runServer.default,
  description: 'starts the webserver',
  options: [{
    name: '--port [number]',
    parse: val => Number(val)
  }, {
    name: '--host [string]',
    default: ''
  }, {
    name: '--projectRoot [path]',
    description: 'Path to a custom project root',
    parse: val => _path().default.resolve(val)
  }, {
    name: '--watchFolders [list]',
    description: 'Specify any additional folders to be added to the watch list',
    parse: val => val.split(',').map(folder => _path().default.resolve(folder))
  }, {
    name: '--assetPlugins [list]',
    description: 'Specify any additional asset plugins to be used by the packager by full filepath',
    parse: val => val.split(',')
  }, {
    name: '--assetExts [list]',
    description: 'Specify any additional asset extensions to be used by the packager',
    parse: val => val.split(',')
  }, {
    name: '--sourceExts [list]',
    description: 'Specify any additional source extensions to be used by the packager',
    parse: val => val.split(',')
  }, {
    name: '--platforms [list]',
    description: 'Specify any additional platforms to be used by the packager',
    parse: val => val.split(',')
  }, {
    name: '--providesModuleNodeModules [list]',
    description: 'Specify any npm packages that import dependencies with providesModule',
    parse: val => val.split(',')
  }, {
    name: '--max-workers [number]',
    description: 'Specifies the maximum number of workers the worker-pool ' + 'will spawn for transforming files. This defaults to the number of the ' + 'cores available on your machine.',
    parse: workers => Number(workers)
  }, {
    name: '--transformer [string]',
    description: 'Specify a custom transformer to be used'
  }, {
    name: '--reset-cache, --resetCache',
    description: 'Removes cached files'
  }, {
    name: '--custom-log-reporter-path, --customLogReporterPath [string]',
    description: 'Path to a JavaScript file that exports a log reporter as a replacement for TerminalReporter'
  }, {
    name: '--verbose',
    description: 'Enables logging'
  }, {
    name: '--https',
    description: 'Enables https connections to the server'
  }, {
    name: '--key [path]',
    description: 'Path to custom SSL key'
  }, {
    name: '--cert [path]',
    description: 'Path to custom SSL cert'
  }, {
    name: '--config [string]',
    description: 'Path to the CLI configuration file',
    parse: val => _path().default.resolve(val)
  }, {
    name: '--no-interactive',
    description: 'Disables interactive mode'
  }]
};
exports.default = _default;