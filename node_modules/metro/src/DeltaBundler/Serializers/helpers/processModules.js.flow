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

const {isJsModule, wrapModule} = require('./js');

import type {Module} from '../../types.flow';

function processModules(
  modules: $ReadOnlyArray<Module<>>,
  {
    filter = () => true,
    createModuleId,
    dev,
    projectRoot,
  }: {|
    +filter?: (module: Module<>) => boolean,
    +createModuleId: string => number,
    +dev: boolean,
    +projectRoot: string,
  |},
): $ReadOnlyArray<[Module<>, string]> {
  return [...modules]
    .filter(isJsModule)
    .filter(filter)
    .map((module: Module<>) => [
      module,
      wrapModule(module, {
        createModuleId,
        dev,
        projectRoot,
      }),
    ]);
}

module.exports = processModules;
