"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getYarnVersionIfAvailable = getYarnVersionIfAvailable;
exports.isProjectUsingYarn = isProjectUsingYarn;

function _child_process() {
  const data = require("child_process");

  _child_process = function () {
    return data;
  };

  return data;
}

function _semver() {
  const data = _interopRequireDefault(require("semver"));

  _semver = function () {
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

function _findUp() {
  const data = _interopRequireDefault(require("find-up"));

  _findUp = function () {
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

/**
 * Use Yarn if available, it's much faster than the npm client.
 * Return the version of yarn installed on the system, null if yarn is not available.
 */
function getYarnVersionIfAvailable() {
  let yarnVersion;

  try {
    // execSync returns a Buffer -> convert to string
    yarnVersion = ((0, _child_process().execSync)('yarn --version', {
      stdio: [0, 'pipe', 'ignore']
    }).toString() || '').trim();
  } catch (error) {
    return null;
  } // yarn < 0.16 has a 'missing manifest' bug


  try {
    if (_semver().default.gte(yarnVersion, '0.16.0')) {
      return yarnVersion;
    }

    return null;
  } catch (error) {
    _cliTools().logger.error(`Cannot parse yarn version: ${yarnVersion}`);

    return null;
  }
}
/**
 * Check if project is using Yarn (has `yarn.lock` in the tree)
 */


function isProjectUsingYarn(cwd) {
  return _findUp().default.sync('yarn.lock', {
    cwd
  });
}