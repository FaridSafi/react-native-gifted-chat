"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = unregisterNativeAndroidModule;

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

var _revokePatch = _interopRequireDefault(require("./patches/revokePatch"));

var _makeSettingsPatch = _interopRequireDefault(require("./patches/makeSettingsPatch"));

var _makeBuildPatch = _interopRequireDefault(require("./patches/makeBuildPatch"));

var _makeStringsPatch = _interopRequireDefault(require("./patches/makeStringsPatch"));

var _makeImportPatch = _interopRequireDefault(require("./patches/makeImportPatch"));

var _makePackagePatch = _interopRequireDefault(require("./patches/makePackagePatch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function unregisterNativeAndroidModule(name, androidConfig, projectConfig) {
  const buildPatch = (0, _makeBuildPatch.default)(name, projectConfig.buildGradlePath);

  const strings = _fs().default.readFileSync(projectConfig.stringsPath, 'utf8');

  const params = {};
  strings.replace(/moduleConfig="true" name="(\w+)">(.*)</g, // @ts-ignore
  (_, param, value) => {
    // @ts-ignore
    params[param.slice((0, _lodash().camelCase)(name).length + 1)] = value;
  });
  (0, _revokePatch.default)(projectConfig.settingsGradlePath, (0, _makeSettingsPatch.default)(name, androidConfig, projectConfig));
  (0, _revokePatch.default)(projectConfig.buildGradlePath, buildPatch);
  (0, _revokePatch.default)(projectConfig.stringsPath, (0, _makeStringsPatch.default)(params, name));
  (0, _revokePatch.default)(projectConfig.mainFilePath, (0, _makePackagePatch.default)(androidConfig.packageInstance, params, name));
  (0, _revokePatch.default)(projectConfig.mainFilePath, (0, _makeImportPatch.default)(androidConfig.packageImportPath));
}