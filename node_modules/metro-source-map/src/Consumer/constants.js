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

const _require = require("ob1"),
  add0 = _require.add0,
  add1 = _require.add1;

const FIRST_COLUMN = add0(0);
const FIRST_LINE = add1(0);
const GENERATED_ORDER = "GENERATED_ORDER";
const ORIGINAL_ORDER = "ORIGINAL_ORDER";
const GREATEST_LOWER_BOUND = "GREATEST_LOWER_BOUND";
const LEAST_UPPER_BOUND = "LEAST_UPPER_BOUND";
const EMPTY_POSITION = Object.freeze({
  source: null,
  name: null,
  line: null,
  column: null
});

function iterationOrderToString(x) {
  return x;
}

function lookupBiasToString(x) {
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
  lookupBiasToString
};
