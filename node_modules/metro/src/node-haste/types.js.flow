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

// TODO(cpojer): Create a jest-types repo.
export type HasteFS = {
  exists(filePath: string): boolean,
  getAllFiles(): Array<string>,
  getFileIterator(): Iterator<string>,
  getModuleName(filePath: string): ?string,
  getSha1(string): ?string,
  matchFiles(pattern: RegExp | string): Array<string>,
};
