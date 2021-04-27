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

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function() {
    var self = this,
      args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

const blacklist = require("./defaults/blacklist");

const os = require("os");

const path = require("path");

const _require = require("./defaults/defaults"),
  defaultCreateModuleIdFactory = _require.defaultCreateModuleIdFactory,
  platforms = _require.platforms;

const _require2 = require("metro-cache"),
  FileStore = _require2.FileStore;

const DEFAULT = {
  assetRegistryPath: "missing-asset-registry-path",
  enhanceMiddleware: middleware => middleware,
  extraNodeModules: {},
  cacheStores: [
    new FileStore({
      root: path.join(os.tmpdir(), "metro-cache")
    })
  ],
  cacheVersion: "1.0",
  createModuleIdFactory: defaultCreateModuleIdFactory,
  dynamicDepsInPackages: "throwAtRuntime",
  getAsyncRequireModulePath: () => "metro/src/lib/bundle-modules/asyncRequire",
  getAssetExts: () => [],
  getBlacklistRE: () => blacklist(),
  getEnableBabelRCLookup: () => true,
  getPlatforms: () => platforms,
  getPolyfillModuleNames: () => [],
  getProjectRoots: undefined,
  // We assume the default project path is two levels up from
  // node_modules/metro/
  getProjectRoot: () => path.resolve(__dirname, "../../.."),
  getWatchFolders: () => [],
  getRunModuleStatement: moduleId => `__r(${JSON.stringify(moduleId)});`,
  getSourceExts: () => [],
  getTransformModulePath: () => "metro-babel-transformer",
  getTransformOptions: (function() {
    var _ref = _asyncToGenerator(function*() {
      return {
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
          unstable_disableES6Transforms: false
        },
        preloadedModules: false,
        ramGroups: []
      };
    });

    return function getTransformOptions() {
      return _ref.apply(this, arguments);
    };
  })(),
  getPolyfills: () => [],
  getUseGlobalHotkey: () => true,
  postMinifyProcess: x => x,
  postProcessBundleSourcemap: _ref2 => {
    let code = _ref2.code,
      map = _ref2.map,
      outFileName = _ref2.outFileName;
    return {
      code,
      map
    };
  },
  resolveRequest: null,
  getResolverMainFields: () => ["browser", "main"],
  getModulesRunBeforeMainModule: () => [],
  getWorkerPath: () => "metro/src/DeltaBundler/Worker",
  processModuleFilter: module => true,
  transformVariants: () => ({
    default: {}
  }),
  virtualMapper: file => [file]
};
module.exports = {
  DEFAULT
};
