/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
'use strict';

const denodeify = require('denodeify');
const fs = require('fs');
const throat = require('throat');

type WriteFn = (
  file: string,
  data: string | Buffer,
  encoding?: ?string,
) => Promise<mixed>;
const writeFile: WriteFn = throat(128, denodeify(fs.writeFile));

module.exports = writeFile;
