/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 * @format
 */
"use strict";

class MapWithDefaults extends Map {
  constructor(factory, iterable) {
    super(iterable);
    this._factory = factory;
  }

  get(key) {
    if (this.has(key)) {
      return Map.prototype.get.call(this, key);
    }

    const value = this._factory(key);

    this.set(key, value);
    return value;
  }
}

module.exports = MapWithDefaults;
