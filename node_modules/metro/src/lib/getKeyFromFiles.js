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

const crypto = require("crypto");

const fs = require("fs");

function getKeyFromFile(filePath) {
  return createHash(fs.readFileSync(filePath));
}

function createHash(str) {
  return crypto
    .createHash("sha1")
    .update(str)
    .digest("hex");
}

module.exports = function getKeyFromFiles(files) {
  return createHash(files.map(getKeyFromFile).join("$"));
};
