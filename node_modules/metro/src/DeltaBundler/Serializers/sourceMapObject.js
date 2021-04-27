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

const _require = require("./sourceMapGenerator"),
  sourceMapGenerator = _require.sourceMapGenerator,
  sourceMapGeneratorNonBlocking = _require.sourceMapGeneratorNonBlocking;

function sourceMapObject(modules, options) {
  const generator = sourceMapGenerator(modules, options);
  return generator.toMap(undefined, {
    excludeSource: options.excludeSource
  });
}

function sourceMapObjectNonBlocking(_x, _x2) {
  return _sourceMapObjectNonBlocking.apply(this, arguments);
}

function _sourceMapObjectNonBlocking() {
  _sourceMapObjectNonBlocking = _asyncToGenerator(function*(modules, options) {
    const generator = yield sourceMapGeneratorNonBlocking(modules, options);
    return generator.toMap(undefined, {
      excludeSource: options.excludeSource
    });
  });
  return _sourceMapObjectNonBlocking.apply(this, arguments);
}

module.exports = {
  sourceMapObject,
  sourceMapObjectNonBlocking
};
