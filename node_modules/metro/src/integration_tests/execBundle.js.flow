/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+metro_bundler
 * @format
 * @flow
 */

'use strict';

const acorn = require('acorn');
const vm = require('vm');

module.exports = function execBundle(code: string, context: {} = {}): mixed {
  // Verify the code can run on older VMs by parsing it as ES5 (versus ES6+).
  acorn.parse(code, {ecmaVersion: 5});

  return vm.runInNewContext(code, context);
};
