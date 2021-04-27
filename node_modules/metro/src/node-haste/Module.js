/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */
"use strict";

const isAbsolutePath = require("absolute-path");

class Module {
  constructor(file, moduleCache) {
    if (!isAbsolutePath(file)) {
      throw new Error("Expected file to be absolute path but got " + file);
    }

    this.path = file;
    this._moduleCache = moduleCache;
  }

  getPackage() {
    return this._moduleCache.getPackageForModule(this);
  }

  invalidate() {}
}

module.exports = Module;
