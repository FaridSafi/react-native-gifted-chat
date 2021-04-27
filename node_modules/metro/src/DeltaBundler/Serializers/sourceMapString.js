/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */
"use strict";

const _require = require("./sourceMapGenerator"),
  sourceMapGenerator = _require.sourceMapGenerator;

function sourceMapString(modules, options) {
  return sourceMapGenerator(modules, options).toString(undefined, {
    excludeSource: options.excludeSource
  });
}

module.exports = sourceMapString;
