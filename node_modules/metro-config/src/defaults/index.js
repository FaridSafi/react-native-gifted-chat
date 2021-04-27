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

const TerminalReporter = require("metro/src/lib/TerminalReporter");

const blacklist = require("./blacklist");

const getMaxWorkers = require("metro/src/lib/getMaxWorkers");

const os = require("os");

const path = require("path");

const _require = require("./defaults"),
  assetExts = _require.assetExts,
  sourceExts = _require.sourceExts,
  platforms = _require.platforms,
  DEFAULT_METRO_MINIFIER_PATH = _require.DEFAULT_METRO_MINIFIER_PATH,
  defaultCreateModuleIdFactory = _require.defaultCreateModuleIdFactory;

const _require2 = require("metro-cache"),
  FileStore = _require2.FileStore;

const _require3 = require("metro-core"),
  Terminal = _require3.Terminal;

const getDefaultValues = projectRoot => ({
  resolver: {
    assetExts,
    platforms,
    sourceExts,
    resolverMainFields: ["browser", "main"],
    extraNodeModules: {},
    resolveRequest: null,
    hasteImplModulePath: undefined,
    blacklistRE: blacklist(),
    useWatchman: true,
    virtualMapper: file => [file]
  },
  serializer: {
    polyfillModuleNames: [],
    getRunModuleStatement: moduleId => `__r(${JSON.stringify(moduleId)});`,
    getPolyfills: () => [],
    postProcessBundleSourcemap: _ref => {
      let code = _ref.code,
        map = _ref.map,
        outFileName = _ref.outFileName;
      return {
        code,
        map
      };
    },
    getModulesRunBeforeMainModule: () => [],
    processModuleFilter: module => true,
    createModuleIdFactory: defaultCreateModuleIdFactory,
    experimentalSerializerHook: () => {},
    customSerializer: null
  },
  server: {
    useGlobalHotkey: true,
    port: 8080,
    enableVisualizer: false,
    enhanceMiddleware: middleware => middleware,
    runInspectorProxy: true,
    verifyConnections: false
  },
  symbolicator: {
    customizeFrame: () => {},
    workerPath: "metro/src/Server/symbolicate/worker"
  },
  transformer: {
    assetPlugins: [],
    asyncRequireModulePath: "metro/src/lib/bundle-modules/asyncRequire",
    assetRegistryPath: "missing-asset-registry-path",
    babelTransformerPath: "metro-babel-transformer",
    dynamicDepsInPackages: "throwAtRuntime",
    enableBabelRCLookup: true,
    enableBabelRuntime: true,
    experimentalImportBundleSupport: false,
    getTransformOptions: (function() {
      var _ref2 = _asyncToGenerator(function*() {
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
        return _ref2.apply(this, arguments);
      };
    })(),
    minifierConfig: {
      mangle: {
        toplevel: false
      },
      output: {
        ascii_only: true,
        quote_style: 3,
        wrap_iife: true
      },
      sourceMap: {
        includeSources: false
      },
      toplevel: false,
      compress: {
        // reduce_funcs inlines single-use functions, which cause perf regressions.
        reduce_funcs: false
      }
    },
    minifierPath: DEFAULT_METRO_MINIFIER_PATH,
    optimizationSizeLimit: 150 * 1024,
    // 150 KiB.
    postMinifyProcess: x => x,
    transformVariants: {
      default: {}
    },
    workerPath: "metro/src/DeltaBundler/Worker",
    publicPath: "/assets"
  },
  cacheStores: [
    new FileStore({
      root: path.join(os.tmpdir(), "metro-cache")
    })
  ],
  cacheVersion: "1.0",
  // We assume the default project path is two levels up from
  // node_modules/metro/
  projectRoot: projectRoot || path.resolve(__dirname, "../../.."),
  stickyWorkers: true,
  watchFolders: [],
  transformerPath: require.resolve("metro/src/JSTransformer/worker.js"),
  maxWorkers: getMaxWorkers(),
  resetCache: false,
  reporter: new TerminalReporter(new Terminal(process.stdout)),
  visualizer: {
    presets: []
  }
});

function getDefaultConfig(_x) {
  return _getDefaultConfig.apply(this, arguments);
}

function _getDefaultConfig() {
  _getDefaultConfig = _asyncToGenerator(function*(rootPath) {
    // We can add more logic here to get a sensible default configuration, for
    // now we just return a stub.
    return getDefaultValues(rootPath);
  });
  return _getDefaultConfig.apply(this, arguments);
}

module.exports = getDefaultConfig;
module.exports.getDefaultValues = getDefaultValues;
