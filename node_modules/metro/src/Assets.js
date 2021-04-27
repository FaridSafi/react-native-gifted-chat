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

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)
      arr2[i] = arr[i];
    return arr2;
  }
}

function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === "[object Arguments]"
  )
    return Array.from(iter);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function() {
    var self = this,
      args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

const AssetPaths = require("./node-haste/lib/AssetPaths");

const crypto = require("crypto");

const denodeify = require("denodeify");

const fs = require("fs");

const imageSize = require("image-size");

const path = require("path");

const _require = require("./Bundler/util"),
  isAssetTypeAnImage = _require.isAssetTypeAnImage;

const readDir = denodeify(fs.readdir);
const readFile = denodeify(fs.readFile);
const hashFiles = denodeify(function hashFilesCb(files, hash, callback) {
  if (!files.length) {
    callback(null);
    return;
  }

  const file = files.shift();
  fs.readFile(file, (err, data) => {
    if (err) {
      callback(err);
      return;
    } else {
      hash.update(data);
      hashFilesCb(files, hash, callback);
    }
  });
});

function buildAssetMap(dir, files, platform) {
  const platforms = new Set(platform != null ? [platform] : []);
  const assets = files.map(file => AssetPaths.tryParse(file, platforms));
  const map = new Map();
  assets.forEach(function(asset, i) {
    if (asset == null) {
      return;
    }

    const file = files[i];
    const assetKey = getAssetKey(asset.assetName, asset.platform);
    let record = map.get(assetKey);

    if (!record) {
      record = {
        scales: [],
        files: []
      };
      map.set(assetKey, record);
    }

    let insertIndex;
    const length = record.scales.length;

    for (insertIndex = 0; insertIndex < length; insertIndex++) {
      if (asset.resolution < record.scales[insertIndex]) {
        break;
      }
    }

    record.scales.splice(insertIndex, 0, asset.resolution);
    record.files.splice(insertIndex, 0, path.join(dir, file));
  });
  return map;
}

function getAssetKey(assetName, platform) {
  if (platform != null) {
    return `${assetName} : ${platform}`;
  } else {
    return assetName;
  }
}

function getAbsoluteAssetRecord(_x) {
  return _getAbsoluteAssetRecord.apply(this, arguments);
}

function _getAbsoluteAssetRecord() {
  _getAbsoluteAssetRecord = _asyncToGenerator(function*(assetPath) {
    let platform =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    const filename = path.basename(assetPath);
    const dir = path.dirname(assetPath);
    const files = yield readDir(dir);
    const assetData = AssetPaths.parse(
      filename,
      new Set(platform != null ? [platform] : [])
    );
    const map = buildAssetMap(dir, files, platform);
    let record;

    if (platform != null) {
      record =
        map.get(getAssetKey(assetData.assetName, platform)) ||
        map.get(assetData.assetName);
    } else {
      record = map.get(assetData.assetName);
    }

    if (!record) {
      throw new Error(
        /* $FlowFixMe: platform can be null */
        `Asset not found: ${assetPath} for platform: ${platform}`
      );
    }

    return record;
  });
  return _getAbsoluteAssetRecord.apply(this, arguments);
}

function getAbsoluteAssetInfo(_x2) {
  return _getAbsoluteAssetInfo.apply(this, arguments);
}

function _getAbsoluteAssetInfo() {
  _getAbsoluteAssetInfo = _asyncToGenerator(function*(assetPath) {
    let platform =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    const nameData = AssetPaths.parse(
      assetPath,
      new Set(platform != null ? [platform] : [])
    );
    const name = nameData.name,
      type = nameData.type;

    const _ref = yield getAbsoluteAssetRecord(assetPath, platform),
      scales = _ref.scales,
      files = _ref.files;

    const hasher = crypto.createHash("md5");

    if (files.length > 0) {
      yield hashFiles(Array.from(files), hasher);
    }

    return {
      files,
      hash: hasher.digest("hex"),
      name,
      scales,
      type
    };
  });
  return _getAbsoluteAssetInfo.apply(this, arguments);
}

function getAssetData(_x3, _x4, _x5) {
  return _getAssetData.apply(this, arguments);
}

function _getAssetData() {
  _getAssetData = _asyncToGenerator(function*(
    assetPath,
    localPath,
    assetDataPlugins
  ) {
    let platform =
      arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    let publicPath = arguments.length > 4 ? arguments[4] : undefined;
    // If the path of the asset is outside of the projectRoot, we don't want to
    // use `path.join` since this will generate an incorrect URL path. In that
    // case we just concatenate the publicPath with the relative path.
    let assetUrlPath = localPath.startsWith("..")
      ? publicPath.replace(/\/$/, "") + "/" + path.dirname(localPath)
      : path.join(publicPath, path.dirname(localPath)); // On Windows, change backslashes to slashes to get proper URL path from file path.

    if (path.sep === "\\") {
      assetUrlPath = assetUrlPath.replace(/\\/g, "/");
    }

    const isImage = isAssetTypeAnImage(path.extname(assetPath).slice(1));
    const assetInfo = yield getAbsoluteAssetInfo(assetPath, platform);
    const isImageInput = assetInfo.files[0].includes(".zip/")
      ? fs.readFileSync(assetInfo.files[0])
      : assetInfo.files[0];
    const dimensions = isImage ? imageSize(isImageInput) : null;
    const scale = assetInfo.scales[0];
    const assetData = {
      __packager_asset: true,
      fileSystemLocation: path.dirname(assetPath),
      httpServerLocation: assetUrlPath,
      width: dimensions ? dimensions.width / scale : undefined,
      height: dimensions ? dimensions.height / scale : undefined,
      scales: assetInfo.scales,
      files: assetInfo.files,
      hash: assetInfo.hash,
      name: assetInfo.name,
      type: assetInfo.type
    };
    return yield applyAssetDataPlugins(assetDataPlugins, assetData);
  });
  return _getAssetData.apply(this, arguments);
}

function applyAssetDataPlugins(_x6, _x7) {
  return _applyAssetDataPlugins.apply(this, arguments);
}
/**
 * Returns all the associated files (for different resolutions) of an asset.
 **/

function _applyAssetDataPlugins() {
  _applyAssetDataPlugins = _asyncToGenerator(function*(
    assetDataPlugins,
    assetData
  ) {
    if (!assetDataPlugins.length) {
      return assetData;
    }

    const _assetDataPlugins = _toArray(assetDataPlugins),
      currentAssetPlugin = _assetDataPlugins[0],
      remainingAssetPlugins = _assetDataPlugins.slice(1); // $FlowFixMe: impossible to type a dynamic require.

    const assetPluginFunction = require(currentAssetPlugin);

    const resultAssetData = yield assetPluginFunction(assetData);
    return yield applyAssetDataPlugins(remainingAssetPlugins, resultAssetData);
  });
  return _applyAssetDataPlugins.apply(this, arguments);
}

function getAssetFiles(_x8) {
  return _getAssetFiles.apply(this, arguments);
}
/**
 * Return a buffer with the actual image given a request for an image by path.
 * The relativePath can contain a resolution postfix, in this case we need to
 * find that image (or the closest one to it's resolution) in one of the
 * project roots:
 *
 * 1. We first parse the directory of the asset
 * 2. We then build a map of all assets and their scales in this directory
 * 3. Then try to pick platform-specific asset records
 * 4. Then pick the closest resolution (rounding up) to the requested one
 */

function _getAssetFiles() {
  _getAssetFiles = _asyncToGenerator(function*(assetPath) {
    let platform =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    const assetData = yield getAbsoluteAssetRecord(assetPath, platform);
    return assetData.files;
  });
  return _getAssetFiles.apply(this, arguments);
}

function getAsset(_x9, _x10, _x11) {
  return _getAsset.apply(this, arguments);
}

function _getAsset() {
  _getAsset = _asyncToGenerator(function*(
    relativePath,
    projectRoot,
    watchFolders
  ) {
    let platform =
      arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    let assetExts = arguments.length > 4 ? arguments[4] : undefined;
    const assetData = AssetPaths.parse(
      relativePath,
      new Set(platform != null ? [platform] : [])
    );
    const absolutePath = path.resolve(projectRoot, relativePath);

    if (!assetExts.includes(assetData.type)) {
      throw new Error(
        `'${relativePath}' cannot be loaded as its extension is not registered in assetExts`
      );
    }

    if (
      !pathBelongsToRoots(
        absolutePath,
        [projectRoot].concat(_toConsumableArray(watchFolders))
      )
    ) {
      throw new Error(
        `'${relativePath}' could not be found, because it cannot be found in the project root or any watch folder`
      );
    }

    const record = yield getAbsoluteAssetRecord(absolutePath, platform);

    for (let i = 0; i < record.scales.length; i++) {
      if (record.scales[i] >= assetData.resolution) {
        return readFile(record.files[i]);
      }
    }

    return readFile(record.files[record.files.length - 1]);
  });
  return _getAsset.apply(this, arguments);
}

function pathBelongsToRoots(pathToCheck, roots) {
  for (const rootFolder of roots) {
    if (pathToCheck.startsWith(path.resolve(rootFolder))) {
      return true;
    }
  }

  return false;
}

module.exports = {
  getAsset,
  getAssetData,
  getAssetFiles
};
