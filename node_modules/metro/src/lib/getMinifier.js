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

function getMinifier(minifierPath) {
  // Note: minifierPath should be an absolute path OR a module name here!
  // The options allow relative paths but they HAVE to be normalized at
  // any entry point that accepts them...
  try {
    // $FlowFixMe TODO t0 cannot do require with literal
    return require(minifierPath);
  } catch (e) {
    throw new Error(
      'A problem occurred while trying to fetch the minifier. Path: "' +
        minifierPath +
        '", error message: ' +
        e.message
    );
  }
}

module.exports = getMinifier;
