"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _inquirer() {
  const data = require("inquirer");

  _inquirer = function () {
    return data;
  };

  return data;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @ts-ignore untyped
var _default = questions => new Promise((resolve, reject) => {
  if (!questions) {
    resolve({});
    return;
  }

  (0, _inquirer().prompt)(questions).then(resolve, reject);
});

exports.default = _default;