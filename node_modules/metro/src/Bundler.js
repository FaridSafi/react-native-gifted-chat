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

const DependencyGraph = require("./node-haste/DependencyGraph");

const Transformer = require("./DeltaBundler/Transformer");

class Bundler {
  constructor(config) {
    this._depGraphPromise = DependencyGraph.load(config);

    this._depGraphPromise
      .then(dependencyGraph => {
        this._transformer = new Transformer(
          config,
          dependencyGraph.getSha1.bind(dependencyGraph)
        );
      })
      .catch(error => {
        console.error("Failed to construct transformer: ", error);
      });
  }

  end() {
    var _this = this;

    return _asyncToGenerator(function*() {
      const dependencyGraph = yield _this._depGraphPromise;

      _this._transformer.end();

      dependencyGraph.getWatcher().end();
    })();
  }

  getDependencyGraph() {
    return this._depGraphPromise;
  }

  transformFile(filePath, transformOptions) {
    var _this2 = this;

    return _asyncToGenerator(function*() {
      // We need to be sure that the DependencyGraph has been initialized.
      // TODO: Remove this ugly hack!
      yield _this2._depGraphPromise;
      return _this2._transformer.transformFile(filePath, transformOptions);
    })();
  }
}

module.exports = Bundler;
