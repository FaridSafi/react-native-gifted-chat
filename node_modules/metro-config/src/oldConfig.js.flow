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

const blacklist = require('./defaults/blacklist');
const os = require('os');
const path = require('path');

const {
  defaultCreateModuleIdFactory,
  platforms,
} = require('./defaults/defaults');
const {FileStore} = require('metro-cache');

import type {OldConfigT as ConfigT} from './configTypes.flow.js';

const DEFAULT = ({
  assetRegistryPath: 'missing-asset-registry-path',
  enhanceMiddleware: middleware => middleware,
  extraNodeModules: {},
  cacheStores: [
    new FileStore({
      root: path.join(os.tmpdir(), 'metro-cache'),
    }),
  ],
  cacheVersion: '1.0',
  createModuleIdFactory: defaultCreateModuleIdFactory,
  dynamicDepsInPackages: 'throwAtRuntime',
  getAsyncRequireModulePath: () => 'metro/src/lib/bundle-modules/asyncRequire',
  getAssetExts: () => [],
  getBlacklistRE: () => blacklist(),
  getEnableBabelRCLookup: () => true,
  getPlatforms: () => platforms,
  getPolyfillModuleNames: () => [],
  getProjectRoots: undefined,
  // We assume the default project path is two levels up from
  // node_modules/metro/
  getProjectRoot: () => path.resolve(__dirname, '../../..'),
  getWatchFolders: () => [],
  getRunModuleStatement: (moduleId: number | string) =>
    `__r(${JSON.stringify(moduleId)});`,
  getSourceExts: () => [],
  getTransformModulePath: () => 'metro-babel-transformer',
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: false,
      unstable_disableES6Transforms: false,
    },
    preloadedModules: false,
    ramGroups: [],
  }),
  getPolyfills: () => [],
  getUseGlobalHotkey: () => true,
  postMinifyProcess: x => x,
  postProcessBundleSourcemap: ({code, map, outFileName}) => ({code, map}),
  resolveRequest: null,
  getResolverMainFields: () => ['browser', 'main'],
  getModulesRunBeforeMainModule: () => [],
  getWorkerPath: () => 'metro/src/DeltaBundler/Worker',
  processModuleFilter: module => true,
  transformVariants: () => ({default: {}}),
  virtualMapper: file => [file],
}: ConfigT);

module.exports = {
  DEFAULT,
};
