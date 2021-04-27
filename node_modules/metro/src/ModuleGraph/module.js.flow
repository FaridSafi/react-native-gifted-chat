/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */
'use strict';

import type {Module} from './types.flow';

exports.empty = (): Module => virtual('', '/<generated>/empty.js');

// creates a virtual module (i.e. not corresponding to a file on disk)
// with the given source code.
const virtual = (code: string, filePath: string): Module => ({
  dependencies: [],
  file: {
    code,
    map: null,
    functionMap: null,
    path: filePath,
    type: 'script',
    libraryIdx: null,
  },
});

exports.virtual = virtual;
