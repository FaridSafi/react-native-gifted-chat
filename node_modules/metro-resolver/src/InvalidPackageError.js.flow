/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 * @format
 */

'use strict';

const formatFileCandidates = require('./formatFileCandidates');

import type {FileCandidates} from './types';

class InvalidPackageError extends Error {
  /**
   * The file candidates we tried to find to resolve the `main` field of the
   * package. Ex. `/js/foo/beep(.js|.json)?` if `main` is specifying `./beep`
   * as the entry point.
   */
  fileCandidates: FileCandidates;
  /**
   * The 'index' file candidates we tried to find to resolve the `main` field of
   * the package. Ex. `/js/foo/beep/index(.js|.json)?` if `main` is specifying
   * `./beep` as the entry point.
   */
  indexCandidates: FileCandidates;
  /**
   * The module path prefix we where trying to resolve. For example './beep'.
   */
  mainPrefixPath: string;
  /**
   * Full path the package we were trying to resolve.
   * Ex. `/js/foo/package.json`.
   */
  packageJsonPath: string;

  constructor(opts: {|
    +fileCandidates: FileCandidates,
    +indexCandidates: FileCandidates,
    +mainPrefixPath: string,
    +packageJsonPath: string,
  |}) {
    super(
      `The package \`${opts.packageJsonPath}\` is invalid because it ` +
        'specifies a `main` module field that could not be resolved (' +
        `\`${opts.mainPrefixPath}\`. None of these files exist:\n\n` +
        `  * ${formatFileCandidates(opts.fileCandidates)}\n` +
        `  * ${formatFileCandidates(opts.indexCandidates)}`,
    );
    Object.assign(this, opts);
  }
}

module.exports = InvalidPackageError;
