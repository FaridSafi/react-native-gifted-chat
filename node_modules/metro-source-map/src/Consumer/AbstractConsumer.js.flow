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

const invariant = require('invariant');

const {GENERATED_ORDER, iterationOrderToString} = require('./constants');

import type {
  SourcePosition,
  GeneratedPositionLookup,
  Mapping,
  IConsumer,
  IterationOrder,
} from './types.flow';

// Implementation details shared between MappingsConsumer and SectionsConsumer
class AbstractConsumer implements IConsumer {
  _sourceMap: {+file?: string};

  constructor(sourceMap: {+file?: string}) {
    this._sourceMap = sourceMap;
  }

  originalPositionFor(
    generatedPosition: GeneratedPositionLookup,
  ): SourcePosition {
    invariant(false, 'Not implemented');
  }

  generatedMappings(): Iterable<Mapping> {
    invariant(false, 'Not implemented');
  }

  eachMapping(
    callback: (mapping: Mapping) => mixed,
    context?: mixed = null,
    order?: IterationOrder = GENERATED_ORDER,
  ) {
    invariant(
      order === GENERATED_ORDER,
      `Iteration order not implemented: ${iterationOrderToString(order)}`,
    );
    for (const mapping of this.generatedMappings()) {
      callback.call(context, mapping);
    }
  }

  // flowlint unsafe-getters-setters:off
  get file(): ?string {
    return this._sourceMap.file;
  }
}

module.exports = AbstractConsumer;
