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

const getDefaultConfig = require("./defaults");

const getMaxWorkers = require("metro/src/lib/getMaxWorkers");

const _require = require("metro-core"),
  Terminal = _require.Terminal;

// We get the metro runServer signature here and create the new config out of it
function convertOldToNew(_x) {
  return _convertOldToNew.apply(this, arguments);
}

function _convertOldToNew() {
  _convertOldToNew = _asyncToGenerator(function*(_ref) {
    let config = _ref.config,
      _ref$resetCache = _ref.resetCache,
      resetCache = _ref$resetCache === void 0 ? false : _ref$resetCache,
      _ref$maxWorkers = _ref.maxWorkers,
      maxWorkers =
        _ref$maxWorkers === void 0 ? getMaxWorkers() : _ref$maxWorkers,
      minifierPath = _ref.minifierPath,
      _ref$port = _ref.port,
      port = _ref$port === void 0 ? null : _ref$port,
      _ref$reporter = _ref.reporter,
      reporter =
        _ref$reporter === void 0
          ? new TerminalReporter(new Terminal(process.stdout))
          : _ref$reporter;
    const getBlacklistRE = config.getBlacklistRE,
      cacheStores = config.cacheStores,
      createModuleIdFactory = config.createModuleIdFactory,
      cacheVersion = config.cacheVersion,
      getProjectRoot = config.getProjectRoot,
      getWatchFolders = config.getWatchFolders,
      getTransformModulePath = config.getTransformModulePath,
      resolveRequest = config.resolveRequest,
      getAssetExts = config.getAssetExts,
      getPlatforms = config.getPlatforms,
      getResolverMainFields = config.getResolverMainFields,
      getSourceExts = config.getSourceExts,
      hasteImplModulePath = config.hasteImplModulePath,
      dynamicDepsInPackages = config.dynamicDepsInPackages,
      getPolyfillModuleNames = config.getPolyfillModuleNames,
      getAsyncRequireModulePath = config.getAsyncRequireModulePath,
      getRunModuleStatement = config.getRunModuleStatement,
      getPolyfills = config.getPolyfills,
      postProcessBundleSourcemap = config.postProcessBundleSourcemap,
      getModulesRunBeforeMainModule = config.getModulesRunBeforeMainModule,
      getUseGlobalHotkey = config.getUseGlobalHotkey,
      enhanceMiddleware = config.enhanceMiddleware,
      assetRegistryPath = config.assetRegistryPath,
      getEnableBabelRCLookup = config.getEnableBabelRCLookup,
      getTransformOptions = config.getTransformOptions,
      postMinifyProcess = config.postMinifyProcess,
      getWorkerPath = config.getWorkerPath,
      extraNodeModules = config.extraNodeModules,
      transformVariants = config.transformVariants,
      processModuleFilter = config.processModuleFilter,
      virtualMapper = config.virtualMapper;
    const defaultConfig = yield getDefaultConfig(getProjectRoot());
    const assetExts = defaultConfig.resolver.assetExts.concat(
      (getAssetExts && getAssetExts()) || []
    );
    const sourceExts = defaultConfig.resolver.sourceExts.concat(
      (getSourceExts && getSourceExts()) || []
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
        virtualMapper
      },
      serializer: {
        customSerializer: defaultConfig.serializer.customSerializer,
        createModuleIdFactory:
          createModuleIdFactory ||
          defaultConfig.serializer.createModuleIdFactory,
        polyfillModuleNames: getPolyfillModuleNames(),
        getRunModuleStatement,
        getPolyfills,
        postProcessBundleSourcemap,
        processModuleFilter:
          processModuleFilter || defaultConfig.serializer.processModuleFilter,
        getModulesRunBeforeMainModule,
        experimentalSerializerHook: () => {}
      },
      server: {
        useGlobalHotkey: getUseGlobalHotkey(),
        port,
        enableVisualizer: false,
        enhanceMiddleware,
        runInspectorProxy: true,
        verifyConnections: false
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
        optimizationSizeLimit: 150 * 1024,
        // 150 KiB enforced for old configs.
        postMinifyProcess,
        transformVariants: transformVariants
          ? transformVariants()
          : defaultConfig.transformer.transformVariants,
        workerPath: getWorkerPath(),
        publicPath: "/assets"
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
      visualizer: {
        presets: []
      }
    };
  });
  return _convertOldToNew.apply(this, arguments);
}

module.exports = {
  convertOldToNew
};
