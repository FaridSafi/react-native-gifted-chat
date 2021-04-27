/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 * @emails oncall+metro_bundler
 */

'use strict';

const {add, get0, get1, add1, sub1, sub, neg, add0, inc} = require('../ob1');

import type {Number0, Number1} from '../ob1';
const FORTY_TWO_0 = add0(42);
const FORTY_TWO_1 = add1(42);

module.exports = {
  testSafeOps() {
    (add(FORTY_TWO_0, FORTY_TWO_0): Number0);
    (add(FORTY_TWO_0, FORTY_TWO_1): Number1);
    (add(FORTY_TWO_1, FORTY_TWO_0): Number1);
    (sub(FORTY_TWO_1, FORTY_TWO_1): Number0);
    (add(FORTY_TWO_0, 9000): Number0);
    (add(FORTY_TWO_0, 9000): Number0);
    (add(FORTY_TWO_1, 9000): Number1);
    (sub(FORTY_TWO_1, 9000): Number1);
    (get0(FORTY_TWO_0): number);
    (get1(FORTY_TWO_1): number);
    (neg(FORTY_TWO_0): Number0);
    (add1(FORTY_TWO_0): Number1);
    (sub1(FORTY_TWO_1): Number0);
    (inc(FORTY_TWO_0): Number0);
    (inc(FORTY_TWO_1): Number1);
  },
  testUnsafeOps() {
    // $FlowExpectedError - adding two 1-based offsets.
    add(FORTY_TWO_1, FORTY_TWO_1);

    // $FlowExpectedError - subtracting 1-based offset from 0-based offset.
    sub(FORTY_TWO_0, FORTY_TWO_1);

    // $FlowExpectedError - direct computations with offsets are disallowed.
    FORTY_TWO_0 - 1;

    // $FlowExpectedError - direct computations with offsets are disallowed.
    FORTY_TWO_1 - 1;

    // $FlowExpectedError - extracting a 1-based offset as a 0-based number
    get0(FORTY_TWO_1);

    // $FlowExpectedError - extracting a 0-based offset as a 1-based number
    get1(FORTY_TWO_0);

    // $FlowExpectedError - negating a 1-based offset
    neg(FORTY_TWO_1);

    // $FlowExpectedError - adding 1 to an offset that's already 1-based
    add1(FORTY_TWO_1);

    // $FlowExpectedError - subtracting 1 from an offset that's already 0-based
    sub1(FORTY_TWO_0);

    // $FlowExpectedError - extracting an arbitrary number as a 0-based number
    get0(42);

    // $FlowExpectedError - extracting an arbitrary number as a 1-based number
    get1(42);
  },
};
