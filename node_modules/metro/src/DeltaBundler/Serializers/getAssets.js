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

const _require = require("../../Assets"),
  getAssetData = _require.getAssetData;

const _require2 = require("./helpers/js"),
  getJsOutput = _require2.getJsOutput,
  isJsModule = _require2.isJsModule;

function getAssets(_x, _x2) {
  return _getAssets.apply(this, arguments);
}

function _getAssets() {
  _getAssets = _asyncToGenerator(function*(graph, options) {
    const promises = [];
    const processModuleFilter = options.processModuleFilter;

    for (const module of graph.dependencies.values()) {
      if (
        isJsModule(module) &&
        processModuleFilter(module) &&
        getJsOutput(module).type === "js/module/asset" &&
        path.relative(options.projectRoot, module.path) !== "package.json"
      ) {
        promises.push(
          getAssetData(
            module.path,
            path.relative(options.projectRoot, module.path),
            options.assetPlugins,
            options.platform,
            options.publicPath
          )
        );
      }
    }

    return yield Promise.all(promises);
  });
  return _getAssets.apply(this, arguments);
}

module.exports = getAssets;
