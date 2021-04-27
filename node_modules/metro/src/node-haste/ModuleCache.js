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

const Module = require("./Module");

const Package = require("./Package");

class ModuleCache {
  constructor(options) {
    this._getClosestPackage = options.getClosestPackage;
    this._moduleCache = Object.create(null);
    this._packageCache = Object.create(null);
    this._packageModuleMap = new WeakMap();
  }

  getModule(filePath) {
    if (!this._moduleCache[filePath]) {
      this._moduleCache[filePath] = new Module(filePath, this);
    }

    return this._moduleCache[filePath];
  }

  getPackage(filePath) {
    if (!this._packageCache[filePath]) {
      this._packageCache[filePath] = new Package({
        file: filePath
      });
    }

    return this._packageCache[filePath];
  }

  getPackageForModule(module) {
    let packagePath = this._packageModuleMap.get(module);

    if (packagePath) {
      if (this._packageCache[packagePath]) {
        return this._packageCache[packagePath];
      } else {
        this._packageModuleMap.delete(module);
      }
    }

    packagePath = this._getClosestPackage(module.path);

    if (!packagePath) {
      return null;
    }

    this._packageModuleMap.set(module, packagePath);

    return this.getPackage(packagePath);
  }

  processFileChange(type, filePath) {
    if (this._moduleCache[filePath]) {
      this._moduleCache[filePath].invalidate();

      delete this._moduleCache[filePath];
    }

    if (this._packageCache[filePath]) {
      this._packageCache[filePath].invalidate();

      delete this._packageCache[filePath];
    }
  }
}

module.exports = ModuleCache;
