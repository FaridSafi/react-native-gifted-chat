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
const path = require('path');
const url = require('url');

const {isJsModule, wrapModule} = require('./helpers/js');

import type {EntryPointURL} from '../../HmrServer';
import type {HmrModule} from '../../lib/bundle-modules/types.flow';
import type {DeltaResult, Graph, Module} from '../types.flow';

type Options = {
  +clientUrl: EntryPointURL,
  +createModuleId: string => number,
  +projectRoot: string,
};

function generateModules(
  sourceModules: Iterable<Module<>>,
  graph: Graph<>,
  options: Options,
): $ReadOnlyArray<HmrModule> {
  const modules = [];

  for (const module of sourceModules) {
    if (isJsModule(module)) {
      // Construct a bundle URL for this specific module only
      const getURL = extension => {
        options.clientUrl.pathname = path.relative(
          options.projectRoot,
          path.join(
            path.dirname(module.path),
            path.basename(module.path, path.extname(module.path)) +
              '.' +
              extension,
          ),
        );
        return url.format(options.clientUrl);
      };

      const sourceMappingURL = getURL('map');
      const sourceURL = getURL('bundle');
      const code =
        prepareModule(module, graph, options) +
        `\n//# sourceMappingURL=${sourceMappingURL}\n` +
        `//# sourceURL=${sourceURL}\n`;

      modules.push({
        module: [options.createModuleId(module.path), code],
        sourceMappingURL,
        sourceURL,
      });
    }
  }

  return modules;
}

function prepareModule(
  module: Module<>,
  graph: Graph<>,
  options: Options,
): string {
  const code = wrapModule(module, {
    ...options,
    dev: true,
  });

  const inverseDependencies = getInverseDependencies(module.path, graph);
  // Transform the inverse dependency paths to ids.
  const inverseDependenciesById = Object.create(null);
  Object.keys(inverseDependencies).forEach((path: string) => {
    inverseDependenciesById[options.createModuleId(path)] = inverseDependencies[
      path
    ].map(options.createModuleId);
  });
  return addParamsToDefineCall(code, inverseDependenciesById);
}

/**
 * Instead of adding the whole inverseDependncies object into each changed
 * module (which can be really huge if the dependency graph is big), we only
 * add the needed inverseDependencies for each changed module (we do this by
 * traversing upwards the dependency graph).
 */
function getInverseDependencies(
  path: string,
  graph: Graph<>,
  inverseDependencies: {[key: string]: Array<string>} = {},
): {[key: string]: Array<string>} {
  // Dependency alredy traversed.
  if (path in inverseDependencies) {
    return inverseDependencies;
  }

  const module = graph.dependencies.get(path);
  if (!module) {
    return inverseDependencies;
  }

  inverseDependencies[path] = [];
  for (const inverse of module.inverseDependencies) {
    inverseDependencies[path].push(inverse);
    getInverseDependencies(inverse, graph, inverseDependencies);
  }

  return inverseDependencies;
}

function hmrJSBundle(
  delta: DeltaResult<>,
  graph: Graph<>,
  options: Options,
): {|
  +added: $ReadOnlyArray<HmrModule>,
  +deleted: $ReadOnlyArray<number>,
  +modified: $ReadOnlyArray<HmrModule>,
|} {
  return {
    added: generateModules(delta.added.values(), graph, options),
    modified: generateModules(delta.modified.values(), graph, options),
    deleted: [...delta.deleted].map((path: string) =>
      options.createModuleId(path),
    ),
  };
}

module.exports = hmrJSBundle;
