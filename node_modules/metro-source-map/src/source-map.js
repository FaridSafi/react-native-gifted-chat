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

const Consumer = require("./Consumer");

const Generator = require("./Generator");

const SourceMap = require("source-map");

// We need to export this for `metro-symbolicate`
const normalizeSourcePath = require("./Consumer/normalizeSourcePath");

const composeSourceMaps = require("./composeSourceMaps");

const _require = require("./BundleBuilder"),
  createIndexMap = _require.createIndexMap,
  BundleBuilder = _require.BundleBuilder;

const _require2 = require("./generateFunctionMap"),
  generateFunctionMap = _require2.generateFunctionMap;

function fromRawMappingsImpl(isBlocking, onDone, modules, offsetLines) {
  const modulesToProcess = modules.slice();
  const generator = new Generator();
  let carryOver = offsetLines;

  function processNextModule() {
    if (modulesToProcess.length === 0) {
      return true;
    }

    const mod = modulesToProcess.shift();
    const code = mod.code,
      map = mod.map;

    if (Array.isArray(map)) {
      addMappingsForFile(generator, map, mod, carryOver);
    } else if (map != null) {
      throw new Error(
        `Unexpected module with full source map found: ${mod.path}`
      );
    }

    carryOver = carryOver + countLines(code);
    return false;
  }

  function workLoop() {
    const time = process.hrtime();

    while (true) {
      const isDone = processNextModule();

      if (isDone) {
        onDone(generator);
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
/**
 * Creates a source map from modules with "raw mappings", i.e. an array of
 * tuples with either 2, 4, or 5 elements:
 * generated line, generated column, source line, source line, symbol name.
 * Accepts an `offsetLines` argument in case modules' code is to be offset in
 * the resulting bundle, e.g. by some prefix code.
 */

function fromRawMappings(modules) {
  let offsetLines =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let generator;
  fromRawMappingsImpl(
    true,
    g => {
      generator = g;
    },
    modules,
    offsetLines
  );

  if (generator == null) {
    throw new Error("Expected fromRawMappingsImpl() to finish synchronously.");
  }

  return generator;
}

function fromRawMappingsNonBlocking(_x) {
  return _fromRawMappingsNonBlocking.apply(this, arguments);
}
/**
 * Transforms a standard source map object into a Raw Mappings object, to be
 * used across the bundler.
 */

function _fromRawMappingsNonBlocking() {
  _fromRawMappingsNonBlocking = _asyncToGenerator(function*(modules) {
    let offsetLines =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return new Promise(resolve => {
      fromRawMappingsImpl(false, resolve, modules, offsetLines);
    });
  });
  return _fromRawMappingsNonBlocking.apply(this, arguments);
}

function toBabelSegments(sourceMap) {
  const rawMappings = [];
  new SourceMap.SourceMapConsumer(sourceMap).eachMapping(map => {
    rawMappings.push({
      generated: {
        line: map.generatedLine,
        column: map.generatedColumn
      },
      original: {
        line: map.originalLine,
        column: map.originalColumn
      },
      source: map.source,
      name: map.name
    });
  });
  return rawMappings;
}

function toSegmentTuple(mapping) {
  const _mapping$generated = mapping.generated,
    column = _mapping$generated.column,
    line = _mapping$generated.line;
  const name = mapping.name,
    original = mapping.original;

  if (original == null) {
    return [line, column];
  }

  if (typeof name !== "string") {
    return [line, column, original.line, original.column];
  }

  return [line, column, original.line, original.column, name];
}

function addMappingsForFile(generator, mappings, module, carryOver) {
  generator.startFile(module.path, module.source, module.functionMap);

  for (let i = 0, n = mappings.length; i < n; ++i) {
    addMapping(generator, mappings[i], carryOver);
  }

  generator.endFile();
}

function addMapping(generator, mapping, carryOver) {
  const n = mapping.length;
  const line = mapping[0] + carryOver; // lines start at 1, columns start at 0

  const column = mapping[1];

  if (n === 2) {
    generator.addSimpleMapping(line, column);
  } else if (n === 4) {
    const sourceMap = mapping;
    generator.addSourceMapping(line, column, sourceMap[2], sourceMap[3]);
  } else if (n === 5) {
    const sourceMap = mapping;
    generator.addNamedSourceMapping(
      line,
      column,
      sourceMap[2],
      sourceMap[3],
      sourceMap[4]
    );
  } else {
    throw new Error(`Invalid mapping: [${mapping.join(", ")}]`);
  }
}

function countLines(string) {
  return string.split("\n").length;
}

module.exports = {
  BundleBuilder,
  composeSourceMaps,
  Consumer,
  createIndexMap,
  generateFunctionMap,
  fromRawMappings,
  fromRawMappingsNonBlocking,
  normalizeSourcePath,
  toBabelSegments,
  toSegmentTuple
};
