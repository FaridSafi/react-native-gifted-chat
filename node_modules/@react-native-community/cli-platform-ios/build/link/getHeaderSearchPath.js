"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getHeaderSearchPath;

function _path() {
  const data = require("path");

  _path = function () {
    return data;
  };

  return data;
}

function _lodash() {
  const data = require("lodash");

  _lodash = function () {
    return data;
  };

  return data;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Given an array of directories, it returns the one that contains
 * all the other directories in a given array inside it.
 *
 * Example:
 * Given an array of directories: ['/Users/Kureev/a', '/Users/Kureev/b']
 * the returned folder is `/Users/Kureev`
 *
 * Check `getHeaderSearchPath.spec.js` for more use-cases.
 */
const getOuterDirectory = directories => directories.reduce((topDir, currentDir) => {
  const currentFolders = currentDir.split(_path().posix.sep);
  const topMostFolders = topDir.split(_path().posix.sep);

  if (currentFolders.length === topMostFolders.length && (0, _lodash().last)(currentFolders) !== (0, _lodash().last)(topMostFolders)) {
    return currentFolders.slice(0, -1).join(_path().posix.sep);
  }

  return currentFolders.length < topMostFolders.length ? currentDir : topDir;
});
/**
 * Given an array of headers it returns search path so Xcode can resolve
 * headers when referenced like below:
 * ```
 * #import "CodePush.h"
 * ```
 * If all files are located in one directory (directories.length === 1),
 * we simply return a relative path to that location.
 *
 * Otherwise, we loop through them all to find the outer one that contains
 * all the headers inside. That location is then returned with /** appended at
 * the end so Xcode marks that location as `recursive` and will look inside
 * every folder of it to locate correct headers.
 */


function getHeaderSearchPath(sourceDir, headers) {
  const directories = (0, _lodash().union)(headers.map(_path().posix.dirname));
  return directories.length === 1 ? `"$(SRCROOT)/${_path().posix.relative(sourceDir, directories[0])}"` : `"$(SRCROOT)/${_path().posix.relative(sourceDir, getOuterDirectory(directories))}/**"`;
}