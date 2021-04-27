/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

const MAGIC_UNBUNDLE_NUMBER = require('../../shared/output/RamBundle/magic-number');
const MAGIC_UNBUNDLE_FILENAME = 'UNBUNDLE';
const JS_MODULES = 'js-modules';

const buildSourcemapWithMetadata = require('../../shared/output/RamBundle/buildSourcemapWithMetadata.js');
const path = require('path');

const {getModuleCodeAndMap, partition, toModuleTransport} = require('./util');

import type {IndexMap} from 'metro-source-map';
import type {Module, OutputFn, OutputFnArg, OutputResult} from '../types.flow';

function asMultipleFilesRamBundle({
  filename,
  idsForPath,
  modules,
  requireCalls,
  preloadedModules,
}): OutputResult<IndexMap> {
  const idForPath = (x: {path: string}) => idsForPath(x).moduleId;
  const [startup, deferred] = partition(modules, preloadedModules);
  const startupModules = [...startup, ...requireCalls];
  const deferredModules = deferred.map((m: Module) =>
    toModuleTransport(m, idsForPath),
  );
  const magicFileContents = Buffer.alloc(4);

  // Just concatenate all startup modules, one after the other.
  const code = startupModules
    .map(
      (m: Module) =>
        getModuleCodeAndMap(m, idForPath, {enableIDInlining: true}).moduleCode,
    )
    .join('\n');

  // Write one file per module, wrapped with __d() call if it proceeds.
  const extraFiles = new Map();
  deferredModules.forEach(deferredModule => {
    extraFiles.set(
      path.join(JS_MODULES, deferredModule.id + '.js'),
      deferredModule.code,
    );
  });

  // Prepare and write magic number file.
  magicFileContents.writeUInt32LE(MAGIC_UNBUNDLE_NUMBER, 0);
  extraFiles.set(
    path.join(JS_MODULES, MAGIC_UNBUNDLE_FILENAME),
    magicFileContents,
  );

  // Create the source map (with no module groups, as they are ignored).
  const map = buildSourcemapWithMetadata({
    fixWrapperOffset: false,
    lazyModules: deferredModules,
    moduleGroups: null,
    startupModules: startupModules.map((m: Module) =>
      toModuleTransport(m, idsForPath),
    ),
  });

  return {code, extraFiles, map};
}

function createBuilder(
  preloadedModules: Set<string>,
  ramGroupHeads: ?$ReadOnlyArray<string>,
): OutputFn<IndexMap> {
  return (x: OutputFnArg) =>
    asMultipleFilesRamBundle({...x, preloadedModules, ramGroupHeads});
}

exports.createBuilder = createBuilder;
