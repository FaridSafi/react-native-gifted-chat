/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */
"use strict";

const _require = require("./helpers/js"),
  isJsModule = _require.isJsModule,
  getJsOutput = _require.getJsOutput;

function getExplodedSourceMap(modules, options) {
  const modulesToProcess = modules
    .filter(isJsModule)
    .filter(options.processModuleFilter);
  const result = [];
  let firstLine1Based = 1;

  for (const module of modulesToProcess) {
    const path = module.path;
    const _getJsOutput$data = getJsOutput(module).data,
      lineCount = _getJsOutput$data.lineCount,
      functionMap = _getJsOutput$data.functionMap,
      map = _getJsOutput$data.map;
    result.push({
      firstLine1Based,
      functionMap,
      path,
      map
    });
    firstLine1Based += lineCount;
  }

  return result;
}

module.exports = {
  getExplodedSourceMap
};
