/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
'use strict';

const MAGIC_UNBUNDLE_FILE_HEADER = require('./magic-number');

const buildSourcemapWithMetadata = require('./buildSourcemapWithMetadata');
const fs = require('fs');
const relativizeSourceMapInline = require('../../../lib/relativizeSourceMap');
const writeSourceMap = require('./write-sourcemap');

const {joinModules} = require('./util');

import type {RamBundleInfo} from '../../../DeltaBundler/Serializers/getRamBundleInfo';
import type {
  ModuleGroups,
  ModuleTransportLike,
  OutputOptions,
} from '../../types.flow';
import type {WriteStream} from 'fs';

const SIZEOF_UINT32 = 4;

/**
 * Saves all JS modules of an app as a single file, separated with null bytes.
 * The file begins with an offset table that contains module ids and their
 * lengths/offsets.
 * The module id for the startup code (prelude, polyfills etc.) is the
 * empty string.
 */
function saveAsIndexedFile(
  bundle: RamBundleInfo,
  options: OutputOptions,
  log: (...args: Array<string>) => void,
): Promise<mixed> {
  const {
    bundleOutput,
    bundleEncoding: encoding,
    sourcemapOutput,
    sourcemapSourcesRoot,
  } = options;

  log('start');
  const {startupModules, lazyModules, groups} = bundle;
  log('finish');

  const moduleGroups = createModuleGroups(groups, lazyModules);
  const startupCode = joinModules(startupModules);

  log('Writing unbundle output to:', bundleOutput);
  const writeUnbundle = writeBuffers(
    fs.createWriteStream(bundleOutput),
    buildTableAndContents(startupCode, lazyModules, moduleGroups, encoding),
  ).then(() => log('Done writing unbundle output'));

  if (sourcemapOutput) {
    const sourceMap = buildSourcemapWithMetadata({
      startupModules: startupModules.concat(),
      lazyModules: lazyModules.concat(),
      moduleGroups,
      fixWrapperOffset: true,
    });
    if (sourcemapSourcesRoot !== undefined) {
      relativizeSourceMapInline(sourceMap, sourcemapSourcesRoot);
    }

    const wroteSourceMap = writeSourceMap(
      sourcemapOutput,
      JSON.stringify(sourceMap),
      log,
    );

    return Promise.all([writeUnbundle, wroteSourceMap]);
  } else {
    return writeUnbundle;
  }
}

/* global Buffer: true */

const fileHeader = Buffer.alloc(4);
fileHeader.writeUInt32LE(MAGIC_UNBUNDLE_FILE_HEADER, 0);
const nullByteBuffer: Buffer = Buffer.alloc(1).fill(0);

function writeBuffers(
  stream: WriteStream,
  buffers: Array<Buffer>,
): Promise<void> {
  buffers.forEach((buffer: Buffer) => stream.write(buffer));
  return new Promise((resolve: () => void, reject: mixed => mixed) => {
    stream.on('error', reject);
    stream.on('finish', () => resolve());
    stream.end();
  });
}

function nullTerminatedBuffer(
  contents: string,
  encoding: void | 'ascii' | 'utf16le' | 'utf8',
): Buffer {
  return Buffer.concat([Buffer.from(contents, encoding), nullByteBuffer]);
}

function moduleToBuffer(
  id: number,
  code: string,
  encoding: void | 'ascii' | 'utf16le' | 'utf8',
): {|buffer: Buffer, id: number|} {
  return {
    id,
    buffer: nullTerminatedBuffer(code, encoding),
  };
}

function entryOffset(n: number): number {
  // 2: num_entries + startup_code_len
  // n * 2: each entry consists of two uint32s
  return (2 + n * 2) * SIZEOF_UINT32;
}

function buildModuleTable(
  startupCode: Buffer,
  moduleBuffers: Array<{buffer: Buffer, id: number}>,
  moduleGroups: ModuleGroups,
): Buffer {
  // table format:
  // - num_entries:      uint_32  number of entries
  // - startup_code_len: uint_32  length of the startup section
  // - entries:          entry...
  //
  // entry:
  //  - module_offset:   uint_32  offset into the modules blob
  //  - module_length:   uint_32  length of the module code in bytes

  const moduleIds = [...moduleGroups.modulesById.keys()];
  const maxId = moduleIds.reduce((max: number, id: number) =>
    Math.max(max, id),
  );
  const numEntries = maxId + 1;
  const table: Buffer = Buffer.alloc(entryOffset(numEntries)).fill(0);

  // num_entries
  table.writeUInt32LE(numEntries, 0);

  // startup_code_len
  table.writeUInt32LE(startupCode.length, SIZEOF_UINT32);

  // entries
  let codeOffset = startupCode.length;
  moduleBuffers.forEach(({id, buffer}) => {
    const group = moduleGroups.groups.get(id);
    const idsInGroup: Array<number> = group
      ? [id].concat(Array.from(group))
      : [id];

    idsInGroup.forEach((moduleId: number) => {
      const offset = entryOffset(moduleId);
      // module_offset
      table.writeUInt32LE(codeOffset, offset);
      // module_length
      table.writeUInt32LE(buffer.length, offset + SIZEOF_UINT32);
    });
    codeOffset += buffer.length;
  });

  return table;
}

function groupCode(
  rootCode: string,
  moduleGroup: void | Set<number>,
  modulesById: Map<number, ModuleTransportLike>,
): string {
  if (!moduleGroup || !moduleGroup.size) {
    return rootCode;
  }
  const code = [rootCode];
  for (const id of moduleGroup) {
    code.push((modulesById.get(id) || {code: ''}).code);
  }

  return code.join('\n');
}

function buildModuleBuffers(
  modules: $ReadOnlyArray<ModuleTransportLike>,
  moduleGroups: ModuleGroups,
  encoding: void | 'ascii' | 'utf16le' | 'utf8',
): Array<{buffer: Buffer, id: number}> {
  return modules
    .filter((m: ModuleTransportLike) => !moduleGroups.modulesInGroups.has(m.id))
    .map(({id, code}) =>
      moduleToBuffer(
        id,
        groupCode(code, moduleGroups.groups.get(id), moduleGroups.modulesById),
        encoding,
      ),
    );
}

function buildTableAndContents(
  startupCode: string,
  modules: $ReadOnlyArray<ModuleTransportLike>,
  moduleGroups: ModuleGroups,
  encoding?: 'utf8' | 'utf16le' | 'ascii',
): Array<Buffer> {
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
    moduleGroups,
  );

  return [fileHeader, table, startupCodeBuffer].concat(
    moduleBuffers.map(({buffer}) => buffer),
  );
}

function createModuleGroups(
  groups: Map<number, Set<number>>,
  modules: $ReadOnlyArray<ModuleTransportLike>,
): ModuleGroups {
  return {
    groups,
    modulesById: new Map(modules.map((m: ModuleTransportLike) => [m.id, m])),
    modulesInGroups: new Set(concat(groups.values())),
  };
}

function* concat(
  iterators: Iterator<Set<number>>,
): Generator<number, void, void> {
  for (const it of iterators) {
    yield* it;
  }
}

exports.save = saveAsIndexedFile;
exports.buildTableAndContents = buildTableAndContents;
exports.createModuleGroups = createModuleGroups;
