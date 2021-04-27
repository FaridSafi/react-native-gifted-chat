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

'use strict';

import DependencyGraphHelpers from '../../node-haste/DependencyGraph/DependencyGraphHelpers';

type ModuleID = string;
export type Path = string;
type Platform = string;
type Platforms = Set<Platform>;

export type Extensions = Array<string>;

export type Module = {
  path: Path,
  type: 'Module',
  getName(): ModuleID,
  getPackage(): ?Package,
  isHaste(): Promise<boolean>,
};

export type Package = {
  path: Path,
  root: Path,
  type: 'Package',
  getMain(): Path,
  getName(): ModuleID,
  isHaste(): Promise<boolean>,
  redirectRequire(id: ModuleID): Path | false,
};

export type ModuleCache = {
  getModule(path: Path): Module,
  getPackage(path: Path): Package,
  getPackageOf(path: Path): ?Package,
};

export type FastFS = {
  dirExists(path: Path): boolean,
  closest(path: string, fileName: string): ?string,
  fileExists(path: Path): boolean,
  getAllFiles(): Array<Path>,
  matches(directory: Path, pattern: RegExp): Array<Path>,
};

type HasteMapOptions = {|
  extensions: Extensions,
  files: Array<string>,
  helpers: DependencyGraphHelpers,
  moduleCache: ModuleCache,
  platforms: Platforms,
  preferNativePlatform: true,
|};

/* eslint-disable flowtype/object-type-delimiter */
declare class HasteMap {
  // node-haste/DependencyGraph/HasteMap.js
  build(): Promise<Object>;
  constructor(options: HasteMapOptions): void;
}
/* eslint-enable flowtype/object-type-delimiter */
