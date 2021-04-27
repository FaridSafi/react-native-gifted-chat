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

const path = require("path");

const _require = require("metro-core"),
  AmbiguousModuleResolutionError = _require.AmbiguousModuleResolutionError;

const DuplicateHasteCandidatesError = require("jest-haste-map").ModuleMap
  .DuplicateHasteCandidatesError;

const _require2 = require("metro-resolver"),
  InvalidPackageError = _require2.InvalidPackageError;

const _require3 = require("metro-core"),
  PackageResolutionError = _require3.PackageResolutionError;

class ResolutionRequest {
  constructor(options) {
    this._options = options;

    this._resetResolutionCache();
  }

  resolveDependency(fromModule, toModuleName) {
    const resHash = getResolutionCacheKey(fromModule.path, toModuleName);
    const immediateResolution = this._immediateResolutionCache[resHash];

    if (immediateResolution) {
      return immediateResolution;
    }

    const cacheResult = result => {
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
          platform
        )
      );
    } catch (error) {
      if (error instanceof DuplicateHasteCandidatesError) {
        throw new AmbiguousModuleResolutionError(fromModule.path, error);
      }

      if (error instanceof InvalidPackageError) {
        throw new PackageResolutionError({
          packageError: error,
          originModulePath: fromModule.path,
          targetModuleName: toModuleName
        });
      }

      throw error;
    }
  }

  _resetResolutionCache() {
    this._immediateResolutionCache = Object.create(null);
  }

  getResolutionCache() {
    return this._immediateResolutionCache;
  }
}

function getResolutionCacheKey(modulePath, depName) {
  return `${path.resolve(modulePath)}:${depName}`;
}

module.exports = ResolutionRequest;
