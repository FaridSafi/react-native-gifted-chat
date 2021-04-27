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

const Module = require('./Module');
const Package = require('./Package');

import type {PackageData, TransformedCodeFile} from '../types.flow';

type GetClosestPackageFn = (filePath: string) => ?string;

module.exports = class ModuleCache {
  _getClosestPackage: GetClosestPackageFn;
  getTransformedFile: string => TransformedCodeFile;
  modules: Map<string, Module>;
  packages: Map<string, Package>;

  constructor(
    getClosestPackage: GetClosestPackageFn,
    getTransformedFile: string => TransformedCodeFile,
  ) {
    this._getClosestPackage = getClosestPackage;
    this.getTransformedFile = getTransformedFile;
    this.modules = new Map();
    this.packages = new Map();
  }

  getModule(path: string): Module {
    // This is hacky as hell... `ModuleGraph` handles relative paths but which
    // start with a slash (so we can have `/js/foo.js` or even `/../foo.js`).
    // This does not play well with `jest-haste-map`, which tries to convert
    // paths to absolute (https://fburl.com/vbwmjsxa) causing an additional
    // slashed to be prepended in the file path.
    // TODO: Refactor the way metro-buck handles paths to make them either
    // relative or absolute.
    const normalizedPath = path.startsWith('//') ? path.substr(1) : path;

    let m = this.modules.get(normalizedPath);
    if (!m) {
      m = new Module(
        normalizedPath,
        this,
        this.getTransformedFile(normalizedPath),
      );
      this.modules.set(normalizedPath, m);
    }
    return m;
  }

  getPackage(path: string): Package {
    let p = this.packages.get(path);
    if (!p) {
      p = new Package(path, this.getPackageData(path));
      this.packages.set(path, p);
    }
    return p;
  }

  getPackageData(path: string): PackageData {
    const pkg = this.getTransformedFile(path).package;
    if (!pkg) {
      throw new Error(`"${path}" does not exist`);
    }
    return pkg;
  }

  getPackageOf(filePath: string): ?Package {
    const candidate = this._getClosestPackage(filePath);
    return candidate != null ? this.getPackage(candidate) : null;
  }
};
