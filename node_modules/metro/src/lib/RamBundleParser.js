/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict
 */
"use strict";

const MAGIC_NUMBER = require("../shared/output/RamBundle/magic-number");

const SIZEOF_UINT32 = 4;
const HEADER_SIZE = 3;
/**
 * Implementation of a RAM bundle parser in JS.
 *
 * It receives a Buffer as an input and implements two main methods, which are
 * able to run in constant time no matter the size of the bundle:
 *
 * getStartupCode(): returns the runtime and the startup code of the bundle.
 * getModule(): returns the code for the specified module.
 */

class RamBundleParser {
  constructor(buffer) {
    this._buffer = buffer;

    if (this._readPosition(0) !== MAGIC_NUMBER) {
      throw new Error("File is not a RAM bundle file");
    }

    this._numModules = this._readPosition(1);
    this._startupCodeLength = this._readPosition(2); // The startup code begins after the table of contents, which contains the
    // 3 fields on the header plus 2 entries per module.

    this._startOffset = (HEADER_SIZE + this._numModules * 2) * SIZEOF_UINT32;
  }

  _readPosition(pos) {
    return this._buffer.readUInt32LE(pos * SIZEOF_UINT32);
  }

  getStartupCode() {
    const start = this._startOffset;
    const end = start + this._startupCodeLength - 1;
    return this._buffer.toString("utf8", start, end);
  }

  getModule(id) {
    const moduleOffset = this._readPosition(HEADER_SIZE + id * 2);

    const moduleLength = this._readPosition(HEADER_SIZE + id * 2 + 1);

    const start = this._startOffset + moduleOffset;
    const end = start + moduleLength - 1;
    return this._buffer.toString("utf8", start, end);
  }
}

module.exports = RamBundleParser;
