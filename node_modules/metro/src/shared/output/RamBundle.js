/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
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

const Server = require("../../Server");

const asAssets = require("./RamBundle/as-assets");

const asIndexedFile = require("./RamBundle/as-indexed-file").save;

function build(_x, _x2) {
  return _build.apply(this, arguments);
}

function _build() {
  _build = _asyncToGenerator(function*(packagerClient, requestOptions) {
    const options = _objectSpread(
      {},
      Server.DEFAULT_BUNDLE_OPTIONS,
      requestOptions,
      {
        bundleType: "ram"
      }
    );

    return yield packagerClient.getRamBundleInfo(options);
  });
  return _build.apply(this, arguments);
}

function save(bundle, options, log) {
  // We fork here depending on the platform: while Android is pretty good at
  // loading individual assets, iOS has a large overhead when reading hundreds
  // of assets from disk.
  return options.platform === "android" && !(options.indexedRamBundle === true)
    ? asAssets(bundle, options, log)
    : asIndexedFile(bundle, options, log);
}

exports.build = build;
exports.save = save;
exports.formatName = "bundle";
