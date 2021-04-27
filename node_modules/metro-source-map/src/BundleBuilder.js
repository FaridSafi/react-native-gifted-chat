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

const EMPTY_MAP = {
  version: 3,
  sources: [],
  names: [],
  mappings: "A"
};
/**
 * Builds a source-mapped bundle by concatenating strings and their
 * corresponding source maps (if any).
 *
 * Usage:
 *
 * const builder = new BundleBuilder('bundle.js');
 * builder
 *   .append('foo\n', fooMap)
 *   .append('bar\n')
 *   // ...
 * const code = builder.getCode();
 * const map = builder.getMap();
 */

class BundleBuilder {
  constructor(file) {
    this._file = file;
    this._sections = [];
    this._line = 0;
    this._column = 0;
    this._code = "";
    this._afterMappedContent = false;
  }

  _pushMapSection(map) {
    this._sections.push({
      map,
      offset: {
        column: this._column,
        line: this._line
      }
    });
  }

  _endMappedContent() {
    if (this._afterMappedContent) {
      this._pushMapSection(EMPTY_MAP);

      this._afterMappedContent = false;
    }
  }

  append(code, map) {
    if (!code.length) {
      return this;
    }

    const _measureString = measureString(code),
      lineBreaks = _measureString.lineBreaks,
      lastLineColumns = _measureString.lastLineColumns;

    if (map) {
      this._pushMapSection(map);

      this._afterMappedContent = true;
    } else {
      this._endMappedContent();
    }

    this._afterMappedContent = !!map;
    this._line = this._line + lineBreaks;

    if (lineBreaks > 0) {
      this._column = lastLineColumns;
    } else {
      this._column = this._column + lastLineColumns;
    }

    this._code = this._code + code;
    return this;
  }

  getMap() {
    this._endMappedContent();

    return createIndexMap(this._file, this._sections);
  }

  getCode() {
    return this._code;
  }
}

const reLineBreak = /\r\n|\r|\n/g;

function measureString(str) {
  let lineBreaks = 0;
  let match;
  let lastLineStart = 0;

  while ((match = reLineBreak.exec(str))) {
    ++lineBreaks;
    lastLineStart = match.index + match[0].length;
  }

  const lastLineColumns = str.length - lastLineStart;
  return {
    lineBreaks,
    lastLineColumns
  };
}

function createIndexMap(file, sections) {
  return {
    version: 3,
    file,
    sections
  };
}

module.exports = {
  BundleBuilder,
  createIndexMap
};
