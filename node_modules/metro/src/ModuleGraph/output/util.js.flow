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

const addParamsToDefineCall = require('../../lib/addParamsToDefineCall');
const generate = require('../worker/generate');
const mergeSourceMaps = require('../worker/mergeSourceMaps');
const reverseDependencyMapReferences = require('./reverse-dependency-map-references');
const virtualModule = require('../module').virtual;

const {transformSync} = require('@babel/core');

import type {IdsForPathFn, Module} from '../types.flow';
import type {BasicSourceMap} from 'metro-source-map';

// Transformed modules have the form
//   __d(function(require, module, global, exports, dependencyMap) {
//       /* code */
//   });
//
// This function adds the numeric module ID, and an array with dependencies of
// the dependencies of the module before the closing parenthesis.
function addModuleIdsToModuleWrapper(
  module: Module,
  idForPath: ({path: string}) => number,
): string {
  const {dependencies, file} = module;
  const {code} = file;

  // calling `idForPath` on the module itself first gives us a lower module id
  // for the file itself than for its dependencies. That reflects their order
  // in the bundle.
  const fileId = idForPath(file);

  const paramsToAdd = [fileId];

  if (dependencies.length) {
    paramsToAdd.push(dependencies.map(idForPath));
  }

  return addParamsToDefineCall(code, ...paramsToAdd);
}

exports.addModuleIdsToModuleWrapper = addModuleIdsToModuleWrapper;

function inlineModuleIds(
  module: Module,
  idForPath: ({path: string}) => number,
): {
  moduleCode: string,
  moduleMap: ?BasicSourceMap,
} {
  const {dependencies, file} = module;
  const {code, map, path} = file;

  // calling `idForPath` on the module itself first gives us a lower module id
  // for the file itself than for its dependencies. That reflects their order
  // in the bundle.
  const fileId = idForPath(file);
  const dependencyIds = dependencies.map(idForPath);

  const {ast} = transformSync(code, {
    ast: true,
    babelrc: false,
    code: false,
    configFile: false,
    plugins: [[reverseDependencyMapReferences, {dependencyIds}]],
  });

  const {code: generatedCode, map: generatedMap} = generate(
    ast,
    path,
    '',
    true,
  );

  return {
    moduleCode: addParamsToDefineCall(generatedCode, fileId),
    moduleMap: map && generatedMap && mergeSourceMaps(path, map, generatedMap),
  };
}

exports.inlineModuleIds = inlineModuleIds;

type IdForPathFn = ({path: string}) => number;

/**
 * 1. Adds the module ids to a file if the file is a module. If it's not (e.g.
 *    a script) it just keeps it as-is.
 * 2. Packs the function map into the file's source map, if one exists.
 */
function getModuleCodeAndMap(
  module: Module,
  idForPath: IdForPathFn,
  options: $ReadOnly<{enableIDInlining: boolean}>,
) {
  const {file} = module;
  let moduleCode, moduleMap;

  if (file.type !== 'module') {
    moduleCode = file.code;
    moduleMap = file.map;
  } else if (!options.enableIDInlining) {
    moduleCode = addModuleIdsToModuleWrapper(module, idForPath);
    moduleMap = file.map;
  } else {
    ({moduleCode, moduleMap} = inlineModuleIds(module, idForPath));
  }
  if (moduleMap && moduleMap.sources) {
    const x_facebook_sources = [];
    if (moduleMap.sources.length >= 1) {
      x_facebook_sources.push([module.file.functionMap]);
    }
    moduleMap = {...moduleMap, x_facebook_sources};
  }
  return {moduleCode, moduleMap};
}

exports.getModuleCodeAndMap = getModuleCodeAndMap;

// Concatenates many iterables, by calling them sequentially.
exports.concat = function* concat<T>(
  ...iterables: Array<Iterable<T>>
): Iterable<T> {
  for (const it of iterables) {
    yield* it;
  }
};

// Creates an idempotent function that returns numeric IDs for objects based
// on their `path` property.
exports.createIdForPathFn = (): (({path: string}) => number) => {
  const seen = new Map();
  let next = 0;
  return ({path}) => {
    let id = seen.get(path);
    if (id == null) {
      id = next++;
      seen.set(path, id);
    }
    return id;
  };
};

// creates a series of virtual modules with require calls to the passed-in
// modules.
exports.requireCallsTo = function*(
  modules: Iterable<Module>,
  idForPath: IdForPathFn,
  getRunModuleStatement: (id: number | string) => string,
): Iterable<Module> {
  for (const module of modules) {
    const id = idForPath(module.file);
    yield virtualModule(
      getRunModuleStatement(id),
      `/<generated>/require-${id}.js`,
    );
  }
};

// Divides the modules into two types: the ones that are loaded at startup, and
// the ones loaded deferredly (lazy loaded).
exports.partition = (
  modules: Iterable<Module>,
  preloadedModules: Set<string>,
): Array<Array<Module>> => {
  const startup = [];
  const deferred = [];
  for (const module of modules) {
    (preloadedModules.has(module.file.path) ? startup : deferred).push(module);
  }

  return [startup, deferred];
};

// Transforms a new Module object into an old one, so that it can be passed
// around code.
exports.toModuleTransport = (module: Module, idsForPath: IdsForPathFn) => {
  const {dependencies, file} = module;
  const {moduleCode, moduleMap} = getModuleCodeAndMap(
    module,
    (x: {path: string}) => idsForPath(x).moduleId,
    {enableIDInlining: true},
  );

  return {
    code: moduleCode,
    dependencies,
    // ID is required but we provide an invalid one for "script"s.
    id: file.type === 'module' ? idsForPath(file).localId : -1,
    map: moduleMap,
    name: file.path,
    sourcePath: file.path,
  };
};
