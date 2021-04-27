"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

var _assetPathUtils = _interopRequireDefault(require("./assetPathUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function getAssetDestPathAndroid(asset, scale) {
  const androidFolder = _assetPathUtils.default.getAndroidResourceFolderName(asset, scale);

  const fileName = _assetPathUtils.default.getAndroidResourceIdentifier(asset);

  return _path().default.join(androidFolder, `${fileName}.${asset.type}`);
}

var _default = getAssetDestPathAndroid;
exports.default = _default;