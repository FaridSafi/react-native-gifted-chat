/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function getGlobalCacheKey(files, values) {
  const presetVersion = require('../package').dependencies['babel-preset-fbjs'];

  const chunks = [
    process.env.NODE_ENV,
    process.env.BABEL_ENV,
    presetVersion,
    ...values,
    ...files.map(file => fs.readFileSync(file)),
  ];

  return chunks
    .reduce(
      (hash, chunk) => hash.update('\0', 'utf-8').update(chunk || ''),
      crypto.createHash('md5')
    )
    .digest('hex');
}

function getCacheKeyFunction(globalCacheKey) {
  return (src, file, configString, options) => {
    const {instrument, config} = options;
    const rootDir = config && config.rootDir;

    return crypto
      .createHash('md5')
      .update(globalCacheKey)
      .update('\0', 'utf8')
      .update(src)
      .update('\0', 'utf8')
      .update(rootDir ? path.relative(config.rootDir, file) : '')
      .update('\0', 'utf8')
      .update(instrument ? 'instrument' : '')
      .digest('hex');
  };
}

module.exports = (files = [], values = []) => {
  return getCacheKeyFunction(getGlobalCacheKey(files, values));
};
