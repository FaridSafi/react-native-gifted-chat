"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeBuildPatch;

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
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
const depConfigs = ['compile', 'api', 'implementation'];

function makeBuildPatch(name, buildGradlePath) {
  const normalizedProjectName = (0, _normalizeProjectName.default)(name);
  const installPattern = new RegExp(buildDepRegExp(normalizedProjectName, ...depConfigs));
  return {
    installPattern,
    pattern: /[^ \t]dependencies {(\r\n|\n)/,
    patch: makePatchString(normalizedProjectName, buildGradlePath)
  };
}

function makePatchString(normalizedProjectName, buildGradlePath) {
  const defaultPatchString = `    implementation project(':${normalizedProjectName}')\n`;

  if (!buildGradlePath) {
    return defaultPatchString;
  }

  const buildGradle = _fs().default.readFileSync(buildGradlePath, 'utf8');

  for (const config of depConfigs) {
    const depPattern = new RegExp(buildDepRegExp(normalizedProjectName, config));

    if (depPattern.test(buildGradle)) {
      return `    ${config} project(':${normalizedProjectName}')\n`;
    }
  }

  return defaultPatchString;
}

function buildDepRegExp(normalizedProjectName, ...configs) {
  const orConfigs = configs.join('|');
  return `(${orConfigs})\\w*\\s*\\(*project\\s*\\(['"]:${normalizedProjectName}['"]\\)`;
}