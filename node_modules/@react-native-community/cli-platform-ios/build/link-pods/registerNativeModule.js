"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = registerNativeModulePods;

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

var _readPodfile = _interopRequireDefault(require("./readPodfile"));

var _findPodTargetLine = _interopRequireDefault(require("./findPodTargetLine"));

var _findLineToAddPod = _interopRequireDefault(require("./findLineToAddPod"));

var _findMarkedLinesInPodfile = _interopRequireWildcard(require("./findMarkedLinesInPodfile"));

var _addPodEntry = _interopRequireDefault(require("./addPodEntry"));

var _savePodFile = _interopRequireDefault(require("./savePodFile"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function registerNativeModulePods(name, podspecPath, iOSProject) {
  const podLines = (0, _readPodfile.default)(iOSProject.podfile);
  const linesToAddEntry = getLinesToAddEntry(podLines, iOSProject);
  (0, _addPodEntry.default)(podLines, linesToAddEntry, podspecPath, name);
  (0, _savePodFile.default)(iOSProject.podfile, podLines);
}

function getLinesToAddEntry(podLines, {
  projectName
}) {
  const linesToAddPodWithMarker = (0, _findMarkedLinesInPodfile.default)(podLines);

  if (linesToAddPodWithMarker.length > 0) {
    return linesToAddPodWithMarker;
  }

  const firstTargetLined = (0, _findPodTargetLine.default)(podLines, projectName);

  if (firstTargetLined === null) {
    throw new (_cliTools().CLIError)(`
      We couldn't find a target to add a CocoaPods dependency.

      Make sure that you have a "${_chalk().default.dim(`target '${projectName.replace('.xcodeproj', '')}' do`)}" line in your Podfile.

      Alternatively, include "${_chalk().default.dim(_findMarkedLinesInPodfile.MARKER_TEXT)}" in a Podfile where we should add
      linked dependencies.
    `);
  }

  return (0, _findLineToAddPod.default)(podLines, firstTargetLined);
}