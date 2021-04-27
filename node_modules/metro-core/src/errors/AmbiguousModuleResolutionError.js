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

const DuplicateHasteCandidatesError = require("jest-haste-map").ModuleMap
  .DuplicateHasteCandidatesError;

class AmbiguousModuleResolutionError extends Error {
  constructor(fromModulePath, hasteError) {
    super(
      `Ambiguous module resolution from \`${fromModulePath}\`: ` +
        hasteError.message
    );
    this.fromModulePath = fromModulePath;
    this.hasteError = hasteError;
  }
}

module.exports = AmbiguousModuleResolutionError;
