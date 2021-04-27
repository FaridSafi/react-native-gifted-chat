/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

'use strict';

const AssetPaths = require('./node-haste/lib/AssetPaths');

const crypto = require('crypto');
const denodeify = require('denodeify');
const fs = require('fs');
const imageSize = require('image-size');
const path = require('path');

const {isAssetTypeAnImage} = require('./Bundler/util');

const readDir = denodeify(fs.readdir);
const readFile = denodeify(fs.readFile);

import type {AssetPath} from './node-haste/lib/AssetPaths';

export type AssetInfo = {|
  +files: Array<string>,
  +hash: string,
  +name: string,
  +scales: Array<number>,
  +type: string,
|};

export type AssetDataWithoutFiles = {
  +__packager_asset: boolean,
  +fileSystemLocation: string,
  +hash: string,
  +height: ?number,
  +httpServerLocation: string,
  +name: string,
  +scales: Array<number>,
  +type: string,
  +width: ?number,
};
export type AssetDataFiltered = {
  +__packager_asset: boolean,
  +hash: string,
  +height: ?number,
  +httpServerLocation: string,
  +name: string,
  +scales: Array<number>,
  +type: string,
  +width: ?number,
};

export type AssetData = AssetDataWithoutFiles & {
  +files: Array<string>,
};

export type AssetDataPlugin = (
  assetData: AssetData,
) => AssetData | Promise<AssetData>;

const hashFiles = denodeify(function hashFilesCb(files, hash, callback): void {
  if (!files.length) {
    callback(null);
    return;
  }

  const file = files.shift();

  fs.readFile(file, (err, data: Buffer) => {
    if (err) {
      callback(err);
      return;
    } else {
      hash.update(data);
      hashFilesCb(files, hash, callback);
    }
  });
});

function buildAssetMap(
  dir: string,
  files: $ReadOnlyArray<string>,
  platform: ?string,
): Map<string, {|files: Array<string>, scales: Array<number>|}> {
  const platforms = new Set(platform != null ? [platform] : []);
  const assets = files.map((file: string) =>
    AssetPaths.tryParse(file, platforms),
  );
  const map = new Map();
  assets.forEach(function(asset: ?AssetPath, i: number) {
    if (asset == null) {
      return;
    }
    const file = files[i];
    const assetKey = getAssetKey(asset.assetName, asset.platform);
    let record = map.get(assetKey);
    if (!record) {
      record = {
        scales: [],
        files: [],
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

function getAssetKey(assetName: string, platform: ?string): string {
  if (platform != null) {
    return `${assetName} : ${platform}`;
  } else {
    return assetName;
  }
}

async function getAbsoluteAssetRecord(
  assetPath: string,
  platform: ?string = null,
): Promise<{|files: Array<string>, scales: Array<number>|}> {
  const filename = path.basename(assetPath);
  const dir = path.dirname(assetPath);
  const files = await readDir(dir);

  const assetData = AssetPaths.parse(
    filename,
    new Set(platform != null ? [platform] : []),
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
      `Asset not found: ${assetPath} for platform: ${platform}`,
    );
  }

  return record;
}

async function getAbsoluteAssetInfo(
  assetPath: string,
  platform: ?string = null,
): Promise<AssetInfo> {
  const nameData = AssetPaths.parse(
    assetPath,
    new Set(platform != null ? [platform] : []),
  );
  const {name, type} = nameData;

  const {scales, files} = await getAbsoluteAssetRecord(assetPath, platform);
  const hasher = crypto.createHash('md5');

  if (files.length > 0) {
    await hashFiles(Array.from(files), hasher);
  }

  return {files, hash: hasher.digest('hex'), name, scales, type};
}

async function getAssetData(
  assetPath: string,
  localPath: string,
  assetDataPlugins: $ReadOnlyArray<string>,
  platform: ?string = null,
  publicPath: string,
): Promise<AssetData> {
  // If the path of the asset is outside of the projectRoot, we don't want to
  // use `path.join` since this will generate an incorrect URL path. In that
  // case we just concatenate the publicPath with the relative path.
  let assetUrlPath = localPath.startsWith('..')
    ? publicPath.replace(/\/$/, '') + '/' + path.dirname(localPath)
    : path.join(publicPath, path.dirname(localPath));

  // On Windows, change backslashes to slashes to get proper URL path from file path.
  if (path.sep === '\\') {
    assetUrlPath = assetUrlPath.replace(/\\/g, '/');
  }

  const isImage = isAssetTypeAnImage(path.extname(assetPath).slice(1));
  const assetInfo = await getAbsoluteAssetInfo(assetPath, platform);

  const isImageInput = assetInfo.files[0].includes('.zip/')
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
    type: assetInfo.type,
  };
  return await applyAssetDataPlugins(assetDataPlugins, assetData);
}

async function applyAssetDataPlugins(
  assetDataPlugins: $ReadOnlyArray<string>,
  assetData: AssetData,
): Promise<AssetData> {
  if (!assetDataPlugins.length) {
    return assetData;
  }

  const [currentAssetPlugin, ...remainingAssetPlugins] = assetDataPlugins;
  // $FlowFixMe: impossible to type a dynamic require.
  const assetPluginFunction: AssetDataPlugin = require(currentAssetPlugin);
  const resultAssetData = await assetPluginFunction(assetData);
  return await applyAssetDataPlugins(remainingAssetPlugins, resultAssetData);
}

/**
 * Returns all the associated files (for different resolutions) of an asset.
 **/
async function getAssetFiles(
  assetPath: string,
  platform: ?string = null,
): Promise<Array<string>> {
  const assetData = await getAbsoluteAssetRecord(assetPath, platform);

  return assetData.files;
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
async function getAsset(
  relativePath: string,
  projectRoot: string,
  watchFolders: $ReadOnlyArray<string>,
  platform: ?string = null,
  assetExts: $ReadOnlyArray<string>,
): Promise<Buffer> {
  const assetData = AssetPaths.parse(
    relativePath,
    new Set(platform != null ? [platform] : []),
  );

  const absolutePath = path.resolve(projectRoot, relativePath);

  if (!assetExts.includes(assetData.type)) {
    throw new Error(
      `'${relativePath}' cannot be loaded as its extension is not registered in assetExts`,
    );
  }

  if (!pathBelongsToRoots(absolutePath, [projectRoot, ...watchFolders])) {
    throw new Error(
      `'${relativePath}' could not be found, because it cannot be found in the project root or any watch folder`,
    );
  }

  const record = await getAbsoluteAssetRecord(absolutePath, platform);

  for (let i = 0; i < record.scales.length; i++) {
    if (record.scales[i] >= assetData.resolution) {
      return readFile(record.files[i]);
    }
  }

  return readFile(record.files[record.files.length - 1]);
}

function pathBelongsToRoots(
  pathToCheck: string,
  roots: $ReadOnlyArray<string>,
): boolean {
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
  getAssetFiles,
};
