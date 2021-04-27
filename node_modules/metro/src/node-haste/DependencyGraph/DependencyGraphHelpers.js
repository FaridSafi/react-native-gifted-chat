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

const path = require("path");

const NODE_MODULES = path.sep + "node_modules" + path.sep;

class DependencyGraphHelpers {
  constructor(_ref) {
    let assetExts = _ref.assetExts;
    this._assetExts = new Set(assetExts);
  }

  isNodeModulesDir(file) {
    return file.lastIndexOf(NODE_MODULES) !== -1;
  }

  isAssetFile(file) {
    return this._assetExts.has(this.extname(file));
  }

  extname(name) {
    return path.extname(name).substr(1);
  }
}

module.exports = DependencyGraphHelpers;
