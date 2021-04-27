"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = applyParams;

function _lodash() {
  const data = require("lodash");

  _lodash = function () {
    return data;
  };

  return data;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function applyParams(str, params, prefix) {
  return str.replace(/\$\{(\w+)\}/g, (_pattern, param) => {
    const name = `${(0, _lodash().camelCase)(prefix)}_${param}`; // @ts-ignore

    return params[param] ? `getResources().getString(R.string.${name})` : 'null';
  });
}