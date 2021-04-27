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

const TerminalReporter = require('metro/src/lib/TerminalReporter');

const getDefaultConfig = require('./defaults');
const getMaxWorkers = require('metro/src/lib/getMaxWorkers');

const {Terminal} = require('metro-core');

import type {ConfigT, OldConfigT} from './configTypes.flow';
import type {Reporter} from 'metro/src/lib/reporting';

type DeprecatedMetroOptions = {|
  resetCache?: boolean,
|};

type PublicMetroOptions = {|
  ...DeprecatedMetroOptions,
  config: OldConfigT,
  maxWorkers?: number,
  minifierPath?: string,
  port?: ?number,
  reporter?: Reporter,
|};

// We get the metro runServer signature here and create the new config out of it
async function convertOldToNew({
  config,
  resetCache = false,
  maxWorkers = getMaxWorkers(),
  minifierPath,
  port = null,
  reporter = new TerminalReporter(new Terminal(process.stdout)),
}: PublicMetroOptions): Promise<ConfigT> {
  const {
    getBlacklistRE,
    cacheStores,
    createModuleIdFactory,
    cacheVersion,
    getProjectRoot,
    getWatchFolders,
    getTransformModulePath,
    resolveRequest,
    getAssetExts,
    getPlatforms,
    getResolverMainFields,
    getSourceExts,
    hasteImplModulePath,
    dynamicDepsInPackages,
    getPolyfillModuleNames,
    getAsyncRequireModulePath,
    getRunModuleStatement,
    getPolyfills,
    postProcessBundleSourcemap,
    getModulesRunBeforeMainModule,
    getUseGlobalHotkey,
    enhanceMiddleware,
    assetRegistryPath,
    getEnableBabelRCLookup,
    getTransformOptions,
    postMinifyProcess,
    getWorkerPath,
    extraNodeModules,
    transformVariants,
    processModuleFilter,
    virtualMapper,
  } = config;

  const defaultConfig = await getDefaultConfig(getProjectRoot());

  const assetExts = defaultConfig.resolver.assetExts.concat(
    (getAssetExts && getAssetExts()) || [],
  );
  const sourceExts = defaultConfig.resolver.sourceExts.concat(
    (getSourceExts && getSourceExts()) || [],
  );
  const platforms =
    (getPlatforms && getPlatforms()) || defaultConfig.resolver.platforms;

  const watchFolders = getWatchFolders();

  return {
    resolver: {
      assetExts,
      platforms,
      resolverMainFields: getResolverMainFields(),
      sourceExts,
      hasteImplModulePath,
      extraNodeModules,
      resolveRequest,
      blacklistRE: getBlacklistRE()
        ? getBlacklistRE()
        : defaultConfig.resolver.blacklistRE,
      useWatchman: true,
      virtualMapper,
    },
    serializer: {
      customSerializer: defaultConfig.serializer.customSerializer,
      createModuleIdFactory:
        createModuleIdFactory || defaultConfig.serializer.createModuleIdFactory,
      polyfillModuleNames: getPolyfillModuleNames(),
      getRunModuleStatement,
      getPolyfills,
      postProcessBundleSourcemap,
      processModuleFilter:
        processModuleFilter || defaultConfig.serializer.processModuleFilter,
      getModulesRunBeforeMainModule,
      experimentalSerializerHook: () => {},
    },
    server: {
      useGlobalHotkey: getUseGlobalHotkey(),
      port,
      enableVisualizer: false,
      enhanceMiddleware,
      runInspectorProxy: true,
      verifyConnections: false,
    },
    symbolicator: defaultConfig.symbolicator,
    transformer: {
      assetPlugins: defaultConfig.transformer.assetPlugins,
      assetRegistryPath,
      asyncRequireModulePath: getAsyncRequireModulePath(),
      babelTransformerPath: getTransformModulePath(),
      dynamicDepsInPackages,
      enableBabelRCLookup: getEnableBabelRCLookup(),
      enableBabelRuntime: true,
      experimentalImportBundleSupport: false,
      getTransformOptions,
      minifierConfig: defaultConfig.transformer.minifierConfig,
      minifierPath: minifierPath || defaultConfig.transformer.minifierPath,
      optimizationSizeLimit: 150 * 1024, // 150 KiB enforced for old configs.
      postMinifyProcess,
      transformVariants: transformVariants
        ? transformVariants()
        : defaultConfig.transformer.transformVariants,
      workerPath: getWorkerPath(),
      publicPath: '/assets',
    },

    reporter,
    cacheStores,
    cacheVersion,
    projectRoot: getProjectRoot(),
    stickyWorkers: defaultConfig.stickyWorkers,
    watchFolders,
    transformerPath: defaultConfig.transformerPath,
    resetCache,
    maxWorkers,
    visualizer: {presets: []},
  };
}

module.exports = {
  convertOldToNew,
};
