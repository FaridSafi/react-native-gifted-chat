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

const path = require("path");

class FailedToResolveNameError extends Error {
  constructor(dirPaths, extraPaths) {
    const displayDirPaths = dirPaths.concat(extraPaths);
    const hint = displayDirPaths.length ? " or in these directories:" : "";
    super(
      `Module does not exist in the Haste module map${hint}\n` +
        displayDirPaths
          .map(dirPath => `  ${path.dirname(dirPath)}\n`)
          .join(", ") +
        "\n"
    );
    this.dirPaths = dirPaths;
    this.extraPaths = extraPaths;
  }
}

module.exports = FailedToResolveNameError;
