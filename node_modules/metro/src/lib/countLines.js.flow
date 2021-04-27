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

const nullthrows = require('nullthrows');

const reLine = /^/gm;

function countLines(s: string): number {
  return nullthrows(s.match(reLine)).length;
}

module.exports = countLines;
