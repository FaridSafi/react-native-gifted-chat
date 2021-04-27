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

const buildSourcemapWithMetadata = require('../../shared/output/RamBundle/buildSourcemapWithMetadata.js');
const invariant = require('invariant');

const {createRamBundleGroups} = require('../../Bundler/util');
const {
  buildTableAndContents,
  createModuleGroups,
} = require('../../shared/output/RamBundle/as-indexed-file');
const {getModuleCodeAndMap, partition, toModuleTransport} = require('./util');

import type {Module, OutputFn, OutputFnArg} from '../types.flow';
import type {IndexMap} from 'metro-source-map';

function asIndexedRamBundle({
  filename,
  idsForPath,
  modules,
  preloadedModules,
  ramGroupHeads,
  requireCalls,
}): {|
  code: string | Buffer,
  extraFiles?: Iterable<[string, string | Buffer]>,
  map: IndexMap,
|} {
  const idForPath = (x: {path: string}) => idsForPath(x).moduleId;
  const [startup, deferred] = partition(modules, preloadedModules);
  const startupModules = [...startup, ...requireCalls];
  const deferredModules = deferred.map((m: Module) =>
    toModuleTransport(m, idsForPath),
  );
  for (const m of deferredModules) {
    invariant(
      m.id >= 0,
      'A script (non-module) cannot be part of the deferred modules of a RAM bundle ' +
        `(\`${m.sourcePath}\`, id=${m.id})`,
    );
  }
  const ramGroups = createRamBundleGroups(
    ramGroupHeads || [],
    deferredModules,
    subtree,
  );
  const moduleGroups = createModuleGroups(ramGroups, deferredModules);

  const tableAndContents = buildTableAndContents(
    startupModules
      .map(
        (m: Module) =>
          getModuleCodeAndMap(m, idForPath, {enableIDInlining: true})
            .moduleCode,
      )
      .join('\n'),
    deferredModules,
    moduleGroups,
    'utf8',
  );

  return {
    code: Buffer.concat(tableAndContents),
    map: buildSourcemapWithMetadata({
      fixWrapperOffset: false,
      lazyModules: deferredModules,
      moduleGroups,
      startupModules: startupModules.map((m: Module) =>
        toModuleTransport(m, idsForPath),
      ),
    }),
  };
}

function* subtree(
  moduleTransport,
  moduleTransportsByPath,
  seen: Set<number> = new Set(),
): Generator<number, void, void> {
  seen.add(moduleTransport.id);
  for (const {path} of moduleTransport.dependencies) {
    const dependency = moduleTransportsByPath.get(path);
    if (dependency && !seen.has(dependency.id)) {
      yield dependency.id;
      yield* subtree(dependency, moduleTransportsByPath, seen);
    }
  }
}

function createBuilder(
  preloadedModules: Set<string>,
  ramGroupHeads: ?$ReadOnlyArray<string>,
): OutputFn<IndexMap> {
  return (x: OutputFnArg) =>
    asIndexedRamBundle({...x, preloadedModules, ramGroupHeads});
}

exports.createBuilder = createBuilder;
