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

const _require = require("console"),
  Console = _require.Console;

const _require2 = require("stream"),
  Writable = _require2.Writable;
/* $FlowFixMe(>=0.97.0 site=react_native_fb) This comment suppresses an error
 * found when Flow v0.97 was deployed. To see the error delete this comment and
 * run Flow. */

const write = (_, __, callback) => callback();

module.exports = new Console(
  new Writable({
    write,
    writev: write
  })
);
