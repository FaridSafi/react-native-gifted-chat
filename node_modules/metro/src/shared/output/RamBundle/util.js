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

const invariant = require("invariant");

const newline = /\r\n?|\n|\u2028|\u2029/g; // fastest implementation

const countLines = string => (string.match(newline) || []).length + 1;

function lineToLineSourceMap(source) {
  let filename =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  // The first line mapping in our package is the base64vlq code for zeros (A).
  const firstLine = "AAAA;"; // Most other lines in our mappings are all zeros (for module, column etc)
  // except for the lineno mapping: curLineno - prevLineno = 1; Which is C.

  const line = "AACA;";
  return {
    file: filename,
    mappings: firstLine + Array(countLines(source)).join(line),
    sources: [filename],
    names: [],
    version: 3
  };
}

const wrapperEnd = wrappedCode => wrappedCode.indexOf("{") + 1;

const Section = (line, column, map) => ({
  map,
  offset: {
    line,
    column
  }
});

function combineSourceMaps(modules, moduleGroups, options) {
  const sections = combineMaps(modules, null, moduleGroups, options);
  return {
    sections,
    version: 3
  };
}

function combineSourceMapsAddingOffsets(
  modules,
  x_metro_module_paths,
  moduleGroups,
  options
) {
  const x_facebook_offsets = [];
  const sections = combineMaps(
    modules,
    x_facebook_offsets,
    moduleGroups,
    options
  );
  return {
    sections,
    version: 3,
    x_facebook_offsets,
    x_metro_module_paths
  };
}

function combineMaps(modules, offsets, moduleGroups, options) {
  const sections = [];
  let line = 0;
  modules.forEach(moduleTransport => {
    const code = moduleTransport.code,
      id = moduleTransport.id,
      name = moduleTransport.name;
    let column = 0;
    let group;
    let groupLines = 0;
    let map = moduleTransport.map;

    if (moduleGroups && moduleGroups.modulesInGroups.has(id)) {
      // this is a module appended to another module
      return;
    }

    if (offsets != null) {
      group = moduleGroups && moduleGroups.groups.get(id);

      if (group && moduleGroups) {
        const modulesById = moduleGroups.modulesById;
        const otherModules = Array.from(group || [])
          .map(moduleId => modulesById.get(moduleId))
          .filter(Boolean); // needed to appease flow

        otherModules.forEach(m => {
          groupLines += countLines(m.code);
        });
        map = combineSourceMaps([moduleTransport].concat(otherModules));
      }

      column = options && options.fixWrapperOffset ? wrapperEnd(code) : 0;
    }

    invariant(
      !Array.isArray(map),
      "Random Access Bundle source maps cannot be built from raw mappings"
    );
    sections.push(
      Section(line, column, map || lineToLineSourceMap(code, name))
    );

    if (offsets != null && id != null) {
      offsets[id] = line;

      for (const moduleId of group || []) {
        offsets[moduleId] = line;
      }
    }

    line += countLines(code) + groupLines;
  });
  return sections;
}

const joinModules = modules => modules.map(m => m.code).join("\n");

module.exports = {
  combineSourceMaps,
  combineSourceMapsAddingOffsets,
  countLines,
  joinModules,
  lineToLineSourceMap
};
