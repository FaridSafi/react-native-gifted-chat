"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findSymlinkedModules;

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Find symlinked modules inside "node_modules."
 *
 * Naively, we could just perform a depth-first search of all folders in
 * node_modules, recursing when we find a symlink.
 *
 * We can be smarter than this due to our knowledge of how npm/Yarn lays out
 * "node_modules" / how tools that build on top of npm/Yarn (such as Lerna)
 * install dependencies.
 *
 * Starting from a given root node_modules folder, this algorithm will look at
 * both the top level descendants of the node_modules folder or second level
 * descendants of folders that start with "@" (which indicates a scoped
 * package). If any of those folders is a symlink, it will recurse into the
 * link, and perform the same search in the linked folder.
 *
 * The end result should be a list of all resolved module symlinks for a given
 * root.
 */
function findSymlinkedModules(projectRoot, ignoredRoots = []) {
  const nodeModuleRoot = _path().default.join(projectRoot, 'node_modules');

  const resolvedSymlinks = findModuleSymlinks(nodeModuleRoot, [...ignoredRoots, projectRoot]);
  return resolvedSymlinks;
}

function findModuleSymlinks(modulesPath, ignoredPaths = []) {
  if (!_fs().default.existsSync(modulesPath)) {
    return [];
  } // Find module symlinks


  const moduleFolders = _fs().default.readdirSync(modulesPath);

  const symlinks = moduleFolders.reduce((links, folderName) => {
    const folderPath = _path().default.join(modulesPath, folderName);

    const maybeSymlinkPaths = [];

    if (folderName.startsWith('@')) {
      const scopedModuleFolders = _fs().default.readdirSync(folderPath);

      maybeSymlinkPaths.push(...scopedModuleFolders.map(name => _path().default.join(folderPath, name)));
    } else {
      maybeSymlinkPaths.push(folderPath);
    }

    return links.concat(resolveSymlinkPaths(maybeSymlinkPaths, ignoredPaths));
  }, []); // For any symlinks found, look in _that_ modules node_modules directory
  // and find any symlinked modules

  const nestedSymlinks = symlinks.reduce((links, symlinkPath) => links.concat( // We ignore any found symlinks or anything from the ignored list,
  findModuleSymlinks(_path().default.join(symlinkPath, 'node_modules'), [...ignoredPaths, ...symlinks])), []);
  return [...new Set([...symlinks, ...nestedSymlinks])];
}

function resolveSymlinkPaths(maybeSymlinkPaths, ignoredPaths) {
  return maybeSymlinkPaths.reduce((links, maybeSymlinkPath) => {
    if (_fs().default.lstatSync(maybeSymlinkPath).isSymbolicLink()) {
      const resolved = _path().default.resolve(_path().default.dirname(maybeSymlinkPath), _fs().default.readlinkSync(maybeSymlinkPath));

      if (ignoredPaths.indexOf(resolved) === -1 && _fs().default.existsSync(resolved)) {
        links.push(resolved);
      }
    }

    return links;
  }, []);
}