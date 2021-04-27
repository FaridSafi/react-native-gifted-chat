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

const blacklist = require('./blacklist');
const getMaxWorkers = require('metro/src/lib/getMaxWorkers');
const os = require('os');
const path = require('path');

const {
  assetExts,
  sourceExts,
  platforms,
  DEFAULT_METRO_MINIFIER_PATH,
  defaultCreateModuleIdFactory,
} = require('./defaults');
const {FileStore} = require('metro-cache');
const {Terminal} = require('metro-core');

import type {ConfigT} from '../configTypes.flow';

const getDefaultValues = (projectRoot: ?string): ConfigT => ({
  resolver: {
    assetExts,
    platforms,
    sourceExts,
    resolverMainFields: ['browser', 'main'],
    extraNodeModules: {},
    resolveRequest: null,
    hasteImplModulePath: undefined,
    blacklistRE: blacklist(),
    useWatchman: true,
    virtualMapper: file => [file],
  },

  serializer: {
    polyfillModuleNames: [],
    getRunModuleStatement: (moduleId: number | string) =>
      `__r(${JSON.stringify(moduleId)});`,
    getPolyfills: () => [],
    postProcessBundleSourcemap: ({code, map, outFileName}) => ({code, map}),
    getModulesRunBeforeMainModule: () => [],
    processModuleFilter: module => true,
    createModuleIdFactory: defaultCreateModuleIdFactory,
    experimentalSerializerHook: () => {},
    customSerializer: null,
  },

  server: {
    useGlobalHotkey: true,
    port: 8080,
    enableVisualizer: false,
    enhanceMiddleware: middleware => middleware,
    runInspectorProxy: true,
    verifyConnections: false,
  },

  symbolicator: {
    customizeFrame: () => {},
    workerPath: 'metro/src/Server/symbolicate/worker',
  },

  transformer: {
    assetPlugins: [],
    asyncRequireModulePath: 'metro/src/lib/bundle-modules/asyncRequire',
    assetRegistryPath: 'missing-asset-registry-path',
    babelTransformerPath: 'metro-babel-transformer',
    dynamicDepsInPackages: 'throwAtRuntime',
    enableBabelRCLookup: true,
    enableBabelRuntime: true,
    experimentalImportBundleSupport: false,
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
        unstable_disableES6Transforms: false,
      },
      preloadedModules: false,
      ramGroups: [],
    }),
    minifierConfig: {
      mangle: {
        toplevel: false,
      },
      output: {
        ascii_only: true,
        quote_style: 3,
        wrap_iife: true,
      },
      sourceMap: {
        includeSources: false,
      },
      toplevel: false,
      compress: {
        // reduce_funcs inlines single-use functions, which cause perf regressions.
        reduce_funcs: false,
      },
    },
    minifierPath: DEFAULT_METRO_MINIFIER_PATH,
    optimizationSizeLimit: 150 * 1024, // 150 KiB.
    postMinifyProcess: x => x,
    transformVariants: {default: {}},
    workerPath: 'metro/src/DeltaBundler/Worker',
    publicPath: '/assets',
  },
  cacheStores: [
    new FileStore({
      root: path.join(os.tmpdir(), 'metro-cache'),
    }),
  ],
  cacheVersion: '1.0',
  // We assume the default project path is two levels up from
  // node_modules/metro/
  projectRoot: projectRoot || path.resolve(__dirname, '../../..'),
  stickyWorkers: true,
  watchFolders: [],
  transformerPath: require.resolve('metro/src/JSTransformer/worker.js'),
  maxWorkers: getMaxWorkers(),
  resetCache: false,
  reporter: new TerminalReporter(new Terminal(process.stdout)),
  visualizer: {presets: []},
});

async function getDefaultConfig(rootPath: ?string): Promise<ConfigT> {
  // We can add more logic here to get a sensible default configuration, for
  // now we just return a stub.

  return getDefaultValues(rootPath);
}

module.exports = getDefaultConfig;
module.exports.getDefaultValues = getDefaultValues;
