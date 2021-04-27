/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+metro_bundler
 * @format
 *
 */
"use strict";

const acorn = require("acorn");

const vm = require("vm");

module.exports = function execBundle(code) {
  let context =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // Verify the code can run on older VMs by parsing it as ES5 (versus ES6+).
  acorn.parse(code, {
    ecmaVersion: 5
  });
  return vm.runInNewContext(code, context);
};
