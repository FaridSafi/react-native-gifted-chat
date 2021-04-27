/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 * @format
 */

'use strict';

const path = require('path');

const NODE_MODULES = path.sep + 'node_modules' + path.sep;

class DependencyGraphHelpers {
  _assetExts: Set<string>;

  constructor({assetExts}: {+assetExts: $ReadOnlyArray<string>}) {
    this._assetExts = new Set(assetExts);
  }

  isNodeModulesDir(file: string) {
    return file.lastIndexOf(NODE_MODULES) !== -1;
  }

  isAssetFile(file: string) {
    return this._assetExts.has(this.extname(file));
  }

  extname(name: string) {
    return path.extname(name).substr(1);
  }
}

module.exports = DependencyGraphHelpers;
