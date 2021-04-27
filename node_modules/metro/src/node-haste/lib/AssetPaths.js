/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 * @format
 */
"use strict";

const parsePlatformFilePath = require("./parsePlatformFilePath");

const path = require("path");

const ASSET_BASE_NAME_RE = /(.+?)(@([\d.]+)x)?$/;

function parseBaseName(baseName) {
  const match = baseName.match(ASSET_BASE_NAME_RE);

  if (!match) {
    throw new Error(`invalid asset name: \`${baseName}'`);
  }

  const rootName = match[1];

  if (match[3] != null) {
    const resolution = parseFloat(match[3]);

    if (!Number.isNaN(resolution)) {
      return {
        rootName,
        resolution
      };
    }
  }

  return {
    rootName,
    resolution: 1
  };
}
/**
 * Return `null` if the `filePath` doesn't have a valid extension, required
 * to describe the type of an asset.
 */

function tryParse(filePath, platforms) {
  const result = parsePlatformFilePath(filePath, platforms);
  const dirPath = result.dirPath,
    baseName = result.baseName,
    platform = result.platform,
    extension = result.extension;

  if (extension == null) {
    return null;
  }

  const _parseBaseName = parseBaseName(baseName),
    rootName = _parseBaseName.rootName,
    resolution = _parseBaseName.resolution;

  return {
    assetName: path.join(dirPath, `${rootName}.${extension}`),
    name: rootName,
    platform,
    resolution,
    type: extension
  };
}

function parse(filePath, platforms) {
  const result = tryParse(filePath, platforms);

  if (result == null) {
    throw new Error("invalid asset file path: `${filePath}");
  }

  return result;
}

module.exports = {
  parse,
  tryParse
};
