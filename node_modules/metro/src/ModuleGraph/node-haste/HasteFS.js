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

const _require = require("path"),
  dirname = _require.dirname,
  join = _require.join,
  parse = _require.parse;

module.exports = class HasteFS {
  constructor(files) {
    this.directories = buildDirectorySet(files);
    this.directoryEntries = buildDirectoryEntries(files.map(parse));
    this.files = new Set(files);
  }

  closest(path, fileName) {
    const parsedPath = parse(path);
    const root = parsedPath.root;
    let dir = parsedPath.dir;

    do {
      const candidate = join(dir, fileName);

      if (this.files.has(candidate)) {
        return candidate;
      }

      dir = dirname(dir);
    } while (dir !== "." && dir !== root);

    return null;
  }

  dirExists(path) {
    return this.directories.has(path);
  }

  exists(path) {
    return this.files.has(path);
  }

  getAllFiles() {
    return Array.from(this.files.keys());
  }

  matchFiles() {
    throw new Error("HasteFS.matchFiles is not implemented yet.");
  }

  matches(directory, pattern) {
    const entries = this.directoryEntries.get(directory);
    return entries ? entries.filter(pattern.test, pattern) : [];
  }
};

function buildDirectorySet(files) {
  const directories = new Set();
  files.forEach(path => {
    const parsedPath = parse(path);
    const root = parsedPath.root;
    let dir = parsedPath.dir;

    while (dir !== "." && dir !== root && !directories.has(dir)) {
      directories.add(dir);
      dir = dirname(dir);
    }
  });
  return directories;
}

function buildDirectoryEntries(files) {
  const directoryEntries = new Map();
  files.forEach(_ref => {
    let base = _ref.base,
      dir = _ref.dir;
    const entries = directoryEntries.get(dir);

    if (entries) {
      entries.push(base);
    } else {
      directoryEntries.set(dir, [base]);
    }
  });
  return directoryEntries;
}
