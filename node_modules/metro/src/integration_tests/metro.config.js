/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+metro_bundler
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

const path = require("path");

const ROOT_PATH = path.resolve(__dirname, "basic_bundle");
module.exports = {
  cacheStores: [],
  maxWorkers: 1,
  projectRoot: ROOT_PATH,
  reporter: {
    update() {}
  },
  watchFolders: [path.resolve(__dirname, "../../")],
  server: {
    port: 10028
  },
  resolver: {
    useWatchman: false
  },
  transformer: {
    assetRegistryPath: path.join(ROOT_PATH, "AssetRegistry"),
    asyncRequireModulePath: require.resolve(
      "metro/src/lib/bundle-modules/asyncRequire"
    ),
    babelTransformerPath: require.resolve(
      "metro-react-native-babel-transformer"
    ),
    enableBabelRCLookup: false,
    enableBabelRuntime: false,
    getTransformOptions: (function() {
      var _ref = _asyncToGenerator(function*() {
        return {
          transform: {
            experimentalImportSupport: true,
            inlineRequires: false
          },
          preloadedModules: false,
          ramGroups: []
        };
      });

      return function getTransformOptions() {
        return _ref.apply(this, arguments);
      };
    })()
  }
};
