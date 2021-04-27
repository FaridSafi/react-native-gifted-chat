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

const AbstractConsumer = require("./AbstractConsumer");

const createConsumer = require("./createConsumer");

const _require = require("./constants"),
  FIRST_COLUMN = _require.FIRST_COLUMN,
  FIRST_LINE = _require.FIRST_LINE,
  EMPTY_POSITION = _require.EMPTY_POSITION;

const _require2 = require("./positionMath"),
  subtractOffsetFromPosition = _require2.subtractOffsetFromPosition;

const _require3 = require("./search"),
  greatestLowerBound = _require3.greatestLowerBound;

const _require4 = require("ob1"),
  add = _require4.add,
  get0 = _require4.get0,
  get1 = _require4.get1,
  add0 = _require4.add0,
  sub1 = _require4.sub1,
  sub = _require4.sub;

/**
 * A source map consumer that supports "indexed" source maps (that have a
 * `sections` field and no top-level mappings).
 */
class SectionsConsumer extends AbstractConsumer {
  constructor(sourceMap) {
    super(sourceMap);
    this._consumers = sourceMap.sections.map((section, index) => {
      const generatedOffset = {
        lines: add0(section.offset.line),
        columns: add0(section.offset.column)
      };
      const consumer = createConsumer(section.map);
      return [generatedOffset, consumer];
    });
  }

  originalPositionFor(generatedPosition) {
    const _ref = this._consumerForPosition(generatedPosition) || [],
      _ref2 = _slicedToArray(_ref, 2),
      generatedOffset = _ref2[0],
      consumer = _ref2[1];

    if (!consumer) {
      return EMPTY_POSITION;
    }

    return consumer.originalPositionFor(
      subtractOffsetFromPosition(generatedPosition, generatedOffset)
    );
  }

  *generatedMappings() {
    for (const _ref3 of this._consumers) {
      var _ref4 = _slicedToArray(_ref3, 2);

      const generatedOffset = _ref4[0];
      const consumer = _ref4[1];
      let first = true;

      for (const mapping of consumer.generatedMappings()) {
        if (
          first &&
          (get1(mapping.generatedLine) > 1 || get0(mapping.generatedColumn) > 0)
        ) {
          yield {
            generatedLine: FIRST_LINE,
            generatedColumn: FIRST_COLUMN,
            source: null,
            name: null,
            originalLine: null,
            originalColumn: null
          };
        }

        first = false;
        yield _objectSpread({}, mapping, {
          generatedLine: add(mapping.generatedLine, generatedOffset.lines),
          generatedColumn: add(mapping.generatedColumn, generatedOffset.columns)
        });
      }
    }
  }

  _consumerForPosition(generatedPosition) {
    const line = generatedPosition.line,
      column = generatedPosition.column;

    if (line == null || column == null) {
      return null;
    }

    const index = greatestLowerBound(
      this._consumers,
      generatedPosition,
      (position, _ref5) => {
        let _ref6 = _slicedToArray(_ref5, 1),
          offset = _ref6[0];

        const line0 = sub1(line);
        const column0 = column;

        if (line0 === offset.lines) {
          return get0(sub(column0, offset.columns));
        }

        return get0(sub(line0, offset.lines));
      }
    );
    return index != null ? this._consumers[index] : null;
  }
}

module.exports = SectionsConsumer;
