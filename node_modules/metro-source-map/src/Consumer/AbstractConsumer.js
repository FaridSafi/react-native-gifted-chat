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

const invariant = require("invariant");

const _require = require("./constants"),
  GENERATED_ORDER = _require.GENERATED_ORDER,
  iterationOrderToString = _require.iterationOrderToString;

// Implementation details shared between MappingsConsumer and SectionsConsumer
class AbstractConsumer {
  constructor(sourceMap) {
    this._sourceMap = sourceMap;
  }

  originalPositionFor(generatedPosition) {
    invariant(false, "Not implemented");
  }

  generatedMappings() {
    invariant(false, "Not implemented");
  }

  eachMapping(callback) {
    let context =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    let order =
      arguments.length > 2 && arguments[2] !== undefined
        ? arguments[2]
        : GENERATED_ORDER;
    invariant(
      order === GENERATED_ORDER,
      `Iteration order not implemented: ${iterationOrderToString(order)}`
    );

    for (const mapping of this.generatedMappings()) {
      callback.call(context, mapping);
    }
  } // flowlint unsafe-getters-setters:off

  get file() {
    return this._sourceMap.file;
  }
}

module.exports = AbstractConsumer;
