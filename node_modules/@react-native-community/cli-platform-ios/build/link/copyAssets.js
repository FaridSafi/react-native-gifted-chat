"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = linkAssetsIOS;

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

var _createGroupWithMessage = _interopRequireDefault(require("./createGroupWithMessage"));

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
 * This function works in a similar manner to its Android version,
 * except it does not copy fonts but creates Xcode Group references
 */
function linkAssetsIOS(files, projectConfig) {
  const project = _xcode().default.project(projectConfig.pbxprojPath).parseSync();

  const assets = (0, _cliTools().groupFilesByType)(files);
  const plist = (0, _getPlist.default)(project, projectConfig.sourceDir);
  (0, _createGroupWithMessage.default)(project, 'Resources');

  function addResourceFile(f) {
    return (f || []).map(asset => {
      _cliTools().logger.debug(`Linking asset ${asset}`);

      return project.addResourceFile(_path().default.relative(projectConfig.sourceDir, asset), {
        target: project.getFirstTarget().uuid
      });
    }).filter(Boolean) // xcode returns false if file is already there
    .map(file => file.basename);
  }

  addResourceFile(assets.image);
  const fonts = addResourceFile(assets.font); // @ts-ignore Type mismatch with the lib

  const existingFonts = plist.UIAppFonts || [];
  const allFonts = [...existingFonts, ...fonts]; // @ts-ignore Type mismatch with the lib

  plist.UIAppFonts = Array.from(new Set(allFonts)); // use Set to dedupe w/existing

  _fs().default.writeFileSync(projectConfig.pbxprojPath, project.writeSync());

  (0, _writePlist.default)(project, projectConfig.sourceDir, plist);
}