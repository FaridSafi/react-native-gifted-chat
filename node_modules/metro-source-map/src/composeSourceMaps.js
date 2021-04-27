/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */
"use strict"; // eslint-disable-next-line lint/sort-requires

const Consumer = require("./Consumer");

const _require = require("source-map"),
  SourceMapGenerator = _require.SourceMapGenerator;

// Originally based on https://github.com/jakobwesthoff/source-map-merger
function composeSourceMaps(maps) {
  // NOTE: require() here to break dependency cycle
  const SourceMetadataMapConsumer = require("metro-symbolicate/src/SourceMetadataMapConsumer");

  if (maps.length < 1) {
    throw new Error("composeSourceMaps: Expected at least one map");
  }

  const firstMap = maps[0];
  const consumers = maps
    .map(function(map) {
      return new Consumer(map);
    })
    .reverse();
  const generator = new SourceMapGenerator({
    file: consumers[0].file
  });
  consumers[0].eachMapping(mapping => {
    const original = findOriginalPosition(
      consumers,
      mapping.generatedLine,
      mapping.generatedColumn
    );
    generator.addMapping({
      generated: {
        line: mapping.generatedLine,
        column: mapping.generatedColumn
      },
      original:
        original.line != null
          ? {
              line: original.line,
              column: original.column
            }
          : null,
      source: original.source,
      name: original.name
    });
  });
  const composedMap = generator.toJSON();
  const metadataConsumer = new SourceMetadataMapConsumer(firstMap);
  composedMap.x_facebook_sources = metadataConsumer.toArray(
    composedMap.sources
  );
  return composedMap;
}

function findOriginalPosition(consumers, generatedLine, generatedColumn) {
  let currentLine = generatedLine;
  let currentColumn = generatedColumn;
  let original = {
    line: null,
    column: null,
    source: null,
    name: null
  };

  for (const consumer of consumers) {
    if (currentLine == null || currentColumn == null) {
      return {
        line: null,
        column: null,
        source: null,
        name: null
      };
    }

    original = consumer.originalPositionFor({
      line: currentLine,
      column: currentColumn
    });
    currentLine = original.line;
    currentColumn = original.column;

    if (currentLine == null) {
      return {
        line: null,
        column: null,
        source: null,
        name: null
      };
    }
  }

  return original;
}

module.exports = composeSourceMaps;
