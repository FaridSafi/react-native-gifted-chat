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

const _require = require("../../Assets"),
  getAssetFiles = _require.getAssetFiles;

const _require2 = require("./helpers/js"),
  getJsOutput = _require2.getJsOutput,
  isJsModule = _require2.isJsModule;

function getAllFiles(_x, _x2, _x3) {
  return _getAllFiles.apply(this, arguments);
}

function _getAllFiles() {
  _getAllFiles = _asyncToGenerator(function*(pre, graph, options) {
    const modules = graph.dependencies;
    const processModuleFilter = options.processModuleFilter;
    const promises = [];

    for (const module of pre) {
      if (processModuleFilter(module)) {
        promises.push([module.path]);
      }
    }

    for (const module of modules.values()) {
      if (!isJsModule(module) || !processModuleFilter(module)) {
        continue;
      }

      if (getJsOutput(module).type === "js/module/asset") {
        promises.push(getAssetFiles(module.path, options.platform));
      } else {
        promises.push([module.path]);
      }
    }

    const dependencies = yield Promise.all(promises);
    const output = [];

    for (const dependencyArray of dependencies) {
      output.push.apply(output, _toConsumableArray(dependencyArray));
    }

    return output;
  });
  return _getAllFiles.apply(this, arguments);
}

module.exports = getAllFiles;
