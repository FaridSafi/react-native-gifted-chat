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

const _require = require("stream"),
  Writable = _require.Writable;

class JsonReporter {
  constructor(stream) {
    this._stream = stream;
  }
  /**
   * There is a special case for errors because they have non-enumerable fields.
   * (Perhaps we should switch in favor of plain object?)
   */

  update(event) {
    if (Object.prototype.toString.call(event.error) === "[object Error]") {
      event = Object.assign(event, {
        message: event.error.message,
        stack: event.error.stack
      });
    }

    this._stream.write(JSON.stringify(event) + "\n");
  }
}

module.exports = JsonReporter;
