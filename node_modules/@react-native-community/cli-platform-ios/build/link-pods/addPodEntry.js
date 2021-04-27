"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addPodEntry;

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
function addPodEntry(podLines, linesToAddEntry, podspecPath, nodeModulePath) {
  const podName = (0, _getPodspecName.default)(podspecPath);
  const newEntry = `pod '${podName}', :path => '../node_modules/${nodeModulePath}'\n`;

  if (!linesToAddEntry) {
    return;
  }

  if (Array.isArray(linesToAddEntry)) {
    linesToAddEntry.map(({
      line,
      indentation
    }, idx) => {
      _cliTools().logger.debug(`Adding ${podName} to Pod file"`);

      podLines.splice(line + idx, 0, getLineToAdd(newEntry, indentation));
    });
  } else {
    const {
      line,
      indentation
    } = linesToAddEntry;

    _cliTools().logger.debug(`Adding ${podName} to Pod file"`);

    podLines.splice(line, 0, getLineToAdd(newEntry, indentation));
  }
}

function getLineToAdd(newEntry, indentation) {
  const spaces = Array(indentation + 1).join(' ');
  return spaces + newEntry;
}