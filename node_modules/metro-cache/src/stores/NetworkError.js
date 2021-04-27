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

class NetworkError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

module.exports = NetworkError;
