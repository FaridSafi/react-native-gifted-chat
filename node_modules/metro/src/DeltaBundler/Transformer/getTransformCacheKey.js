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

const crypto = require("crypto");

const getKeyFromFiles = require("../../lib/getKeyFromFiles");

const path = require("path");

const VERSION = require("../../../package.json").version;

/**
 * Returns a function that will return the transform cache key based on some
 * passed transform options.
 */
function getTransformCacheKey(opts) {
  const _opts$transformerConf = opts.transformerConfig,
    transformerPath = _opts$transformerConf.transformerPath,
    transformerConfig = _opts$transformerConf.transformerConfig; // eslint-disable-next-line lint/flow-no-fixme

  /* $FlowFixMe: dynamic requires prevent static typing :'(  */

  const Transformer = require(transformerPath);

  const transformerInstance = new Transformer(
    opts.projectRoot,
    transformerConfig
  );
  const transformerKey =
    typeof transformerInstance.getCacheKey !== "undefined"
      ? transformerInstance.getCacheKey()
      : "";
  const cacheKeyParts = [
    "metro-cache",
    VERSION,
    opts.cacheVersion,
    path.relative(path.join(__dirname, "../../../.."), opts.projectRoot),
    getKeyFromFiles([require.resolve(transformerPath)]),
    transformerKey
  ];
  return crypto
    .createHash("sha1")
    .update(cacheKeyParts.join("$"))
    .digest("hex");
}

module.exports = getTransformCacheKey;
