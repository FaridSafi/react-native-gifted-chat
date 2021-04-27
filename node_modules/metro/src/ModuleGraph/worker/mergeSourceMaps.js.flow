/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict-local
 */

'use strict';

// eslint-disable-next-line lint/flow-no-fixme
// $FlowFixMe: too hard to type, and they only have a .ts file.
const sourceMap = require('source-map');

import type {MixedSourceMap, BasicSourceMap} from 'metro-source-map';

function mergeSourceMaps(
  file: string,
  originalMap: MixedSourceMap,
  secondMap: MixedSourceMap,
): BasicSourceMap {
  const merged = new sourceMap.SourceMapGenerator();
  const inputMap = new sourceMap.SourceMapConsumer(originalMap);

  new sourceMap.SourceMapConsumer(secondMap).eachMapping(mapping => {
    const original = inputMap.originalPositionFor({
      line: mapping.originalLine,
      column: mapping.originalColumn,
    });
    if (original.line == null) {
      return;
    }

    merged.addMapping({
      generated: {line: mapping.generatedLine, column: mapping.generatedColumn},
      original: {line: original.line, column: original.column || 0},
      source: file,
      name: original.name || mapping.name,
    });
  });

  return {
    ...merged.toJSON(),
    sources: inputMap.sources,
  };
}

module.exports = mergeSourceMaps;
