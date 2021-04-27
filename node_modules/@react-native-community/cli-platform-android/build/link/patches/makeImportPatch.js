"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeImportPatch;

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function makeImportPatch(packageImportPath) {
  return {
    pattern: 'import com.facebook.react.ReactApplication;',
    patch: `\n${packageImportPath}`
  };
}