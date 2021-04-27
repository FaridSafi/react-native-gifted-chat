"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = unlinkAssetsIOS;

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

function _xcode() {
  const data = _interopRequireDefault(require("xcode"));

  _xcode = function () {
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

var _getPlist = _interopRequireDefault(require("./getPlist"));

var _writePlist = _interopRequireDefault(require("./writePlist"));

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
 * Unlinks assets from iOS project. Removes references for fonts from `Info.plist`
 * fonts provided by application and from `Resources` group
 */
function unlinkAssetsIOS(files, projectConfig) {
  const project = _xcode().default.project(projectConfig.pbxprojPath).parseSync();

  const assets = (0, _cliTools().groupFilesByType)(files);
  const plist = (0, _getPlist.default)(project, projectConfig.sourceDir);

  if (!plist) {
    _cliTools().logger.error('Could not locate "Info.plist" file. Check if your project has "INFOPLIST_FILE" set properly');

    return;
  }

  if (!project.pbxGroupByName('Resources')) {
    _cliTools().logger.error('Group "Resources" does not exist in your Xcode project. There is nothing to unlink.');

    return;
  }

  const removeResourceFiles = (f = []) => (f || []).map(asset => {
    _cliTools().logger.debug(`Unlinking asset ${asset}`);

    return project.removeResourceFile(_path().default.relative(projectConfig.sourceDir, asset), {
      target: project.getFirstTarget().uuid
    });
  }).map(file => file.basename);

  removeResourceFiles(assets.image);
  const fonts = removeResourceFiles(assets.font); // @ts-ignore Type mismatch

  plist.UIAppFonts = (0, _lodash().difference)(plist.UIAppFonts || [], fonts);

  _fs().default.writeFileSync(projectConfig.pbxprojPath, project.writeSync());

  (0, _writePlist.default)(project, projectConfig.sourceDir, plist);
}