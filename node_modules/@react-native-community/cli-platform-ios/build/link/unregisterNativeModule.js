"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = unregisterNativeModule;

function _xcode() {
  const data = _interopRequireDefault(require("xcode"));

  _xcode = function () {
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

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
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

var _getGroup = _interopRequireDefault(require("./getGroup"));

var _getTargets = _interopRequireDefault(require("./getTargets"));

var _getHeadersInFolder = _interopRequireDefault(require("./getHeadersInFolder"));

var _getHeaderSearchPath = _interopRequireDefault(require("./getHeaderSearchPath"));

var _removeProjectFromProject = _interopRequireDefault(require("./removeProjectFromProject"));

var _removeProjectFromLibraries = _interopRequireDefault(require("./removeProjectFromLibraries"));

var _removeFromStaticLibraries = _interopRequireDefault(require("./removeFromStaticLibraries"));

var _removeFromHeaderSearchPaths = _interopRequireDefault(require("./removeFromHeaderSearchPaths"));

var _removeSharedLibraries = _interopRequireDefault(require("./removeSharedLibraries"));

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
 * Unregister native module IOS
 *
 * If library is already unlinked, this action is a no-op.
 */
function unregisterNativeModule(dependencyConfig, projectConfig, iOSDependencies) {
  _cliTools().logger.debug(`Reading ${projectConfig.pbxprojPath}`);

  const project = _xcode().default.project(projectConfig.pbxprojPath).parseSync();

  const dependencyProject = _xcode().default.project(dependencyConfig.pbxprojPath).parseSync();

  const libraries = (0, _getGroup.default)(project, projectConfig.libraryFolder);
  const file = (0, _removeProjectFromProject.default)(project, _path().default.relative(projectConfig.sourceDir, dependencyConfig.projectPath));
  (0, _removeProjectFromLibraries.default)(libraries, file);
  (0, _getTargets.default)(dependencyProject).forEach(target => {
    _cliTools().logger.debug(`Removing ${target.name} from ${project.getFirstTarget().firstTarget.name}`);

    (0, _removeFromStaticLibraries.default)(project, target.name, {
      target: project.getFirstTarget().uuid
    });
  });
  const sharedLibraries = (0, _lodash().difference)(dependencyConfig.sharedLibraries, iOSDependencies.reduce((libs, dependency) => libs.concat(dependency.sharedLibraries), projectConfig.sharedLibraries));
  (0, _removeSharedLibraries.default)(project, sharedLibraries);
  const headers = (0, _getHeadersInFolder.default)(dependencyConfig.folder);

  if (!(0, _lodash().isEmpty)(headers)) {
    (0, _removeFromHeaderSearchPaths.default)(project, (0, _getHeaderSearchPath.default)(projectConfig.sourceDir, headers));
  }

  _cliTools().logger.debug(`Writing changes to ${projectConfig.pbxprojPath}`);

  _fs().default.writeFileSync(projectConfig.pbxprojPath, project.writeSync());
}