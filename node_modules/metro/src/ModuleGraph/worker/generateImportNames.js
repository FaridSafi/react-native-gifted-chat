/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *
 */
"use strict";

const nullthrows = require("nullthrows");
/* $FlowFixMe(>=0.99.0 site=react_native_fb) This comment suppresses an error
 * found when Flow v0.99 was deployed. To see the error, delete this comment
 * and run Flow. */

const traverse = require("@babel/traverse").default;

/**
 * Select unused names for "metroImportDefault" and "metroImportAll", by
 * calling "generateUid".
 */
function generateImportNames(ast) {
  let importDefault;
  let importAll;
  traverse(ast, {
    Program(path) {
      importAll = path.scope.generateUid("$$_IMPORT_ALL");
      importDefault = path.scope.generateUid("$$_IMPORT_DEFAULT");
    }
  });
  return {
    importAll: nullthrows(importAll),
    importDefault: nullthrows(importDefault)
  };
}

module.exports = generateImportNames;
