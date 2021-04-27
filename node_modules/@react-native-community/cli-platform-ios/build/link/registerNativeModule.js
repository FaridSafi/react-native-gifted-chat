"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = registerNativeModuleIOS;

function _xcode() {
  const data = _interopRequireDefault(require("xcode"));

  _xcode = function () {
    return data;
  };

  return data;
}

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
    return data;
  };

  return data;
}

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

function _lodash() {
  const data = require("lodash");

  _lodash = function () {
    return data;
  };

  return data;
}

var _addToHeaderSearchPaths = _interopRequireDefault(require("./addToHeaderSearchPaths"));

var _getHeadersInFolder = _interopRequireDefault(require("./getHeadersInFolder"));

var _getHeaderSearchPath = _interopRequireDefault(require("./getHeaderSearchPath"));

var _getTargets = _interopRequireDefault(require("./getTargets"));

var _createGroupWithMessage = _interopRequireDefault(require("./createGroupWithMessage"));

var _addFileToProject = _interopRequireDefault(require("./addFileToProject"));

var _addProjectToLibraries = _interopRequireDefault(require("./addProjectToLibraries"));

var _addSharedLibraries = _interopRequireDefault(require("./addSharedLibraries"));

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
 * Register native module IOS adds given dependency to project by adding
 * its xcodeproj to project libraries as well as attaching static library
 * to the first target (the main one)
 *
 * If library is already linked, this action is a no-op.
 */
function registerNativeModuleIOS(dependencyConfig, projectConfig) {
  _cliTools().logger.debug(`Reading ${projectConfig.pbxprojPath}`);

  const project = _xcode().default.project(projectConfig.pbxprojPath).parseSync();

  const dependencyProject = _xcode().default.project(dependencyConfig.pbxprojPath).parseSync();

  const libraries = (0, _createGroupWithMessage.default)(project, projectConfig.libraryFolder);
  const file = (0, _addFileToProject.default)(project, _path().default.relative(projectConfig.sourceDir, dependencyConfig.projectPath));
  const targets = (0, _getTargets.default)(project);
  (0, _addProjectToLibraries.default)(libraries, file);
  (0, _getTargets.default)(dependencyProject).forEach(product => {
    let i;

    if (!product.isTVOS) {
      for (i = 0; i < targets.length; i++) {
        if (!targets[i].isTVOS) {
          _cliTools().logger.debug(`Adding ${product.name} to ${targets[i].target.name}`);

          project.addStaticLibrary(product.name, {
            target: targets[i].uuid
          });
        }
      }
    }

    if (product.isTVOS) {
      for (i = 0; i < targets.length; i++) {
        if (targets[i].isTVOS) {
          _cliTools().logger.debug(`Adding ${product.name} to ${targets[i].target.name}`);

          project.addStaticLibrary(product.name, {
            target: targets[i].uuid
          });
        }
      }
    }
  });
  (0, _addSharedLibraries.default)(project, dependencyConfig.sharedLibraries);
  const headers = (0, _getHeadersInFolder.default)(dependencyConfig.folder);

  if (!(0, _lodash().isEmpty)(headers)) {
    (0, _addToHeaderSearchPaths.default)(project, (0, _getHeaderSearchPath.default)(projectConfig.sourceDir, headers));
  }

  _cliTools().logger.debug(`Writing changes to ${projectConfig.pbxprojPath}`);

  _fs().default.writeFileSync(projectConfig.pbxprojPath, project.writeSync());
}