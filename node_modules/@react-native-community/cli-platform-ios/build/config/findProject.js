"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findProject;

function _glob() {
  const data = _interopRequireDefault(require("glob"));

  _glob = function () {
    return data;
  };

  return data;
}

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
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
 *
 */

/**
 * Glob pattern to look for xcodeproj
 */
const GLOB_PATTERN = '**/*.xcodeproj';
/**
 * Regexp matching all test projects
 */

const TEST_PROJECTS = /test|example|sample/i;
/**
 * Base iOS folder
 */

const IOS_BASE = 'ios';
/**
 * These folders will be excluded from search to speed it up
 */

const GLOB_EXCLUDE_PATTERN = ['**/@(Pods|node_modules|Carthage)/**'];
/**
 * Finds iOS project by looking for all .xcodeproj files
 * in given folder.
 *
 * Returns first match if files are found or null
 *
 * Note: `./ios/*.xcodeproj` are returned regardless of the name
 */

function findProject(folder) {
  const projects = _glob().default.sync(GLOB_PATTERN, {
    cwd: folder,
    ignore: GLOB_EXCLUDE_PATTERN
  }).filter(project => _path().default.dirname(project) === IOS_BASE || !TEST_PROJECTS.test(project)).sort(project => _path().default.dirname(project) === IOS_BASE ? -1 : 1);

  if (projects.length === 0) {
    return null;
  }

  return projects[0];
}