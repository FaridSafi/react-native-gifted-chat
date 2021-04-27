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

class InvalidPackageError extends Error {
  /**
   * The file candidates we tried to find to resolve the `main` field of the
   * package. Ex. `/js/foo/beep(.js|.json)?` if `main` is specifying `./beep`
   * as the entry point.
   */

  /**
   * The 'index' file candidates we tried to find to resolve the `main` field of
   * the package. Ex. `/js/foo/beep/index(.js|.json)?` if `main` is specifying
   * `./beep` as the entry point.
   */

  /**
   * The module path prefix we where trying to resolve. For example './beep'.
   */

  /**
   * Full path the package we were trying to resolve.
   * Ex. `/js/foo/package.json`.
   */
  constructor(opts) {
    super(
      `The package \`${opts.packageJsonPath}\` is invalid because it ` +
        "specifies a `main` module field that could not be resolved (" +
        `\`${opts.mainPrefixPath}\`. None of these files exist:\n\n` +
        `  * ${formatFileCandidates(opts.fileCandidates)}\n` +
        `  * ${formatFileCandidates(opts.indexCandidates)}`
    );
    Object.assign(this, opts);
  }
}

module.exports = InvalidPackageError;
