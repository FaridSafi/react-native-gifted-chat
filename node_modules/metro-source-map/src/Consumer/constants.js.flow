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

const {add0, add1} = require('ob1');
const FIRST_COLUMN = add0(0);
const FIRST_LINE = add1(0);

export opaque type IterationOrder = 'GENERATED_ORDER' | 'ORIGINAL_ORDER';
const GENERATED_ORDER: IterationOrder = 'GENERATED_ORDER';
const ORIGINAL_ORDER: IterationOrder = 'ORIGINAL_ORDER';

export opaque type LookupBias = 'GREATEST_LOWER_BOUND' | 'LEAST_UPPER_BOUND';
const GREATEST_LOWER_BOUND: LookupBias = 'GREATEST_LOWER_BOUND';
const LEAST_UPPER_BOUND: LookupBias = 'LEAST_UPPER_BOUND';

const EMPTY_POSITION = Object.freeze({
  source: null,
  name: null,
  line: null,
  column: null,
});

function iterationOrderToString(x: IterationOrder): string {
  return x;
}

function lookupBiasToString(x: LookupBias): string {
  return x;
}

module.exports = {
  FIRST_COLUMN,
  FIRST_LINE,
  GENERATED_ORDER,
  ORIGINAL_ORDER,
  GREATEST_LOWER_BOUND,
  LEAST_UPPER_BOUND,
  EMPTY_POSITION,
  iterationOrderToString,
  lookupBiasToString,
};
