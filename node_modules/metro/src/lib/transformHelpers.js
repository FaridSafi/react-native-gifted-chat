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

const path = require("path");

function calcTransformerOptions(_x, _x2, _x3, _x4, _x5) {
  return _calcTransformerOptions.apply(this, arguments);
}

function _calcTransformerOptions() {
  _calcTransformerOptions = _asyncToGenerator(function*(
    entryFiles,
    bundler,
    deltaBundler,
    config,
    options
  ) {
    const baseOptions = {
      customTransformOptions: options.customTransformOptions,
      dev: options.dev,
      hot: options.hot,
      inlineRequires: false,
      inlinePlatform: true,
      minify: options.minify,
      platform: options.platform
    }; // When we're processing scripts, we don't need to calculate any
    // inlineRequires information, since scripts by definition don't have
    // requires().

    if (options.type === "script") {
      return _objectSpread({}, baseOptions, {
        type: "script"
      });
    }

    const getDependencies =
      /*#__PURE__*/
      (function() {
        var _ref = _asyncToGenerator(function*(path) {
          const _ref2 = yield deltaBundler.buildGraph([path], {
              resolve: yield getResolveDependencyFn(bundler, options.platform),
              transform: yield getTransformFn(
                [path],
                bundler,
                deltaBundler,
                config,
                _objectSpread({}, options, {
                  minify: false
                })
              ),
              onProgress: null,
              experimentalImportBundleSupport:
                config.transformer.experimentalImportBundleSupport,
              shallow: false
            }),
            dependencies = _ref2.dependencies;

          return Array.from(dependencies.keys());
        });

        return function getDependencies(_x13) {
          return _ref.apply(this, arguments);
        };
      })();

    const _ref3 = yield config.transformer.getTransformOptions(
        entryFiles,
        {
          dev: options.dev,
          hot: options.hot,
          platform: options.platform
        },
        getDependencies
      ),
      transform = _ref3.transform;

    return _objectSpread({}, baseOptions, {
      inlineRequires: transform.inlineRequires || false,
      experimentalImportSupport: transform.experimentalImportSupport || false,
      unstable_disableES6Transforms:
        transform.unstable_disableES6Transforms || false,
      type: "module"
    });
  });
  return _calcTransformerOptions.apply(this, arguments);
}

function removeInlineRequiresBlacklistFromOptions(path, inlineRequires) {
  if (typeof inlineRequires === "object") {
    return !(path in inlineRequires.blacklist);
  }

  return inlineRequires;
}

function getTransformFn(_x6, _x7, _x8, _x9, _x10) {
  return _getTransformFn.apply(this, arguments);
}

function _getTransformFn() {
  _getTransformFn = _asyncToGenerator(function*(
    entryFiles,
    bundler,
    deltaBundler,
    config,
    options
  ) {
    const _ref4 = yield calcTransformerOptions(
        entryFiles,
        bundler,
        deltaBundler,
        config,
        options
      ),
      inlineRequires = _ref4.inlineRequires,
      transformOptions = _objectWithoutProperties(_ref4, ["inlineRequires"]);

    return (
      /*#__PURE__*/
      (function() {
        var _ref5 = _asyncToGenerator(function*(path) {
          return yield bundler.transformFile(
            path,
            _objectSpread({}, transformOptions, {
              type: getType(
                transformOptions.type,
                path,
                config.resolver.assetExts
              ),
              inlineRequires: removeInlineRequiresBlacklistFromOptions(
                path,
                inlineRequires
              )
            })
          );
        });

        return function(_x14) {
          return _ref5.apply(this, arguments);
        };
      })()
    );
  });
  return _getTransformFn.apply(this, arguments);
}

function getType(type, filePath, assetExts) {
  if (type === "script") {
    return type;
  }

  if (assetExts.indexOf(path.extname(filePath).slice(1)) !== -1) {
    return "asset";
  }

  return "module";
}

function getResolveDependencyFn(_x11, _x12) {
  return _getResolveDependencyFn.apply(this, arguments);
}

function _getResolveDependencyFn() {
  _getResolveDependencyFn = _asyncToGenerator(function*(bundler, platform) {
    const dependencyGraph = yield bundler.getDependencyGraph();
    return (from, to) => dependencyGraph.resolveDependency(from, to, platform);
  });
  return _getResolveDependencyFn.apply(this, arguments);
}

module.exports = {
  getTransformFn,
  getResolveDependencyFn
};
