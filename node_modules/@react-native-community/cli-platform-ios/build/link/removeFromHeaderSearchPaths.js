"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addToHeaderSearchPaths;

var _mapHeaderSearchPaths = _interopRequireDefault(require("./mapHeaderSearchPaths"));

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
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
 * Given Xcode project and absolute path, it makes sure there are no headers referring to it
 */
function addToHeaderSearchPaths(project, path) {
  _cliTools().logger.debug(`Removing ${path} from header search paths`);

  (0, _mapHeaderSearchPaths.default)(project, searchPaths => searchPaths.filter(searchPath => searchPath !== path));
}