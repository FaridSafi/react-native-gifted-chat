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

const {getJsOutput} = require('./js');

import type {Module} from '../../types.flow';
import type {
  MetroSourceMapSegmentTuple,
  FBSourceFunctionMap,
} from 'metro-source-map';

function getSourceMapInfo(
  module: Module<>,
  options: {|
    +excludeSource: boolean,
  |},
): {|
  +map: Array<MetroSourceMapSegmentTuple>,
  +functionMap: ?FBSourceFunctionMap,
  +code: string,
  +path: string,
  +source: string,
  +lineCount: number,
|} {
  return {
    ...getJsOutput(module).data,
    path: module.path,
    source: options.excludeSource ? '' : getModuleSource(module),
  };
}

function getModuleSource(module: Module<>): string {
  if (getJsOutput(module).type === 'js/module/asset') {
    return '';
  }

  return module.getSource().toString();
}

module.exports = getSourceMapInfo;
