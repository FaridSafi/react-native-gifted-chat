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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

const createConsumer = require("./createConsumer");

const _require = require("./constants"),
  GENERATED_ORDER = _require.GENERATED_ORDER,
  ORIGINAL_ORDER = _require.ORIGINAL_ORDER,
  GREATEST_LOWER_BOUND = _require.GREATEST_LOWER_BOUND,
  LEAST_UPPER_BOUND = _require.LEAST_UPPER_BOUND;

/**
 * A source map consumer that supports both "basic" and "indexed" source maps.
 * Uses `MappingsConsumer` and `SectionsConsumer` under the hood (via
 * `createConsumer`).
 */
class DelegatingConsumer {
  constructor(sourceMap) {
    this._rootConsumer = createConsumer(sourceMap);
    return this._rootConsumer;
  }

  originalPositionFor(generatedPosition) {
    return this._rootConsumer.originalPositionFor(generatedPosition);
  }

  generatedMappings() {
    return this._rootConsumer.generatedMappings();
  }

  eachMapping(callback, context, order) {
    return this._rootConsumer.eachMapping(callback, context, order);
  } // flowlint unsafe-getters-setters:off

  get file() {
    return this._rootConsumer.file;
  }
}

_defineProperty(DelegatingConsumer, "GENERATED_ORDER", GENERATED_ORDER);

_defineProperty(DelegatingConsumer, "ORIGINAL_ORDER", ORIGINAL_ORDER);

_defineProperty(
  DelegatingConsumer,
  "GREATEST_LOWER_BOUND",
  GREATEST_LOWER_BOUND
);

_defineProperty(DelegatingConsumer, "LEAST_UPPER_BOUND", LEAST_UPPER_BOUND);

module.exports = DelegatingConsumer;
