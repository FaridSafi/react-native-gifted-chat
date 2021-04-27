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

const {getJsOutput, isJsModule} = require('./helpers/js');

import type {RevisionId} from '../../IncrementalBundler';
import type {BundleVariant} from '../../lib/bundle-modules/types.flow';
import type {
  DeltaResult,
  Graph,
  Module,
  SerializerOptions,
} from '../types.flow';
import type {MixedOutput} from '../types.flow';

function deltaJSBundle(
  entryPoint: string,
  pre: $ReadOnlyArray<Module<>>,
  delta: DeltaResult<>,
  revisionId: RevisionId,
  graph: Graph<>,
  options: SerializerOptions,
): BundleVariant {
  const {processModuleFilter} = options;

  const processOpts = {
    filter: processModuleFilter,
    dev: options.dev,
    createModuleId: options.createModuleId,
    projectRoot: options.projectRoot,
  };

  const added = processModules([...delta.added.values()], processOpts).map(
    ([module, code]) => [options.createModuleId(module.path), code],
  );

  if (delta.reset) {
    const modules = [...graph.dependencies.values()].sort(
      (a: Module<MixedOutput>, b: Module<MixedOutput>) =>
        options.createModuleId(a.path) - options.createModuleId(b.path),
    );
    const appendScripts = getAppendScripts(
      entryPoint,
      [...pre, ...modules],
      graph.importBundleNames,
      options,
    );

    return {
      base: true,
      revisionId,
      pre: pre
        .filter(isJsModule)
        .filter(processModuleFilter)
        .map((module: Module<>) => getJsOutput(module).data.code)
        .join('\n'),
      post: appendScripts
        .filter(isJsModule)
        .filter(processModuleFilter)
        .map((module: Module<>) => getJsOutput(module).data.code)
        .join('\n'),
      modules: [...added],
    };
  }

  const modified = processModules(
    [...delta.modified.values()],
    processOpts,
  ).map(([module, code]) => [options.createModuleId(module.path), code]);

  const deleted = [...delta.deleted].map((path: string) =>
    options.createModuleId(path),
  );

  return {
    base: false,
    revisionId,
    added,
    modified,
    deleted,
  };
}

module.exports = deltaJSBundle;
