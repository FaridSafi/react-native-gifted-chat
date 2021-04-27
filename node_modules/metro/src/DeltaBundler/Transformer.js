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

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === "function") {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        })
      );
    }
    ownKeys.forEach(function(key) {
      _defineProperty(target, key, source[key]);
    });
  }
  return target;
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

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

const WorkerFarm = require("./WorkerFarm");

const assert = require("assert");

const fs = require("fs");

const getTransformCacheKey = require("./Transformer/getTransformCacheKey");

const path = require("path");

const _require = require("metro-cache"),
  Cache = _require.Cache,
  stableHash = _require.stableHash;

class Transformer {
  constructor(config, getSha1Fn) {
    this._config = config;

    this._config.watchFolders.forEach(verifyRootExists);

    this._cache = new Cache(config.cacheStores);
    this._getSha1 = getSha1Fn; // Remove the transformer config params that we don't want to pass to the
    // transformer. We should change the config object and move them away so we
    // can treat the transformer config params as opaque.

    const _this$_config$transfo = this._config.transformer,
      _getTransformOptions = _this$_config$transfo.getTransformOptions,
      _postMinifyProcess = _this$_config$transfo.postMinifyProcess,
      _transformVariants = _this$_config$transfo.transformVariants,
      _workerPath = _this$_config$transfo.workerPath,
      transformerConfig = _objectWithoutProperties(_this$_config$transfo, [
        "getTransformOptions",
        "postMinifyProcess",
        "transformVariants",
        "workerPath"
      ]);

    const transformerOptions = {
      transformerPath: this._config.transformerPath,
      transformerConfig
    };
    this._workerFarm = new WorkerFarm(config, transformerOptions);
    const globalCacheKey = getTransformCacheKey({
      cacheVersion: this._config.cacheVersion,
      projectRoot: this._config.projectRoot,
      transformerConfig: transformerOptions
    });
    this._baseHash = stableHash([globalCacheKey]).toString("binary");
  }

  transformFile(filePath, transformerOptions) {
    var _this = this;

    return _asyncToGenerator(function*() {
      const cache = _this._cache;

      const customTransformOptions = transformerOptions.customTransformOptions,
        dev = transformerOptions.dev,
        experimentalImportSupport =
          transformerOptions.experimentalImportSupport,
        hot = transformerOptions.hot,
        inlinePlatform = transformerOptions.inlinePlatform,
        inlineRequires = transformerOptions.inlineRequires,
        minify = transformerOptions.minify,
        unstable_disableES6Transforms =
          transformerOptions.unstable_disableES6Transforms,
        platform = transformerOptions.platform,
        type = transformerOptions.type,
        extra = _objectWithoutProperties(transformerOptions, [
          "customTransformOptions",
          "dev",
          "experimentalImportSupport",
          "hot",
          "inlinePlatform",
          "inlineRequires",
          "minify",
          "unstable_disableES6Transforms",
          "platform",
          "type"
        ]);

      for (const key in extra) {
        if (hasOwnProperty.call(extra, key)) {
          throw new Error(
            "Extra keys detected: " + Object.keys(extra).join(", ")
          );
        }
      }

      const localPath = path.relative(_this._config.projectRoot, filePath);
      const partialKey = stableHash([
        // This is the hash related to the global Bundler config.
        _this._baseHash, // Path.
        localPath,
        customTransformOptions,
        dev,
        experimentalImportSupport,
        hot,
        inlinePlatform,
        inlineRequires,
        minify,
        unstable_disableES6Transforms,
        platform,
        type
      ]);

      const sha1 = _this._getSha1(filePath);

      let fullKey = Buffer.concat([partialKey, Buffer.from(sha1, "hex")]);
      const result = yield cache.get(fullKey); // A valid result from the cache is used directly; otherwise we call into
      // the transformer to computed the corresponding result.

      const data = result
        ? {
            result,
            sha1
          }
        : yield _this._workerFarm.transform(localPath, transformerOptions); // Only re-compute the full key if the SHA-1 changed. This is because
      // references are used by the cache implementation in a weak map to keep
      // track of the cache that returned the result.

      if (sha1 !== data.sha1) {
        fullKey = Buffer.concat([partialKey, Buffer.from(data.sha1, "hex")]);
      }

      cache.set(fullKey, data.result);
      return _objectSpread({}, data.result, {
        getSource() {
          return fs.readFileSync(filePath);
        }
      });
    })();
  }

  end() {
    this._workerFarm.kill();
  }
}

function verifyRootExists(root) {
  // Verify that the root exists.
  assert(fs.statSync(root).isDirectory(), "Root has to be a valid directory");
}

module.exports = Transformer;
