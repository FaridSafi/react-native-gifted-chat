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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

const AssetResolutionCache = require("./AssetResolutionCache");

const DependencyGraphHelpers = require("./DependencyGraph/DependencyGraphHelpers");

const JestHasteMap = require("jest-haste-map");

const Module = require("./Module");

const ModuleCache = require("./ModuleCache");

const ResolutionRequest = require("./DependencyGraph/ResolutionRequest");

const fs = require("fs");

const path = require("path");

const _require = require("./DependencyGraph/ModuleResolution"),
  ModuleResolver = _require.ModuleResolver;

const _require2 = require("events"),
  EventEmitter = _require2.EventEmitter;

const _require3 = require("metro-core"),
  _require3$Logger = _require3.Logger,
  createActionStartEntry = _require3$Logger.createActionStartEntry,
  createActionEndEntry = _require3$Logger.createActionEndEntry,
  log = _require3$Logger.log;

const JEST_HASTE_MAP_CACHE_BREAKER = 4;

class DependencyGraph extends EventEmitter {
  constructor(_ref) {
    let config = _ref.config,
      haste = _ref.haste,
      initialHasteFS = _ref.initialHasteFS,
      initialModuleMap = _ref.initialModuleMap;
    super();

    _defineProperty(this, "_doesFileExist", filePath => {
      return this._hasteFS.exists(filePath);
    });

    this._config = config;
    this._assetResolutionCache = new AssetResolutionCache({
      assetExtensions: new Set(config.resolver.assetExts),
      getDirFiles: dirPath => fs.readdirSync(dirPath),
      platforms: new Set(config.resolver.platforms)
    });
    this._haste = haste;
    this._hasteFS = initialHasteFS;
    this._moduleMap = initialModuleMap;
    this._helpers = new DependencyGraphHelpers({
      assetExts: config.resolver.assetExts
    });

    this._haste.on("change", this._onHasteChange.bind(this));

    this._moduleCache = this._createModuleCache();

    this._createModuleResolver();
  }

  static _createHaste(config) {
    return new JestHasteMap({
      cacheDirectory: config.hasteMapCacheDirectory,
      computeDependencies: false,
      computeSha1: true,
      extensions: config.resolver.sourceExts.concat(config.resolver.assetExts),
      forceNodeFilesystemAPI: !config.resolver.useWatchman,
      hasteImplModulePath: config.resolver.hasteImplModulePath,
      ignorePattern: config.resolver.blacklistRE || / ^/,
      mapper: config.resolver.virtualMapper,
      maxWorkers: config.maxWorkers,
      mocksPattern: "",
      name: "metro-" + JEST_HASTE_MAP_CACHE_BREAKER,
      platforms: config.resolver.platforms,
      retainAllFiles: true,
      resetCache: config.resetCache,
      rootDir: config.projectRoot,
      roots: config.watchFolders,
      throwOnModuleCollision: true,
      useWatchman: config.resolver.useWatchman,
      watch: true
    });
  }

  static load(config) {
    return _asyncToGenerator(function*() {
      const initializingMetroLogEntry = log(
        createActionStartEntry("Initializing Metro")
      );
      config.reporter.update({
        type: "dep_graph_loading"
      });

      const haste = DependencyGraph._createHaste(config);

      const _ref2 = yield haste.build(),
        hasteFS = _ref2.hasteFS,
        moduleMap = _ref2.moduleMap;

      log(createActionEndEntry(initializingMetroLogEntry));
      config.reporter.update({
        type: "dep_graph_loaded"
      });
      return new DependencyGraph({
        haste,
        initialHasteFS: hasteFS,
        initialModuleMap: moduleMap,
        config
      });
    })();
  }

  _getClosestPackage(filePath) {
    const parsedPath = path.parse(filePath);
    const root = parsedPath.root;
    let dir = parsedPath.dir;

    do {
      const candidate = path.join(dir, "package.json");

      if (this._hasteFS.exists(candidate)) {
        return candidate;
      }

      dir = path.dirname(dir);
    } while (dir !== "." && dir !== root);

    return null;
  }

  _onHasteChange(_ref3) {
    let eventsQueue = _ref3.eventsQueue,
      hasteFS = _ref3.hasteFS,
      moduleMap = _ref3.moduleMap;
    this._hasteFS = hasteFS;

    this._assetResolutionCache.clear();

    this._moduleMap = moduleMap;
    eventsQueue.forEach(_ref4 => {
      let type = _ref4.type,
        filePath = _ref4.filePath;
      return this._moduleCache.processFileChange(type, filePath);
    });

    this._createModuleResolver();

    this.emit("change");
  }

  _createModuleResolver() {
    this._moduleResolver = new ModuleResolver({
      dirExists: filePath => {
        try {
          return fs.lstatSync(filePath).isDirectory();
        } catch (e) {}

        return false;
      },
      doesFileExist: this._doesFileExist,
      extraNodeModules: this._config.resolver.extraNodeModules,
      isAssetFile: filePath => this._helpers.isAssetFile(filePath),
      mainFields: this._config.resolver.resolverMainFields,
      moduleCache: this._moduleCache,
      moduleMap: this._moduleMap,
      preferNativePlatform: true,
      projectRoot: this._config.projectRoot,
      resolveAsset: (dirPath, assetName, platform) =>
        this._assetResolutionCache.resolve(dirPath, assetName, platform),
      resolveRequest: this._config.resolver.resolveRequest,
      sourceExts: this._config.resolver.sourceExts
    });
  }

  _createModuleCache() {
    return new ModuleCache({
      getClosestPackage: this._getClosestPackage.bind(this)
    });
  }

  getSha1(filename) {
    // TODO If it looks like we're trying to get the sha1 from a file located
    // within a Zip archive, then we instead compute the sha1 for what looks
    // like the Zip archive itself.
    const splitIndex = filename.indexOf(".zip/");
    const containerName =
      splitIndex !== -1 ? filename.slice(0, splitIndex + 4) : filename; // TODO Calling realpath allows us to get a hash for a given path even when
    // it's a symlink to a file, which prevents Metro from crashing in such a
    // case. However, it doesn't allow Metro to track changes to the target file
    // of the symlink. We should fix this by implementing a symlink map into
    // Metro (or maybe by implementing those "extra transformation sources" we've
    // been talking about for stuff like CSS or WASM).

    const resolvedPath = fs.realpathSync(containerName);

    const sha1 = this._hasteFS.getSha1(resolvedPath);

    if (!sha1) {
      throw new ReferenceError(
        `SHA-1 for file ${filename} (${resolvedPath}) is not computed`
      );
    }

    return sha1;
  }

  getWatcher() {
    return this._haste;
  }

  end() {
    this._haste.end();
  }

  resolveDependency(from, to, platform) {
    const req = new ResolutionRequest({
      moduleResolver: this._moduleResolver,
      entryPath: from,
      helpers: this._helpers,
      platform: platform || null,
      moduleCache: this._moduleCache
    });
    return req.resolveDependency(this._moduleCache.getModule(from), to).path;
  }

  getHasteName(filePath) {
    const hasteName = this._hasteFS.getModuleName(filePath);

    if (hasteName) {
      return hasteName;
    }

    return path.relative(this._config.projectRoot, filePath);
  }
}

module.exports = DependencyGraph;
