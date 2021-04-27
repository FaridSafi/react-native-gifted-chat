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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var _default = [{
  name: '--entry-file <path>',
  description: 'Path to the root JS file, either absolute or relative to JS root'
}, {
  name: '--platform [string]',
  description: 'Either "ios" or "android"',
  default: 'ios'
}, {
  name: '--transformer [string]',
  description: 'Specify a custom transformer to be used'
}, {
  name: '--dev [boolean]',
  description: 'If false, warnings are disabled and the bundle is minified',
  parse: val => val !== 'false',
  default: true
}, {
  name: '--minify [boolean]',
  description: 'Allows overriding whether bundle is minified. This defaults to ' + 'false if dev is true, and true if dev is false. Disabling minification ' + 'can be useful for speeding up production builds for testing purposes.',
  parse: val => val !== 'false'
}, {
  name: '--bundle-output <string>',
  description: 'File name where to store the resulting bundle, ex. /tmp/groups.bundle'
}, {
  name: '--bundle-encoding [string]',
  description: 'Encoding the bundle should be written in (https://nodejs.org/api/buffer.html#buffer_buffer).',
  default: 'utf8'
}, {
  name: '--max-workers [number]',
  description: 'Specifies the maximum number of workers the worker-pool ' + 'will spawn for transforming files. This defaults to the number of the ' + 'cores available on your machine.',
  parse: workers => Number(workers)
}, {
  name: '--sourcemap-output [string]',
  description: 'File name where to store the sourcemap file for resulting bundle, ex. /tmp/groups.map'
}, {
  name: '--sourcemap-sources-root [string]',
  description: "Path to make sourcemap's sources entries relative to, ex. /root/dir"
}, {
  name: '--sourcemap-use-absolute-path',
  description: 'Report SourceMapURL using its full path',
  default: false
}, {
  name: '--assets-dest [string]',
  description: 'Directory name where to store assets referenced in the bundle'
}, {
  name: '--reset-cache',
  description: 'Removes cached files',
  default: false
}, {
  name: '--read-global-cache',
  description: 'Try to fetch transformed JS code from the global cache, if configured.',
  default: false
}, {
  name: '--config [string]',
  description: 'Path to the CLI configuration file',
  parse: val => _path().default.resolve(val)
}];
exports.default = _default;