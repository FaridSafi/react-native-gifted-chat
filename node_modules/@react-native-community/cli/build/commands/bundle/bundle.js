"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withOutput = exports.default = void 0;

var _buildBundle = _interopRequireDefault(require("./buildBundle"));

var _bundleCommandLineArgs = _interopRequireDefault(require("./bundleCommandLineArgs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Builds the bundle starting to look for dependencies at the given entry path.
 */
function bundleWithOutput(_, config, args, output) // untyped metro/src/shared/output/bundle or metro/src/shared/output/RamBundle
{
  return (0, _buildBundle.default)(args, config, output);
}

var _default = {
  name: 'bundle',
  description: 'builds the javascript bundle for offline use',
  func: bundleWithOutput,
  options: _bundleCommandLineArgs.default,
  // Used by `ramBundle.js`
  withOutput: bundleWithOutput
};
exports.default = _default;
const withOutput = bundleWithOutput;
exports.withOutput = withOutput;