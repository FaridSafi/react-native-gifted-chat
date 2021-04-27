"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getGroup;

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const getFirstProject = project => project.getFirstProject().firstProject;

const findGroup = (groups, name) => groups.children.find(group => group.comment === name);
/**
 * Returns group from .xcodeproj if one exists, null otherwise
 *
 * Unlike node-xcode `pbxGroupByName` - it does not return `first-matching`
 * group if multiple groups with the same name exist
 *
 * If path is not provided, it returns top-level group
 */


function getGroup(project, path) {
  const firstProject = getFirstProject(project);
  let groups = project.getPBXGroupByKey(firstProject.mainGroup);

  if (!path) {
    return groups;
  }

  for (const name of path.split('/')) {
    const foundGroup = findGroup(groups, name);

    if (foundGroup) {
      groups = project.getPBXGroupByKey(foundGroup.value);
    } else {
      groups = null;
      break;
    }
  }

  return groups;
}