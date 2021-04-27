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

const {getAssetFiles} = require('../../Assets');
const {getJsOutput, isJsModule} = require('./helpers/js');

import type {Graph, Module} from '../types.flow';

type Options = {|
  platform: ?string,
  +processModuleFilter: (module: Module<>) => boolean,
|};

async function getAllFiles(
  pre: $ReadOnlyArray<Module<>>,
  graph: Graph<>,
  options: Options,
): Promise<$ReadOnlyArray<string>> {
  const modules = graph.dependencies;
  const {processModuleFilter} = options;

  const promises = [];

  for (const module of pre) {
    if (processModuleFilter(module)) {
      promises.push([module.path]);
    }
  }

  for (const module of modules.values()) {
    if (!isJsModule(module) || !processModuleFilter(module)) {
      continue;
    }

    if (getJsOutput(module).type === 'js/module/asset') {
      promises.push(getAssetFiles(module.path, options.platform));
    } else {
      promises.push([module.path]);
    }
  }

  const dependencies = await Promise.all(promises);
  const output = [];

  for (const dependencyArray of dependencies) {
    output.push(...dependencyArray);
  }

  return output;
}

module.exports = getAllFiles;
