"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = registerNativeAndroidModule;

var _applyPatch = _interopRequireDefault(require("./patches/applyPatch"));

var _makeStringsPatch = _interopRequireDefault(require("./patches/makeStringsPatch"));

var _makeSettingsPatch = _interopRequireDefault(require("./patches/makeSettingsPatch"));

var _makeBuildPatch = _interopRequireDefault(require("./patches/makeBuildPatch"));

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
function registerNativeAndroidModule(name, androidConfig, params, projectConfig) {
  const buildPatch = (0, _makeBuildPatch.default)(name);
  (0, _applyPatch.default)(projectConfig.settingsGradlePath, (0, _makeSettingsPatch.default)(name, androidConfig, projectConfig));
  (0, _applyPatch.default)(projectConfig.buildGradlePath, buildPatch);
  (0, _applyPatch.default)(projectConfig.stringsPath, (0, _makeStringsPatch.default)(params, name));
  (0, _applyPatch.default)(projectConfig.mainFilePath, (0, _makePackagePatch.default)(androidConfig.packageInstance, params, name));
  (0, _applyPatch.default)(projectConfig.mainFilePath, (0, _makeImportPatch.default)(androidConfig.packageImportPath));
}