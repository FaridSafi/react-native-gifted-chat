"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = removeProjectFromProject;

function _pbxFile() {
  const data = _interopRequireDefault(require("xcode/lib/pbxFile"));

  _pbxFile = function () {
    return data;
  };

  return data;
}

var _removeFromPbxItemContainerProxySection = _interopRequireDefault(require("./removeFromPbxItemContainerProxySection"));

var _removeFromProjectReferences = _interopRequireDefault(require("./removeFromProjectReferences"));

var _removeProductGroup = _interopRequireDefault(require("./removeProductGroup"));

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
 * from path provided and removes it. That operation is required since
 * underlying method requires PbxFile instance to be passed (it does not
 * have to have uuid or fileRef defined since it will do equality check
 * by path)
 *
 * Returns removed file (that one will have UUID)
 */
function removeProjectFromProject(project, filePath) {
  const file = project.removeFromPbxFileReferenceSection(new (_pbxFile().default)(filePath));
  const projectRef = (0, _removeFromProjectReferences.default)(project, file);

  if (projectRef) {
    (0, _removeProductGroup.default)(project, projectRef.ProductGroup);
  }

  (0, _removeFromPbxItemContainerProxySection.default)(project, file);
  return file;
}