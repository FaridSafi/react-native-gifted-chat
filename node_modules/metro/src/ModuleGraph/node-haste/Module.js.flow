/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

'use strict';

import type {TransformedCodeFile} from '../types.flow';
import type ModuleCache from './ModuleCache';
import type Package from './Package';

module.exports = class Module {
  hasteID: ?string;
  moduleCache: ModuleCache;
  name: string;
  path: string;

  constructor(
    path: string,
    moduleCache: ModuleCache,
    info: TransformedCodeFile,
  ) {
    this.hasteID = info.hasteID;
    this.moduleCache = moduleCache;
    this.name = this.hasteID || getName(path);
    this.path = path;
  }

  getPackage(): ?Package {
    return this.moduleCache.getPackageOf(this.path);
  }

  isHaste(): boolean {
    return Boolean(this.hasteID);
  }
};

function getName(path: string): string {
  return path.replace(/^.*[\/\\]node_modules[\///]/, '');
}
