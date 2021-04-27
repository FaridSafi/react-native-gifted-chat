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

const path = require('path');

const {AmbiguousModuleResolutionError} = require('metro-core');
const {DuplicateHasteCandidatesError} = require('jest-haste-map').ModuleMap;
const {InvalidPackageError} = require('metro-resolver');
const {PackageResolutionError} = require('metro-core');

import type DependencyGraphHelpers from './DependencyGraphHelpers';
import type {ModuleResolver} from './ModuleResolution';

export type Packageish = {
  path: string,
  redirectRequire(
    toModuleName: string,
    mainFields: $ReadOnlyArray<string>,
  ): string | false,
  getMain(mainFields: $ReadOnlyArray<string>): string,
};

export type Moduleish = {
  +path: string,
  getPackage(): ?Packageish,
};

export type ModuleishCache<TModule, TPackage> = {
  getPackage(
    name: string,
    platform?: string,
    supportsNativePlatform?: boolean,
  ): TPackage,
  getModule(path: string): TModule,
};

type Options<TModule, TPackage> = {|
  +entryPath: string,
  +helpers: DependencyGraphHelpers,
  +moduleCache: ModuleishCache<TModule, TPackage>,
  +moduleResolver: ModuleResolver<TModule, TPackage>,
  +platform: string | null,
|};

class ResolutionRequest<TModule: Moduleish, TPackage: Packageish> {
  _immediateResolutionCache: {[key: string]: TModule, __proto__: null};
  _options: Options<TModule, TPackage>;

  constructor(options: Options<TModule, TPackage>) {
    this._options = options;
    this._resetResolutionCache();
  }

  resolveDependency(fromModule: TModule, toModuleName: string): TModule {
    const resHash = getResolutionCacheKey(fromModule.path, toModuleName);

    const immediateResolution = this._immediateResolutionCache[resHash];
    if (immediateResolution) {
      return immediateResolution;
    }

    const cacheResult = (result: TModule) => {
      this._immediateResolutionCache[resHash] = result;
      return result;
    };

    const resolver = this._options.moduleResolver;
    const platform = this._options.platform;

    const allowHaste = !this._options.helpers.isNodeModulesDir(fromModule.path);

    try {
      return cacheResult(
        resolver.resolveDependency(
          fromModule,
          toModuleName,
          allowHaste,
          platform,
        ),
      );
    } catch (error) {
      if (error instanceof DuplicateHasteCandidatesError) {
        throw new AmbiguousModuleResolutionError(fromModule.path, error);
      }
      if (error instanceof InvalidPackageError) {
        throw new PackageResolutionError({
          packageError: error,
          originModulePath: fromModule.path,
          targetModuleName: toModuleName,
        });
      }
      throw error;
    }
  }

  _resetResolutionCache() {
    this._immediateResolutionCache = Object.create(null);
  }

  getResolutionCache(): {[key: string]: TModule, __proto__: null} {
    return this._immediateResolutionCache;
  }
}

function getResolutionCacheKey(modulePath: string, depName: string): string {
  return `${path.resolve(modulePath)}:${depName}`;
}

module.exports = ResolutionRequest;
