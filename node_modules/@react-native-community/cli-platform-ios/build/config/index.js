"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.projectConfig = projectConfig;
exports.dependencyConfig = void 0;

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

var _findProject = _interopRequireDefault(require("./findProject"));

var _findPodfilePath = _interopRequireDefault(require("./findPodfilePath"));

var _findPodspec = _interopRequireDefault(require("./findPodspec"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const memoizedFindProject = (0, _lodash().memoize)(_findProject.default);
/**
 * For libraries specified without an extension, add '.tbd' for those that
 * start with 'lib' and '.framework' to the rest.
 */

const mapSharedLibaries = libraries => libraries.map(name => {
  if (_path().default.extname(name)) {
    return name;
  }

  return name + (name.indexOf('lib') === 0 ? '.tbd' : '.framework');
});
/**
 * Returns project config by analyzing given folder and applying some user defaults
 * when constructing final object
 */


function projectConfig(folder, userConfig) {
  if (!userConfig) {
    return;
  }

  const project = userConfig.project || memoizedFindProject(folder);
  /**
   * No iOS config found here
   */

  if (!project) {
    return null;
  }

  const projectPath = _path().default.join(folder, project);

  const sourceDir = _path().default.dirname(projectPath);

  return {
    sourceDir,
    folder,
    pbxprojPath: _path().default.join(projectPath, 'project.pbxproj'),
    podfile: (0, _findPodfilePath.default)(projectPath),
    podspecPath: userConfig.podspecPath || // podspecs are usually placed in the root dir of the library or in the
    // iOS project path
    (0, _findPodspec.default)(folder) || (0, _findPodspec.default)(sourceDir),
    projectPath,
    projectName: _path().default.basename(projectPath),
    libraryFolder: userConfig.libraryFolder || 'Libraries',
    sharedLibraries: mapSharedLibaries(userConfig.sharedLibraries || []),
    plist: userConfig.plist || [],
    scriptPhases: userConfig.scriptPhases || []
  };
}

const dependencyConfig = projectConfig;
exports.dependencyConfig = dependencyConfig;