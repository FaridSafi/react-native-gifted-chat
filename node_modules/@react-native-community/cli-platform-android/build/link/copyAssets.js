"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = copyAssetsAndroid;

function _fsExtra() {
  const data = _interopRequireDefault(require("fs-extra"));

  _fsExtra = function () {
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
 * Copies each file from an array of assets provided to targetPath directory
 *
 * For now, the only types of files that are handled are:
 * - Fonts (otf, ttf) - copied to targetPath/fonts under original name
 */
function copyAssetsAndroid(files, project) {
  const assets = (0, _cliTools().groupFilesByType)(files);

  _cliTools().logger.debug(`Assets path: ${project.assetsPath}`);

  (assets.font || []).forEach(asset => {
    const fontsDir = _path().default.join(project.assetsPath, 'fonts');

    _cliTools().logger.debug(`Copying asset ${asset}`); // @todo: replace with fs.mkdirSync(path, {recursive}) + fs.copyFileSync
    // and get rid of fs-extra once we move to Node 10


    _fsExtra().default.copySync(asset, _path().default.join(fontsDir, _path().default.basename(asset)));
  });
}