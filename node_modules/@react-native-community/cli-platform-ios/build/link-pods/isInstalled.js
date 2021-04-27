"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isInstalled;

var _readPodfile = _interopRequireDefault(require("./readPodfile"));

var _getPodspecName = _interopRequireDefault(require("../config/getPodspecName"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function isInstalled(iOSProject, dependencyConfig) {
  if (!iOSProject.podfile || !dependencyConfig.podspecPath) {
    return false;
  } // match line with pod declaration: pod 'dependencyPodName' (other possible parameters of pod are ignored)


  const dependencyRegExp = new RegExp(`pod\\s+('|")${(0, _getPodspecName.default)(dependencyConfig.podspecPath)}('|")`, 'g');
  const podLines = (0, _readPodfile.default)(iOSProject.podfile);

  for (let i = 0, len = podLines.length; i < len; i++) {
    const match = podLines[i].match(dependencyRegExp);

    if (match) {
      return true;
    }
  }

  return false;
}