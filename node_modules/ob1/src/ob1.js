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
/* eslint-disable no-redeclare */
// A type representing 0-based offsets.

// A type representing 1-based offsets.
// Add two offsets or numbers.
function add(a, b) {
  return a + b;
} // Subtract a number or 0-based offset from a 1/0-based offset.

function sub(a, b) {
  return a - b;
} // Get the underlying number of a 0-based offset, casting away the opaque type.

function get0(x) {
  return x;
} // Get the underlying number of a 1-based offset, casting away the opaque type.

function get1(x) {
  return x;
} // Add 1 to a 0-based offset, thus converting it to 1-based.

function add1(x) {
  return x + 1;
} // Subtract 1 from a 1-based offset, thus converting it to 0-based.

function sub1(x) {
  return x - 1;
} // Negate a 0-based offset.

function neg(x) {
  return -x;
} // Cast a number to a 0-based offset.

function add0(x) {
  return x;
} // Increment a 0-based offset.

function inc(x) {
  return x + 1;
}

module.exports = {
  add,
  get0,
  get1,
  add1,
  sub1,
  sub,
  neg,
  add0,
  inc
};
