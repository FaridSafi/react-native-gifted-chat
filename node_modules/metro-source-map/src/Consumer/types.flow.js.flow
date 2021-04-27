/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

// NOTE: The linter and formatter are fighting over the following lint rule.
/* eslint-disable flowtype/object-type-delimiter */

'use strict';

import type {IterationOrder, LookupBias} from './constants';
import type {Number0, Number1} from 'ob1';
export type {IterationOrder, LookupBias};
export type GeneratedOffset = {|+lines: Number0, +columns: Number0|};
export type SourcePosition = {
  +source: ?string,
  +line: ?Number1,
  +column: ?Number0,
  +name: ?string,
};
export type GeneratedPosition = {+line: Number1, +column: Number0};
export type GeneratedPositionLookup = {
  +line: ?Number1,
  +column: ?Number0,
  +bias?: LookupBias,
};

export type Mapping = {
  source: ?string,
  generatedLine: Number1,
  generatedColumn: Number0,
  originalLine: ?Number1,
  originalColumn: ?Number0,
  name: ?string,
};

export interface IConsumer {
  originalPositionFor(
    generatedPosition: GeneratedPositionLookup,
  ): SourcePosition;

  generatedMappings(): Iterable<Mapping>;

  eachMapping(
    callback: (mapping: Mapping) => mixed,
    context?: mixed,
    order?: IterationOrder,
  ): void;

  // flowlint unsafe-getters-setters:off
  get file(): ?string;
}
