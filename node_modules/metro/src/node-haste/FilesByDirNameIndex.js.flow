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

const path = require('path');

/**
 * This is a way to find files quickly given a RegExp, in a specific directory.
 * This is must faster than iterating over all the files and matching both
 * directory and RegExp at the same time.
 *
 * This was first implemented to support finding assets fast, for which we know
 * the directory, but we want to identify all variants (ex. @2x, @1x, for
 * a picture's different definition levels).
 */
class FilesByDirNameIndex {
  _filesByDirName: Map<string, Array<string>>;

  constructor(allFilePaths: Iterable<string>) {
    this._filesByDirName = new Map();

    for (const filePath of allFilePaths) {
      const dirName = path.dirname(filePath);
      let dir = this._filesByDirName.get(dirName);
      if (dir == null) {
        dir = [];
        this._filesByDirName.set(dirName, dir);
      }
      dir.push(path.basename(filePath));
    }
  }

  getAllFiles(dirPath: string): $ReadOnlyArray<string> {
    return this._filesByDirName.get(dirPath) || [];
  }
}

module.exports = FilesByDirNameIndex;
