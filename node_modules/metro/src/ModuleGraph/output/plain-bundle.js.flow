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

const meta = require('../../shared/output/meta');

const {getModuleCodeAndMap, concat} = require('./util');
const {BundleBuilder} = require('metro-source-map');

import type {OutputFn} from '../types.flow';
import type {MixedSourceMap} from 'metro-source-map';

function asPlainBundle({
  filename,
  idsForPath,
  modules,
  requireCalls,
  sourceMapPath,
  enableIDInlining,
}): {|
  code: string | Buffer,
  extraFiles?: Iterable<[string, string | Buffer]>,
  map: MixedSourceMap,
|} {
  const builder = new BundleBuilder(filename);
  const modIdForPath = (x: {path: string}) => idsForPath(x).moduleId;

  for (const module of concat(modules, requireCalls)) {
    const {moduleCode, moduleMap} = getModuleCodeAndMap(module, modIdForPath, {
      enableIDInlining,
    });

    builder.append(moduleCode + '\n', moduleMap);
  }

  if (sourceMapPath) {
    builder.append(`//# sourceMappingURL=${sourceMapPath}`);
  }

  const code = builder.getCode();
  const map = builder.getMap();
  return {
    code,
    extraFiles: [[`${filename}.meta`, meta(code)]],
    map,
  };
}

module.exports = (asPlainBundle: OutputFn<>);
