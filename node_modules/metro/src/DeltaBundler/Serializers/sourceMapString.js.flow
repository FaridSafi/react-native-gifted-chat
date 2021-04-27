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

const {sourceMapGenerator} = require('./sourceMapGenerator');

import type {Module} from '../types.flow';

function sourceMapString(
  modules: $ReadOnlyArray<Module<>>,
  options: {|
    +excludeSource: boolean,
    +processModuleFilter: (module: Module<>) => boolean,
  |},
): string {
  return sourceMapGenerator(modules, options).toString(undefined, {
    excludeSource: options.excludeSource,
  });
}

module.exports = sourceMapString;
