"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeSettingsPatch;

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

function _slash() {
  const data = _interopRequireDefault(require("slash"));

  _slash = function () {
    return data;
  };

  return data;
}

var _normalizeProjectName = _interopRequireDefault(require("./normalizeProjectName"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function makeSettingsPatch(name, androidConfig, projectConfig) {
  // Gradle expects paths to be posix even on Windows
  const projectDir = (0, _slash().default)(_path().default.relative(_path().default.dirname(projectConfig.settingsGradlePath), androidConfig.sourceDir));
  const normalizedProjectName = (0, _normalizeProjectName.default)(name);
  return {
    pattern: '\n',
    patch: `include ':${normalizedProjectName}'\n` + `project(':${normalizedProjectName}').projectDir = ` + `new File(rootProject.projectDir, '${projectDir}')\n`
  };
}