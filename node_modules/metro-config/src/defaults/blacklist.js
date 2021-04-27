/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
"use strict";

var path = require("path"); // Don't forget to everything listed here to `package.json`
// modulePathIgnorePatterns.

var sharedBlacklist = [
  /node_modules\/react\/dist\/.*/,
  /website\/node_modules\/.*/,
  /heapCapture\/bundle\.js/,
  /.*\/__tests__\/.*/
];

function escapeRegExp(pattern) {
  if (Object.prototype.toString.call(pattern) === "[object RegExp]") {
    return pattern.source.replace(/\//g, path.sep);
  } else if (typeof pattern === "string") {
    var escaped = pattern.replace(/[\-\[\]\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); // convert the '/' into an escaped local file separator

    return escaped.replace(/\//g, "\\" + path.sep);
  } else {
    throw new Error("Unexpected blacklist pattern: " + pattern);
  }
}

function blacklist(additionalBlacklist) {
  return new RegExp(
    "(" +
      (additionalBlacklist || [])
        .concat(sharedBlacklist)
        .map(escapeRegExp)
        .join("|") +
      ")$"
  );
}

module.exports = blacklist;
