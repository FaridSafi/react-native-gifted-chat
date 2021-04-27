/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */
"use strict";

const meta = require("../../shared/output/meta");

const _require = require("./util"),
  getModuleCodeAndMap = _require.getModuleCodeAndMap,
  concat = _require.concat;

const _require2 = require("metro-source-map"),
  BundleBuilder = _require2.BundleBuilder;

function asPlainBundle(_ref) {
  let filename = _ref.filename,
    idsForPath = _ref.idsForPath,
    modules = _ref.modules,
    requireCalls = _ref.requireCalls,
    sourceMapPath = _ref.sourceMapPath,
    enableIDInlining = _ref.enableIDInlining;
  const builder = new BundleBuilder(filename);

  const modIdForPath = x => idsForPath(x).moduleId;

  for (const module of concat(modules, requireCalls)) {
    const _getModuleCodeAndMap = getModuleCodeAndMap(module, modIdForPath, {
        enableIDInlining
      }),
      moduleCode = _getModuleCodeAndMap.moduleCode,
      moduleMap = _getModuleCodeAndMap.moduleMap;

    builder.append(moduleCode + "\n", moduleMap);
  }

  if (sourceMapPath) {
    builder.append(`//# sourceMappingURL=${sourceMapPath}`);
  }

  const code = builder.getCode();
  const map = builder.getMap();
  return {
    code,
    extraFiles: [[`${filename}.meta`, meta(code)]],
    map
  };
}

module.exports = asPlainBundle;
