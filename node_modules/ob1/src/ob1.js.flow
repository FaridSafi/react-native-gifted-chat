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

/* eslint-disable no-redeclare */

// A type representing 0-based offsets.
export opaque type Number0 = number;
// A type representing 1-based offsets.
export opaque type Number1 = number;

// Add two offsets or numbers.
declare function add(a: Number1, b: number): Number1;
declare function add(a: number, b: Number1): Number1;
declare function add(a: Number0, b: number): Number0;
declare function add(a: number, b: Number0): Number0;
declare function add(a: Number1, b: Number0): Number1;
declare function add(a: Number0, b: Number1): Number1;
declare function add(a: Number0, b: Number0): Number0;

function add(a, b) {
  return a + b;
}

// Subtract a number or 0-based offset from a 1/0-based offset.
declare function sub(a: Number1, b: number): Number1;
declare function sub(a: Number0, b: number): Number0;
declare function sub(a: number, b: Number0): Number0;
declare function sub(a: Number0, b: number): Number0;
declare function sub(a: Number1, b: Number0): Number1;
declare function sub(a: Number0, b: Number0): Number0;
declare function sub(a: Number1, b: Number1): Number0;

function sub(a, b) {
  return a - b;
}

// Get the underlying number of a 0-based offset, casting away the opaque type.
declare function get0(x: Number0): number;
declare function get0(x: void | null): void | null;
function get0(x) {
  return x;
}

// Get the underlying number of a 1-based offset, casting away the opaque type.
declare function get1(x: Number1): number;
declare function get1(x: void | null): void | null;
function get1(x) {
  return x;
}

// Add 1 to a 0-based offset, thus converting it to 1-based.
function add1(x: Number0 | number): Number1 {
  return x + 1;
}

// Subtract 1 from a 1-based offset, thus converting it to 0-based.
function sub1(x: Number1): Number0 {
  return x - 1;
}

// Negate a 0-based offset.
function neg(x: Number0): Number0 {
  return -x;
}

// Cast a number to a 0-based offset.
function add0(x: number): Number0 {
  return x;
}

// Increment a 0-based offset.
declare function inc(a: Number0): Number0;
// Increment a 1-based offset.
declare function inc(a: Number1): Number1;

function inc(x) {
  return x + 1;
}

module.exports = {add, get0, get1, add1, sub1, sub, neg, add0, inc};
