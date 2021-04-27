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

const createConsumer = require('./createConsumer');

const {
  GENERATED_ORDER,
  ORIGINAL_ORDER,
  GREATEST_LOWER_BOUND,
  LEAST_UPPER_BOUND,
} = require('./constants');

import type {MixedSourceMap} from '../source-map';
import type {
  SourcePosition,
  GeneratedPositionLookup,
  Mapping,
  IConsumer,
  IterationOrder,
} from './types.flow';

/**
 * A source map consumer that supports both "basic" and "indexed" source maps.
 * Uses `MappingsConsumer` and `SectionsConsumer` under the hood (via
 * `createConsumer`).
 */
class DelegatingConsumer implements IConsumer {
  static +GENERATED_ORDER = GENERATED_ORDER;
  static +ORIGINAL_ORDER = ORIGINAL_ORDER;
  static +GREATEST_LOWER_BOUND = GREATEST_LOWER_BOUND;
  static +LEAST_UPPER_BOUND = LEAST_UPPER_BOUND;

  _rootConsumer: IConsumer;

  constructor(sourceMap: MixedSourceMap) {
    this._rootConsumer = createConsumer(sourceMap);
    return this._rootConsumer;
  }

  originalPositionFor(
    generatedPosition: GeneratedPositionLookup,
  ): SourcePosition {
    return this._rootConsumer.originalPositionFor(generatedPosition);
  }

  generatedMappings(): Iterable<Mapping> {
    return this._rootConsumer.generatedMappings();
  }

  eachMapping(
    callback: (mapping: Mapping) => mixed,
    context?: mixed,
    order?: IterationOrder,
  ): void {
    return this._rootConsumer.eachMapping(callback, context, order);
  }

  // flowlint unsafe-getters-setters:off
  get file(): ?string {
    return this._rootConsumer.file;
  }
}

module.exports = DelegatingConsumer;
