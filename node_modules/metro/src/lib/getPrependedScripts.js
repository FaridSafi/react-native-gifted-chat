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

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === "[object Arguments]"
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)
      arr2[i] = arr[i];
    return arr2;
  }
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

const countLines = require("./countLines");

const defaults = require("metro-config/src/defaults/defaults");

const getPreludeCode = require("./getPreludeCode");

const transformHelpers = require("./transformHelpers");

function getPrependedScripts(_x, _x2, _x3, _x4) {
  return _getPrependedScripts.apply(this, arguments);
}

function _getPrependedScripts() {
  _getPrependedScripts = _asyncToGenerator(function*(
    config,
    options,
    bundler,
    deltaBundler
  ) {
    // Get all the polyfills from the relevant option params (the
    // `getPolyfills()` method and the `polyfillModuleNames` variable).
    const polyfillModuleNames = config.serializer
      .getPolyfills({
        platform: options.platform
      })
      .concat(config.serializer.polyfillModuleNames);

    const transformOptions = _objectSpread({}, options, {
      type: "script"
    });

    const graph = yield deltaBundler.buildGraph(
      [defaults.moduleSystem].concat(_toConsumableArray(polyfillModuleNames)),
      {
        resolve: yield transformHelpers.getResolveDependencyFn(
          bundler,
          options.platform
        ),
        transform: yield transformHelpers.getTransformFn(
          [defaults.moduleSystem].concat(
            _toConsumableArray(polyfillModuleNames)
          ),
          bundler,
          deltaBundler,
          config,
          transformOptions
        ),
        onProgress: null,
        experimentalImportBundleSupport:
          config.transformer.experimentalImportBundleSupport,
        shallow: false
      }
    );
    return [
      _getPrelude({
        dev: options.dev
      })
    ].concat(_toConsumableArray(graph.dependencies.values()));
  });
  return _getPrependedScripts.apply(this, arguments);
}

function _getPrelude(_ref) {
  let dev = _ref.dev;
  const code = getPreludeCode({
    isDev: dev
  });
  const name = "__prelude__";
  return {
    dependencies: new Map(),
    getSource: () => Buffer.from(code),
    inverseDependencies: new Set(),
    path: name,
    output: [
      {
        type: "js/script/virtual",
        data: {
          code,
          lineCount: countLines(code),
          map: []
        }
      }
    ]
  };
}

module.exports = getPrependedScripts;
