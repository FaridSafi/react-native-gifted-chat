"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addFileToProject;

function _pbxFile() {
  const data = _interopRequireDefault(require("xcode/lib/pbxFile"));

  _pbxFile = function () {
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
 * Given xcodeproj and filePath, it creates new file
 * from path provided, adds it to the project
 * and returns newly created instance of a file
 */
function addFileToProject(project, filePath) {
  const file = new (_pbxFile().default)(filePath);
  file.uuid = project.generateUuid();
  file.fileRef = project.generateUuid();
  project.addToPbxFileReferenceSection(file);
  return file;
}