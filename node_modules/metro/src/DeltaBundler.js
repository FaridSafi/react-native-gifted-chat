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

const DeltaCalculator = require("./DeltaBundler/DeltaCalculator");

/**
 * `DeltaBundler` uses the `DeltaTransformer` to build bundle deltas. This
 * module handles all the transformer instances so it can support multiple
 * concurrent clients requesting their own deltas. This is done through the
 * `clientId` param (which maps a client to a specific delta transformer).
 */
class DeltaBundler {
  constructor(bundler) {
    _defineProperty(this, "_deltaCalculators", new Map());

    this._bundler = bundler;
  }

  end() {
    this._deltaCalculators.forEach(deltaCalculator => deltaCalculator.end());

    this._deltaCalculators = new Map();
  }

  buildGraph(entryPoints, options) {
    var _this = this;

    return _asyncToGenerator(function*() {
      const depGraph = yield _this._bundler.getDependencyGraph();
      const deltaCalculator = new DeltaCalculator(
        entryPoints,
        depGraph,
        options
      );
      yield deltaCalculator.getDelta({
        reset: true,
        shallow: options.shallow
      });
      const graph = deltaCalculator.getGraph();

      _this._deltaCalculators.set(graph, deltaCalculator);

      return graph;
    })();
  }

  getDelta(graph, _ref) {
    var _this2 = this;

    let reset = _ref.reset,
      shallow = _ref.shallow;
    return _asyncToGenerator(function*() {
      const deltaCalculator = _this2._deltaCalculators.get(graph);

      if (!deltaCalculator) {
        throw new Error("Graph not found");
      }

      return yield deltaCalculator.getDelta({
        reset,
        shallow
      });
    })();
  }

  listen(graph, callback) {
    const deltaCalculator = this._deltaCalculators.get(graph);

    if (!deltaCalculator) {
      throw new Error("Graph not found");
    }

    deltaCalculator.on("change", callback);
    return () => {
      deltaCalculator.removeListener("change", callback);
    };
  }

  endGraph(graph) {
    const deltaCalculator = this._deltaCalculators.get(graph);

    if (!deltaCalculator) {
      throw new Error("Graph not found");
    }

    deltaCalculator.end();

    this._deltaCalculators.delete(graph);
  }
}

module.exports = DeltaBundler;
