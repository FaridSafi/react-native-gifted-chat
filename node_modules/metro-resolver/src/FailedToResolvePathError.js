/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 * @format
 */
"use strict";

const formatFileCandidates = require("./formatFileCandidates");

class FailedToResolvePathError extends Error {
  constructor(candidates) {
    super(
      "The module could not be resolved because none of these files exist:\n\n" +
        `  * ${formatFileCandidates(candidates.file)}\n` +
        `  * ${formatFileCandidates(candidates.dir)}`
    );
    this.candidates = candidates;
  }
}

module.exports = FailedToResolvePathError;
