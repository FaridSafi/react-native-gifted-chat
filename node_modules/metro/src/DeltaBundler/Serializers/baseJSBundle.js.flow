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

const getAppendScripts = require('../../lib/getAppendScripts');
const processModules = require('./helpers/processModules');

import type {Bundle} from '../../lib/bundle-modules/types.flow';
import type {
  Graph,
  MixedOutput,
  Module,
  SerializerOptions,
} from '../types.flow';

function baseJSBundle(
  entryPoint: string,
  preModules: $ReadOnlyArray<Module<>>,
  graph: Graph<>,
  options: SerializerOptions,
): Bundle {
  for (const module of graph.dependencies.values()) {
    options.createModuleId(module.path);
  }

  const processModulesOptions = {
    filter: options.processModuleFilter,
    createModuleId: options.createModuleId,
    dev: options.dev,
    projectRoot: options.projectRoot,
  };

  // Do not prepend polyfills or the require runtime when only modules are requested
  if (options.modulesOnly) {
    preModules = [];
  }

  const preCode = processModules(preModules, processModulesOptions)
    .map(([_, code]) => code)
    .join('\n');

  const modules = [...graph.dependencies.values()].sort(
    (a: Module<MixedOutput>, b: Module<MixedOutput>) =>
      options.createModuleId(a.path) - options.createModuleId(b.path),
  );

  const postCode = processModules(
    getAppendScripts(
      entryPoint,
      [...preModules, ...modules],
      graph.importBundleNames,
      {
        asyncRequireModulePath: options.asyncRequireModulePath,
        createModuleId: options.createModuleId,
        getRunModuleStatement: options.getRunModuleStatement,
        inlineSourceMap: options.inlineSourceMap,
        projectRoot: options.projectRoot,
        runBeforeMainModule: options.runBeforeMainModule,
        runModule: options.runModule,
        sourceMapUrl: options.sourceMapUrl,
        sourceUrl: options.sourceUrl,
      },
    ),
    processModulesOptions,
  )
    .map(([_, code]) => code)
    .join('\n');

  return {
    pre: preCode,
    post: postCode,
    modules: processModules(
      [...graph.dependencies.values()],
      processModulesOptions,
    ).map(([module, code]) => [options.createModuleId(module.path), code]),
  };
}

module.exports = baseJSBundle;
