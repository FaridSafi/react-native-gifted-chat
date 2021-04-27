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

import type {FileAndDirCandidates} from './types';

class FailedToResolvePathError extends Error {
  candidates: FileAndDirCandidates;

  constructor(candidates: FileAndDirCandidates) {
    super(
      'The module could not be resolved because none of these files exist:\n\n' +
        `  * ${formatFileCandidates(candidates.file)}\n` +
        `  * ${formatFileCandidates(candidates.dir)}`,
    );
    this.candidates = candidates;
  }
}

module.exports = FailedToResolvePathError;
