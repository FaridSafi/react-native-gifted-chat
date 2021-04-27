"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = removeFromStaticLibraries;

function _pbxFile() {
  const data = _interopRequireDefault(require("xcode/lib/pbxFile"));

  _pbxFile = function () {
    return data;
  };

  return data;
}

var _removeFromPbxReferenceProxySection = _interopRequireDefault(require("./removeFromPbxReferenceProxySection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Removes file from static libraries
 *
 * Similar to `node-xcode` addStaticLibrary
 */
function removeFromStaticLibraries(project, path, opts) {
  const file = new (_pbxFile().default)(path);
  file.target = opts ? opts.target : undefined;
  project.removeFromPbxFileReferenceSection(file);
  project.removeFromPbxBuildFileSection(file);
  project.removeFromPbxFrameworksBuildPhase(file);
  project.removeFromLibrarySearchPaths(file);
  (0, _removeFromPbxReferenceProxySection.default)(project, file);
  return file;
}