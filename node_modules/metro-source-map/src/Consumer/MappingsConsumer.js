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

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
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

const AbstractConsumer = require("./AbstractConsumer");

const invariant = require("invariant");

const normalizeSourcePath = require("./normalizeSourcePath");

const _require = require("./constants"),
  FIRST_COLUMN = _require.FIRST_COLUMN,
  FIRST_LINE = _require.FIRST_LINE,
  GREATEST_LOWER_BOUND = _require.GREATEST_LOWER_BOUND,
  EMPTY_POSITION = _require.EMPTY_POSITION,
  lookupBiasToString = _require.lookupBiasToString;

const _require2 = require("./search"),
  greatestLowerBound = _require2.greatestLowerBound;

const _require3 = require("ob1"),
  add = _require3.add,
  get0 = _require3.get0,
  add0 = _require3.add0,
  sub = _require3.sub,
  inc = _require3.inc;

const _require4 = require("vlq"),
  decodeVlq = _require4.decode;

/**
 * A source map consumer that supports "basic" source maps (that have a
 * `mappings` field and no sections).
 */
class MappingsConsumer extends AbstractConsumer {
  constructor(sourceMap) {
    super(sourceMap);
    this._sourceMap = sourceMap;
    this._decodedMappings = null;
    this._normalizedSources = null;
  }

  originalPositionFor(generatedPosition) {
    const line = generatedPosition.line,
      column = generatedPosition.column;

    if (line == null || column == null) {
      return _objectSpread({}, EMPTY_POSITION);
    }

    if (generatedPosition.bias != null) {
      invariant(
        generatedPosition.bias === GREATEST_LOWER_BOUND,
        `Unimplemented lookup bias: ${lookupBiasToString(
          generatedPosition.bias
        )}`
      );
    }

    const mappings = this._decodeAndCacheMappings();

    const index = greatestLowerBound(
      mappings,
      {
        line,
        column
      },
      (position, mapping) => {
        if (position.line === mapping.generatedLine) {
          return get0(sub(position.column, mapping.generatedColumn));
        }

        return get0(sub(position.line, mapping.generatedLine));
      }
    );

    if (
      index != null &&
      mappings[index].generatedLine === generatedPosition.line
    ) {
      const mapping = mappings[index];
      return {
        source: mapping.source,
        name: mapping.name,
        line: mapping.originalLine,
        column: mapping.originalColumn
      };
    }

    return _objectSpread({}, EMPTY_POSITION);
  }

  *_decodeMappings() {
    let generatedLine = FIRST_LINE;
    let generatedColumn = FIRST_COLUMN;
    let originalLine = FIRST_LINE;
    let originalColumn = FIRST_COLUMN;
    let nameIndex = add0(0);
    let sourceIndex = add0(0);

    const normalizedSources = this._normalizeAndCacheSources();

    const _this$_sourceMap = this._sourceMap,
      mappingsRaw = _this$_sourceMap.mappings,
      names = _this$_sourceMap.names;
    let next;
    const vlqCache = new Map();

    for (let i = 0; i < mappingsRaw.length; i = next) {
      switch (mappingsRaw[i]) {
        case ";":
          generatedLine = inc(generatedLine);
          generatedColumn = FIRST_COLUMN;

        /* falls through */

        case ",":
          next = i + 1;
          continue;
      }

      findNext: for (next = i + 1; next < mappingsRaw.length; ++next) {
        switch (mappingsRaw[next]) {
          case ";":
          /* falls through */

          case ",":
            break findNext;
        }
      }

      const mappingRaw = mappingsRaw.slice(i, next);
      let decodedVlqValues;

      if (vlqCache.has(mappingRaw)) {
        decodedVlqValues = vlqCache.get(mappingRaw);
      } else {
        decodedVlqValues = decodeVlq(mappingRaw);
        vlqCache.set(mappingRaw, decodedVlqValues);
      }

      invariant(Array.isArray(decodedVlqValues), "Decoding VLQ tuple failed");

      const _decodedVlqValues = decodedVlqValues,
        _decodedVlqValues2 = _slicedToArray(_decodedVlqValues, 5),
        generatedColumnDelta = _decodedVlqValues2[0],
        sourceIndexDelta = _decodedVlqValues2[1],
        originalLineDelta = _decodedVlqValues2[2],
        originalColumnDelta = _decodedVlqValues2[3],
        nameIndexDelta = _decodedVlqValues2[4];

      decodeVlq(mappingRaw);
      invariant(generatedColumnDelta != null, "Invalid generated column delta");
      generatedColumn = add(generatedColumn, generatedColumnDelta);
      const mapping = {
        generatedLine,
        generatedColumn,
        source: null,
        name: null,
        originalLine: null,
        originalColumn: null
      };

      if (sourceIndexDelta != null) {
        sourceIndex = add(sourceIndex, sourceIndexDelta);
        mapping.source = normalizedSources[get0(sourceIndex)];
        invariant(originalLineDelta != null, "Invalid original line delta");
        invariant(originalColumnDelta != null, "Invalid original column delta");
        originalLine = add(originalLine, originalLineDelta);
        originalColumn = add(originalColumn, originalColumnDelta);
        mapping.originalLine = originalLine;
        mapping.originalColumn = originalColumn;

        if (nameIndexDelta != null) {
          nameIndex = add(nameIndex, nameIndexDelta);
          mapping.name = names[get0(nameIndex)];
        }
      }

      yield mapping;
    }
  }

  _normalizeAndCacheSources() {
    if (!this._normalizedSources) {
      this._normalizedSources = this._sourceMap.sources.map(source =>
        normalizeSourcePath(source, this._sourceMap)
      );
    }

    return this._normalizedSources;
  }

  _decodeAndCacheMappings() {
    if (!this._decodedMappings) {
      this._decodedMappings = _toConsumableArray(this._decodeMappings());
    }

    return this._decodedMappings;
  }

  generatedMappings() {
    return this._decodeAndCacheMappings();
  }
}

module.exports = MappingsConsumer;
