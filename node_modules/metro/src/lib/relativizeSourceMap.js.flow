/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

const path = require('path');

import type {MixedSourceMap} from 'metro-source-map';

function relativizeSourceMapInline(
  sourceMap: MixedSourceMap,
  sourcesRoot: string,
): void {
  // eslint-disable-next-line lint/strictly-null
  if (sourceMap.mappings === undefined) {
    for (let i = 0; i < sourceMap.sections.length; i++) {
      relativizeSourceMapInline(sourceMap.sections[i].map, sourcesRoot);
    }
  } else {
    for (let i = 0; i < sourceMap.sources.length; i++) {
      sourceMap.sources[i] = path.relative(sourcesRoot, sourceMap.sources[i]);
    }
  }
}

module.exports = relativizeSourceMapInline;
