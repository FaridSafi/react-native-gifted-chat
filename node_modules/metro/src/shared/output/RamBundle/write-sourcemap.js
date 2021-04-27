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

const writeFile = require("../writeFile");

function writeSourcemap(fileName, contents, log) {
  if (!fileName) {
    return Promise.resolve();
  }

  log("Writing sourcemap output to:", fileName);
  const writeMap = writeFile(fileName, contents, null);
  writeMap.then(() => log("Done writing sourcemap output"));
  return writeMap;
}

module.exports = writeSourcemap;
