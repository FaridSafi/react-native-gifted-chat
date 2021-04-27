"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.projectConfig = projectConfig;
exports.dependencyConfig = dependencyConfig;

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

var _findAndroidAppFolder = _interopRequireDefault(require("./findAndroidAppFolder"));

var _findManifest = _interopRequireDefault(require("./findManifest"));

var _findPackageClassName = _interopRequireDefault(require("./findPackageClassName"));

var _readManifest = _interopRequireDefault(require("./readManifest"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const getPackageName = manifest => manifest.attr.package;
/**
 * Gets android project config by analyzing given folder and taking some
 * defaults specified by user into consideration
 */


function projectConfig(folder, userConfig = {}) {
  const src = userConfig.sourceDir || (0, _findAndroidAppFolder.default)(folder);

  if (!src) {
    return null;
  }

  const sourceDir = _path().default.join(folder, src);

  const isFlat = sourceDir.indexOf('app') === -1;
  const manifestPath = userConfig.manifestPath ? _path().default.join(sourceDir, userConfig.manifestPath) : (0, _findManifest.default)(sourceDir);

  if (!manifestPath) {
    return null;
  }

  const manifest = (0, _readManifest.default)(manifestPath);
  const packageName = userConfig.packageName || getPackageName(manifest);

  if (!packageName) {
    throw new Error(`Package name not found in ${manifestPath}`);
  }

  const packageFolder = userConfig.packageFolder || packageName.replace(/\./g, _path().default.sep);

  const mainFilePath = _path().default.join(sourceDir, userConfig.mainFilePath || `src/main/java/${packageFolder}/MainApplication.java`);

  const stringsPath = _path().default.join(sourceDir, userConfig.stringsPath || 'src/main/res/values/strings.xml');

  const settingsGradlePath = _path().default.join(folder, 'android', userConfig.settingsGradlePath || 'settings.gradle');

  const assetsPath = _path().default.join(sourceDir, userConfig.assetsPath || 'src/main/assets');

  const buildGradlePath = _path().default.join(sourceDir, userConfig.buildGradlePath || 'build.gradle');

  return {
    sourceDir,
    isFlat,
    folder,
    stringsPath,
    manifestPath,
    buildGradlePath,
    settingsGradlePath,
    assetsPath,
    mainFilePath,
    packageName
  };
}
/**
 * Same as projectConfigAndroid except it returns
 * different config that applies to packages only
 */


function dependencyConfig(folder, userConfig = {}) {
  const src = userConfig.sourceDir || (0, _findAndroidAppFolder.default)(folder);

  if (!src) {
    return null;
  }

  const sourceDir = _path().default.join(folder, src);

  const manifestPath = userConfig.manifestPath ? _path().default.join(sourceDir, userConfig.manifestPath) : (0, _findManifest.default)(sourceDir);

  if (!manifestPath) {
    return null;
  }

  const manifest = (0, _readManifest.default)(manifestPath);
  const packageName = userConfig.packageName || getPackageName(manifest);
  const packageClassName = (0, _findPackageClassName.default)(sourceDir);
  /**
   * This module has no package to export
   */

  if (!packageClassName) {
    return null;
  }

  const packageImportPath = userConfig.packageImportPath || `import ${packageName}.${packageClassName};`;
  const packageInstance = userConfig.packageInstance || `new ${packageClassName}()`;
  return {
    sourceDir,
    folder,
    packageImportPath,
    packageInstance
  };
}