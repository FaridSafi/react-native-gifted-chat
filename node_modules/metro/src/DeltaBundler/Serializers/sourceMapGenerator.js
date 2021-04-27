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

const getSourceMapInfo = require("./helpers/getSourceMapInfo");

const _require = require("./helpers/js"),
  isJsModule = _require.isJsModule;

const _require2 = require("metro-source-map"),
  fromRawMappings = _require2.fromRawMappings,
  fromRawMappingsNonBlocking = _require2.fromRawMappingsNonBlocking;

function getSourceMapInfosImpl(isBlocking, onDone, modules, options) {
  const sourceMapInfos = [];
  const modulesToProcess = modules
    .filter(isJsModule)
    .filter(options.processModuleFilter);

  function processNextModule() {
    if (modulesToProcess.length === 0) {
      return true;
    }

    const mod = modulesToProcess.shift();
    const info = getSourceMapInfo(mod, {
      excludeSource: options.excludeSource
    });
    sourceMapInfos.push(info);
    return false;
  }

  function workLoop() {
    const time = process.hrtime();

    while (true) {
      const isDone = processNextModule();

      if (isDone) {
        onDone(sourceMapInfos);
        break;
      }

      if (!isBlocking) {
        // Keep the loop running but try to avoid blocking
        // for too long because this is not in a worker yet.
        const diff = process.hrtime(time);
        const NS_IN_MS = 1000000;

        if (diff[1] > 50 * NS_IN_MS) {
          // We've blocked for more than 50ms.
          // This code currently runs on the main thread,
          // so let's give Metro an opportunity to handle requests.
          setImmediate(workLoop);
          break;
        }
      }
    }
  }

  workLoop();
}

function sourceMapGenerator(modules, options) {
  let sourceMapInfos;
  getSourceMapInfosImpl(
    true,
    infos => {
      sourceMapInfos = infos;
    },
    modules,
    options
  );

  if (sourceMapInfos == null) {
    throw new Error(
      "Expected getSourceMapInfosImpl() to finish synchronously."
    );
  }

  return fromRawMappings(sourceMapInfos);
}

function sourceMapGeneratorNonBlocking(_x, _x2) {
  return _sourceMapGeneratorNonBlocking.apply(this, arguments);
}

function _sourceMapGeneratorNonBlocking() {
  _sourceMapGeneratorNonBlocking = _asyncToGenerator(function*(
    modules,
    options
  ) {
    const sourceMapInfos = yield new Promise(resolve => {
      getSourceMapInfosImpl(false, resolve, modules, options);
    });
    return fromRawMappingsNonBlocking(sourceMapInfos);
  });
  return _sourceMapGeneratorNonBlocking.apply(this, arguments);
}

module.exports = {
  sourceMapGenerator,
  sourceMapGeneratorNonBlocking
};
