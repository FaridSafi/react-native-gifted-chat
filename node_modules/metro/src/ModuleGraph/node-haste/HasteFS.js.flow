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

const {dirname, join, parse} = require('path');

type pathParseResult = {
  root: string,
  dir: string,
  base: string,
  ext: string,
  name: string,
};

module.exports = class HasteFS {
  directories: Set<string>;
  directoryEntries: Map<string, Array<string>>;
  files: Set<string>;

  constructor(files: Array<string>) {
    this.directories = buildDirectorySet(files);
    this.directoryEntries = buildDirectoryEntries(files.map(parse));
    this.files = new Set(files);
  }

  closest(path: string, fileName: string): ?string {
    const parsedPath = parse(path);
    const root = parsedPath.root;
    let dir = parsedPath.dir;
    do {
      const candidate = join(dir, fileName);
      if (this.files.has(candidate)) {
        return candidate;
      }
      dir = dirname(dir);
    } while (dir !== '.' && dir !== root);
    return null;
  }

  dirExists(path: string): boolean {
    return this.directories.has(path);
  }

  exists(path: string): boolean {
    return this.files.has(path);
  }

  getAllFiles(): Array<string> {
    return Array.from<string>(this.files.keys());
  }

  matchFiles() {
    throw new Error('HasteFS.matchFiles is not implemented yet.');
  }

  matches(directory: string, pattern: RegExp): Array<string> {
    const entries = this.directoryEntries.get(directory);

    return entries ? entries.filter(pattern.test, pattern) : [];
  }
};

function buildDirectorySet(files: Array<string>): Set<string> {
  const directories = new Set();
  files.forEach((path: string) => {
    const parsedPath = parse(path);
    const root = parsedPath.root;
    let dir = parsedPath.dir;
    while (dir !== '.' && dir !== root && !directories.has(dir)) {
      directories.add(dir);
      dir = dirname(dir);
    }
  });
  return directories;
}

function buildDirectoryEntries(
  files: Array<pathParseResult>,
): Map<string, Array<string>> {
  const directoryEntries = new Map();
  files.forEach(({base, dir}) => {
    const entries = directoryEntries.get(dir);
    if (entries) {
      entries.push(base);
    } else {
      directoryEntries.set(dir, [base]);
    }
  });
  return directoryEntries;
}
