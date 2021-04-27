/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */
"use strict";

const _require = require("./util"),
  combineSourceMaps = _require.combineSourceMaps,
  combineSourceMapsAddingOffsets = _require.combineSourceMapsAddingOffsets,
  joinModules = _require.joinModules;

module.exports = _ref => {
  let fixWrapperOffset = _ref.fixWrapperOffset,
    lazyModules = _ref.lazyModules,
    moduleGroups = _ref.moduleGroups,
    startupModules = _ref.startupModules;
  const options = fixWrapperOffset
    ? {
        fixWrapperOffset: true
      }
    : undefined;
  const startupModule = {
    code: joinModules(startupModules),
    id: Number.MIN_SAFE_INTEGER,
    map: combineSourceMaps(startupModules, undefined, options),
    sourcePath: ""
  }; // Add map of module id -> source to sourcemap

  const module_paths = [];
  startupModules.forEach(m => {
    module_paths[m.id] = m.sourcePath;
  });
  lazyModules.forEach(m => {
    module_paths[m.id] = m.sourcePath;
  });
  const map = combineSourceMapsAddingOffsets(
    [startupModule].concat(lazyModules),
    module_paths,
    moduleGroups,
    options
  );

  if (map.x_facebook_offsets != null) {
    delete map.x_facebook_offsets[Number.MIN_SAFE_INTEGER];
  }

  return map;
};
