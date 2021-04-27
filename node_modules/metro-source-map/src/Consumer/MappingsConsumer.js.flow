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

const AbstractConsumer = require('./AbstractConsumer');

const invariant = require('invariant');
const normalizeSourcePath = require('./normalizeSourcePath');

const {
  FIRST_COLUMN,
  FIRST_LINE,
  GREATEST_LOWER_BOUND,
  EMPTY_POSITION,
  lookupBiasToString,
} = require('./constants');
const {greatestLowerBound} = require('./search');
const {add, get0, add0, sub, inc} = require('ob1');
const {decode: decodeVlq} = require('vlq');

import type {BasicSourceMap} from '../source-map';
import type {
  SourcePosition,
  GeneratedPositionLookup,
  Mapping,
  IConsumer,
} from './types.flow';

/**
 * A source map consumer that supports "basic" source maps (that have a
 * `mappings` field and no sections).
 */
class MappingsConsumer extends AbstractConsumer implements IConsumer {
  _sourceMap: BasicSourceMap;
  _decodedMappings: ?$ReadOnlyArray<Mapping>;
  _normalizedSources: ?$ReadOnlyArray<string>;

  constructor(sourceMap: BasicSourceMap) {
    super(sourceMap);
    this._sourceMap = sourceMap;
    this._decodedMappings = null;
    this._normalizedSources = null;
  }

  originalPositionFor(
    generatedPosition: GeneratedPositionLookup,
  ): SourcePosition {
    const {line, column} = generatedPosition;
    if (line == null || column == null) {
      return {...EMPTY_POSITION};
    }
    if (generatedPosition.bias != null) {
      invariant(
        generatedPosition.bias === GREATEST_LOWER_BOUND,
        `Unimplemented lookup bias: ${lookupBiasToString(
          generatedPosition.bias,
        )}`,
      );
    }
    const mappings = this._decodeAndCacheMappings();
    const index = greatestLowerBound(
      mappings,
      {line, column},
      (position, mapping) => {
        if (position.line === mapping.generatedLine) {
          return get0(sub(position.column, mapping.generatedColumn));
        }
        return get0(sub(position.line, mapping.generatedLine));
      },
    );
    if (
      index != null &&
      mappings[index].generatedLine === generatedPosition.line
    ) {
      const mapping = mappings[index];
      return {
        source: mapping.source,
        name: mapping.name,
        line: mapping.originalLine,
        column: mapping.originalColumn,
      };
    }
    return {...EMPTY_POSITION};
  }

  *_decodeMappings() {
    let generatedLine = FIRST_LINE;
    let generatedColumn = FIRST_COLUMN;
    let originalLine = FIRST_LINE;
    let originalColumn = FIRST_COLUMN;
    let nameIndex = add0(0);
    let sourceIndex = add0(0);

    const normalizedSources = this._normalizeAndCacheSources();

    const {mappings: mappingsRaw, names} = this._sourceMap;
    let next;
    const vlqCache = new Map();
    for (let i = 0; i < mappingsRaw.length; i = next) {
      switch (mappingsRaw[i]) {
        case ';':
          generatedLine = inc(generatedLine);
          generatedColumn = FIRST_COLUMN;
        /* falls through */
        case ',':
          next = i + 1;
          continue;
      }
      findNext: for (next = i + 1; next < mappingsRaw.length; ++next) {
        switch (mappingsRaw[next]) {
          case ';':
          /* falls through */
          case ',':
            break findNext;
        }
      }
      const mappingRaw = mappingsRaw.slice(i, next);
      let decodedVlqValues;
      if (vlqCache.has(mappingRaw)) {
        decodedVlqValues = vlqCache.get(mappingRaw);
      } else {
        decodedVlqValues = decodeVlq(mappingRaw);
        vlqCache.set(mappingRaw, decodedVlqValues);
      }
      invariant(Array.isArray(decodedVlqValues), 'Decoding VLQ tuple failed');
      const [
        generatedColumnDelta,
        sourceIndexDelta,
        originalLineDelta,
        originalColumnDelta,
        nameIndexDelta,
      ] = decodedVlqValues;
      decodeVlq(mappingRaw);
      invariant(generatedColumnDelta != null, 'Invalid generated column delta');
      generatedColumn = add(generatedColumn, generatedColumnDelta);
      const mapping: Mapping = {
        generatedLine,
        generatedColumn,
        source: null,
        name: null,
        originalLine: null,
        originalColumn: null,
      };

      if (sourceIndexDelta != null) {
        sourceIndex = add(sourceIndex, sourceIndexDelta);
        mapping.source = normalizedSources[get0(sourceIndex)];

        invariant(originalLineDelta != null, 'Invalid original line delta');
        invariant(originalColumnDelta != null, 'Invalid original column delta');

        originalLine = add(originalLine, originalLineDelta);
        originalColumn = add(originalColumn, originalColumnDelta);

        mapping.originalLine = originalLine;
        mapping.originalColumn = originalColumn;

        if (nameIndexDelta != null) {
          nameIndex = add(nameIndex, nameIndexDelta);
          mapping.name = names[get0(nameIndex)];
        }
      }

      yield mapping;
    }
  }

  _normalizeAndCacheSources(): $ReadOnlyArray<string> {
    if (!this._normalizedSources) {
      this._normalizedSources = this._sourceMap.sources.map(source =>
        normalizeSourcePath(source, this._sourceMap),
      );
    }
    return this._normalizedSources;
  }

  _decodeAndCacheMappings(): $ReadOnlyArray<Mapping> {
    if (!this._decodedMappings) {
      this._decodedMappings = [...this._decodeMappings()];
    }
    return this._decodedMappings;
  }

  generatedMappings(): Iterable<Mapping> {
    return this._decodeAndCacheMappings();
  }
}

module.exports = MappingsConsumer;
