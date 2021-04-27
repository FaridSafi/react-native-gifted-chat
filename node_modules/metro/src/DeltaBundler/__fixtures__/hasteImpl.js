/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+metro_bundler
 * @format
 */
"use strict";

const fs = require("fs");
/**
 * Simple hasteImpl that parses @providesModule annotation from JS modules.
 */

module.exports = {
  getHasteName(filename) {
    const matches = fs
      .readFileSync(filename, "utf8")
      .match(/@providesModule ([^\n]+)/);

    if (!matches) {
      return undefined;
    }

    return matches[1];
  }
};
