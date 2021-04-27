"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _RamBundle() {
  const data = _interopRequireDefault(require("metro/src/shared/output/RamBundle"));

  _RamBundle = function () {
    return data;
  };

  return data;
}

var _bundle = require("./bundle");

var _bundleCommandLineArgs = _interopRequireDefault(require("./bundleCommandLineArgs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// @ts-ignore - no typed definition for the package

/**
 * Builds the bundle starting to look for dependencies at the given entry path.
 */
function ramBundle(argv, config, args) {
  return (0, _bundle.withOutput)(argv, config, args, _RamBundle().default);
}

var _default = {
  name: 'ram-bundle',
  description: 'builds javascript as a "Random Access Module" bundle for offline use',
  func: ramBundle,
  options: _bundleCommandLineArgs.default.concat({
    name: '--indexed-ram-bundle',
    description: 'Force the "Indexed RAM" bundle file format, even when building for android',
    default: false
  })
};
exports.default = _default;