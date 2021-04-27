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

const Server = require("../../Server");

const relativizeSourceMapInline = require("../../lib/relativizeSourceMap");

const writeFile = require("./writeFile");

function buildBundle(packagerClient, requestOptions) {
  return packagerClient.build(
    _objectSpread({}, Server.DEFAULT_BUNDLE_OPTIONS, requestOptions, {
      bundleType: "bundle"
    })
  );
}

function relativateSerializedMap(map, sourceMapSourcesRoot) {
  const sourceMap = JSON.parse(map);
  relativizeSourceMapInline(sourceMap, sourceMapSourcesRoot);
  return JSON.stringify(sourceMap);
}

function saveBundleAndMap(_x, _x2, _x3) {
  return _saveBundleAndMap.apply(this, arguments);
}

function _saveBundleAndMap() {
  _saveBundleAndMap = _asyncToGenerator(function*(bundle, options, log) {
    const bundleOutput = options.bundleOutput,
      encoding = options.bundleEncoding,
      sourcemapOutput = options.sourcemapOutput,
      sourcemapSourcesRoot = options.sourcemapSourcesRoot;
    const writeFns = [];
    writeFns.push(
      /*#__PURE__*/
      _asyncToGenerator(function*() {
        log("Writing bundle output to:", bundleOutput);
        yield writeFile(bundleOutput, bundle.code, encoding);
        log("Done writing bundle output");
      })
    );

    if (sourcemapOutput) {
      let map = bundle.map;

      if (sourcemapSourcesRoot !== undefined) {
        log("start relativating source map");
        map = relativateSerializedMap(map, sourcemapSourcesRoot);
        log("finished relativating");
      }

      writeFns.push(
        /*#__PURE__*/
        _asyncToGenerator(function*() {
          log("Writing sourcemap output to:", sourcemapOutput);
          yield writeFile(sourcemapOutput, map, null);
          log("Done writing sourcemap output");
        })
      );
    } // Wait until everything is written to disk.

    yield Promise.all(writeFns.map(cb => cb()));
  });
  return _saveBundleAndMap.apply(this, arguments);
}

exports.build = buildBundle;
exports.save = saveBundleAndMap;
exports.formatName = "bundle";
