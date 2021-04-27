/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */
"use strict";

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === "[object Arguments]"
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)
      arr2[i] = arr[i];
    return arr2;
  }
}

const MAGIC_UNBUNDLE_FILE_HEADER = require("./magic-number");

const buildSourcemapWithMetadata = require("./buildSourcemapWithMetadata");

const fs = require("fs");

const relativizeSourceMapInline = require("../../../lib/relativizeSourceMap");

const writeSourceMap = require("./write-sourcemap");

const _require = require("./util"),
  joinModules = _require.joinModules;

const SIZEOF_UINT32 = 4;
/**
 * Saves all JS modules of an app as a single file, separated with null bytes.
 * The file begins with an offset table that contains module ids and their
 * lengths/offsets.
 * The module id for the startup code (prelude, polyfills etc.) is the
 * empty string.
 */

function saveAsIndexedFile(bundle, options, log) {
  const bundleOutput = options.bundleOutput,
    encoding = options.bundleEncoding,
    sourcemapOutput = options.sourcemapOutput,
    sourcemapSourcesRoot = options.sourcemapSourcesRoot;
  log("start");
  const startupModules = bundle.startupModules,
    lazyModules = bundle.lazyModules,
    groups = bundle.groups;
  log("finish");
  const moduleGroups = createModuleGroups(groups, lazyModules);
  const startupCode = joinModules(startupModules);
  log("Writing unbundle output to:", bundleOutput);
  const writeUnbundle = writeBuffers(
    fs.createWriteStream(bundleOutput),
    buildTableAndContents(startupCode, lazyModules, moduleGroups, encoding)
  ).then(() => log("Done writing unbundle output"));

  if (sourcemapOutput) {
    const sourceMap = buildSourcemapWithMetadata({
      startupModules: startupModules.concat(),
      lazyModules: lazyModules.concat(),
      moduleGroups,
      fixWrapperOffset: true
    });

    if (sourcemapSourcesRoot !== undefined) {
      relativizeSourceMapInline(sourceMap, sourcemapSourcesRoot);
    }

    const wroteSourceMap = writeSourceMap(
      sourcemapOutput,
      JSON.stringify(sourceMap),
      log
    );
    return Promise.all([writeUnbundle, wroteSourceMap]);
  } else {
    return writeUnbundle;
  }
}
/* global Buffer: true */

const fileHeader = Buffer.alloc(4);
fileHeader.writeUInt32LE(MAGIC_UNBUNDLE_FILE_HEADER, 0);
const nullByteBuffer = Buffer.alloc(1).fill(0);

function writeBuffers(stream, buffers) {
  buffers.forEach(buffer => stream.write(buffer));
  return new Promise((resolve, reject) => {
    stream.on("error", reject);
    stream.on("finish", () => resolve());
    stream.end();
  });
}

function nullTerminatedBuffer(contents, encoding) {
  return Buffer.concat([Buffer.from(contents, encoding), nullByteBuffer]);
}

function moduleToBuffer(id, code, encoding) {
  return {
    id,
    buffer: nullTerminatedBuffer(code, encoding)
  };
}

function entryOffset(n) {
  // 2: num_entries + startup_code_len
  // n * 2: each entry consists of two uint32s
  return (2 + n * 2) * SIZEOF_UINT32;
}

function buildModuleTable(startupCode, moduleBuffers, moduleGroups) {
  // table format:
  // - num_entries:      uint_32  number of entries
  // - startup_code_len: uint_32  length of the startup section
  // - entries:          entry...
  //
  // entry:
  //  - module_offset:   uint_32  offset into the modules blob
  //  - module_length:   uint_32  length of the module code in bytes
  const moduleIds = _toConsumableArray(moduleGroups.modulesById.keys());

  const maxId = moduleIds.reduce((max, id) => Math.max(max, id));
  const numEntries = maxId + 1;
  const table = Buffer.alloc(entryOffset(numEntries)).fill(0); // num_entries

  table.writeUInt32LE(numEntries, 0); // startup_code_len

  table.writeUInt32LE(startupCode.length, SIZEOF_UINT32); // entries

  let codeOffset = startupCode.length;
  moduleBuffers.forEach(_ref => {
    let id = _ref.id,
      buffer = _ref.buffer;
    const group = moduleGroups.groups.get(id);
    const idsInGroup = group ? [id].concat(Array.from(group)) : [id];
    idsInGroup.forEach(moduleId => {
      const offset = entryOffset(moduleId); // module_offset

      table.writeUInt32LE(codeOffset, offset); // module_length

      table.writeUInt32LE(buffer.length, offset + SIZEOF_UINT32);
    });
    codeOffset += buffer.length;
  });
  return table;
}

function groupCode(rootCode, moduleGroup, modulesById) {
  if (!moduleGroup || !moduleGroup.size) {
    return rootCode;
  }

  const code = [rootCode];

  for (const id of moduleGroup) {
    code.push(
      (
        modulesById.get(id) || {
          code: ""
        }
      ).code
    );
  }

  return code.join("\n");
}

function buildModuleBuffers(modules, moduleGroups, encoding) {
  return modules
    .filter(m => !moduleGroups.modulesInGroups.has(m.id))
    .map(_ref2 => {
      let id = _ref2.id,
        code = _ref2.code;
      return moduleToBuffer(
        id,
        groupCode(code, moduleGroups.groups.get(id), moduleGroups.modulesById),
        encoding
      );
    });
}

function buildTableAndContents(startupCode, modules, moduleGroups, encoding) {
  // file contents layout:
  // - magic number      char[4]  0xE5 0xD1 0x0B 0xFB (0xFB0BD1E5 uint32 LE)
  // - offset table      table    see `buildModuleTables`
  // - code blob         char[]   null-terminated code strings, starting with
  //                              the startup code
  const startupCodeBuffer = nullTerminatedBuffer(startupCode, encoding);
  const moduleBuffers = buildModuleBuffers(modules, moduleGroups, encoding);
  const table = buildModuleTable(
    startupCodeBuffer,
    moduleBuffers,
    moduleGroups
  );
  return [fileHeader, table, startupCodeBuffer].concat(
    moduleBuffers.map(_ref3 => {
      let buffer = _ref3.buffer;
      return buffer;
    })
  );
}

function createModuleGroups(groups, modules) {
  return {
    groups,
    modulesById: new Map(modules.map(m => [m.id, m])),
    modulesInGroups: new Set(concat(groups.values()))
  };
}

function* concat(iterators) {
  for (const it of iterators) {
    yield* it;
  }
}

exports.save = saveAsIndexedFile;
exports.buildTableAndContents = buildTableAndContents;
exports.createModuleGroups = createModuleGroups;
