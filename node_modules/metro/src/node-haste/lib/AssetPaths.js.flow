/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 * @format
 */

'use strict';

const parsePlatformFilePath = require('./parsePlatformFilePath');
const path = require('path');

export type AssetPath = {|
  assetName: string,
  name: string,
  platform: ?string,
  resolution: number,
  type: string,
|};

const ASSET_BASE_NAME_RE = /(.+?)(@([\d.]+)x)?$/;

function parseBaseName(
  baseName: string,
): {resolution: number, rootName: string} {
  const match = baseName.match(ASSET_BASE_NAME_RE);
  if (!match) {
    throw new Error(`invalid asset name: \`${baseName}'`);
  }
  const rootName = match[1];
  if (match[3] != null) {
    const resolution = parseFloat(match[3]);
    if (!Number.isNaN(resolution)) {
      return {rootName, resolution};
    }
  }
  return {rootName, resolution: 1};
}

/**
 * Return `null` if the `filePath` doesn't have a valid extension, required
 * to describe the type of an asset.
 */
function tryParse(filePath: string, platforms: Set<string>): ?AssetPath {
  const result = parsePlatformFilePath(filePath, platforms);
  const {dirPath, baseName, platform, extension} = result;
  if (extension == null) {
    return null;
  }
  const {rootName, resolution} = parseBaseName(baseName);
  return {
    assetName: path.join(dirPath, `${rootName}.${extension}`),
    name: rootName,
    platform,
    resolution,
    type: extension,
  };
}

function parse(filePath: string, platforms: Set<string>): AssetPath {
  const result = tryParse(filePath, platforms);
  if (result == null) {
    throw new Error('invalid asset file path: `${filePath}');
  }
  return result;
}

module.exports = {parse, tryParse};
