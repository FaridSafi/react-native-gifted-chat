/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */
"use strict"; // eslint-disable-next-line lint/flow-no-fixme
// $FlowFixMe: too hard to type, and they only have a .ts file.

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

const sourceMap = require("source-map");

function mergeSourceMaps(file, originalMap, secondMap) {
  const merged = new sourceMap.SourceMapGenerator();
  const inputMap = new sourceMap.SourceMapConsumer(originalMap);
  new sourceMap.SourceMapConsumer(secondMap).eachMapping(mapping => {
    const original = inputMap.originalPositionFor({
      line: mapping.originalLine,
      column: mapping.originalColumn
    });

    if (original.line == null) {
      return;
    }

    merged.addMapping({
      generated: {
        line: mapping.generatedLine,
        column: mapping.generatedColumn
      },
      original: {
        line: original.line,
        column: original.column || 0
      },
      source: file,
      name: original.name || mapping.name
    });
  });
  return _objectSpread({}, merged.toJSON(), {
    sources: inputMap.sources
  });
}

module.exports = mergeSourceMaps;
