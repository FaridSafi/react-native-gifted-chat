"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = removePodEntry;

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

var _getPodspecName = _interopRequireDefault(require("../config/getPodspecName"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function removePodEntry(podfileContent, podspecPath) {
  const podName = (0, _getPodspecName.default)(podspecPath); // this regex should catch line(s) with full pod definition, like: pod 'podname', :path => '../node_modules/podname', :subspecs => ['Sub2', 'Sub1']

  const podRegex = new RegExp(`\\n( |\\t)*pod\\s+("|')${podName}("|')(,\\s*(:[a-z]+\\s*=>)?\\s*(("|').*?("|')|\\[[\\s\\S]*?\\]))*\\n`, 'g');

  _cliTools().logger.debug(`Removing ${podName} from Pod file`);

  return podfileContent.replace(podRegex, '\n');
}