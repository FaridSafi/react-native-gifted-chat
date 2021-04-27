"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addSharedLibraries;

var _createGroupWithMessage = _interopRequireDefault(require("./createGroupWithMessage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function addSharedLibraries(project, libraries) {
  if (!libraries.length) {
    return;
  } // Create a Frameworks group if necessary.


  (0, _createGroupWithMessage.default)(project, 'Frameworks');
  const target = project.getFirstTarget().uuid;

  for (const name of libraries) {
    project.addFramework(name, {
      target
    });
  }
}