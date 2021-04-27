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

module.exports = class Module {
  constructor(path, moduleCache, info) {
    this.hasteID = info.hasteID;
    this.moduleCache = moduleCache;
    this.name = this.hasteID || getName(path);
    this.path = path;
  }

  getPackage() {
    return this.moduleCache.getPackageOf(this.path);
  }

  isHaste() {
    return Boolean(this.hasteID);
  }
};

function getName(path) {
  return path.replace(/^.*[\/\\]node_modules[\///]/, "");
}
