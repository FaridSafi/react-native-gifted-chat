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

const canonicalize = require("metro-core/src/canonicalize");

const crypto = require("crypto");

function stableHash(value) {
  return (
    crypto
      .createHash("md4")
      /* $FlowFixMe(>=0.95.0 site=react_native_fb) This comment suppresses an
       * error found when Flow v0.95 was deployed. To see the error, delete this
       * comment and run Flow. */
      .update(JSON.stringify(value, canonicalize))
      .digest("buffer")
  );
}

module.exports = stableHash;
