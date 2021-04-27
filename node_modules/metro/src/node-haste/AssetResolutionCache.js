/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */
"use strict";

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

const AssetPaths = require("./lib/AssetPaths");

const MapWithDefaults = require("./lib/MapWithDefaults");

/**
 * Lazily build an index of assets for the directories in which we're looking
 * for specific assets. For example if we're looking for `foo.png` in a `bar`
 * directory, we'll look at all the files there and identify all the assets
 * related to `foo.png`, for example `foo@2x.png` and `foo.ios.png`.
 */
class AssetResolutionCache {
  constructor(options) {
    _defineProperty(this, "_findAssets", dirPath => {
      const results = new Map();

      const fileNames = this._opts.getDirFiles(dirPath);

      for (let i = 0; i < fileNames.length; ++i) {
        const fileName = fileNames[i];
        const assetData = AssetPaths.tryParse(fileName, this._opts.platforms);

        if (assetData == null || !this._isValidAsset(assetData)) {
          continue;
        }

        getWithDefaultArray(results, assetData.assetName).push({
          fileName,
          platform: assetData.platform
        });

        if (assetData.platform) {
          const assetNameWithPlatform = `${assetData.name}.${
            assetData.platform
          }.${assetData.type}`;
          getWithDefaultArray(results, assetNameWithPlatform).push({
            fileName,
            platform: null
          });
        }
      }

      return results;
    });

    this._assetsByDirPath = new MapWithDefaults(this._findAssets);
    this._opts = options;
  }
  /**
   * The cache needs to be emptied if any file changes. This could be made more
   * selective if performance demands it: for example, we could clear
   * exclusively the directories in which files have changed. But that'd be
   * more error-prone.
   */

  clear() {
    this._assetsByDirPath.clear();
  }
  /**
   * Get the file paths of all the variants (resolutions, platforms, etc.) of a
   * particular asset name, only looking at a specific directory. If needed this
   * function could be changed to return pre-parsed information about the assets
   * such as the resolution.
   */

  resolve(dirPath, assetName, platform) {
    const results = this._assetsByDirPath.get(dirPath);

    const assets = results.get(assetName);

    if (assets == null) {
      return null;
    }

    return assets
      .filter(asset => asset.platform == null || asset.platform === platform)
      .map(asset => asset.fileName);
  }
  /**
   * Build an index of assets for a particular directory. Several file can
   * fulfill a single asset name, for example the different resolutions or
   * platforms: ex. `foo.png` could contain `foo@2x.png`, `foo.ios.js`, etc.
   */

  _isValidAsset(assetData) {
    return this._opts.assetExtensions.has(assetData.type);
  }
}
/**
 * Used instead of `MapWithDefaults` so that we don't create empty arrays
 * anymore once the index is built.
 */

function getWithDefaultArray(map, key) {
  let el = map.get(key);

  if (el != null) {
    return el;
  }

  el = [];
  map.set(key, el);
  return el;
}

module.exports = AssetResolutionCache;
