"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeStringsPatch;

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
function makeStringsPatch(params, prefix) {
  const values = Object.keys(params).map(param => {
    const name = `${(0, _lodash().camelCase)(prefix)}_${param}`;
    return '    ' + // @ts-ignore
    `<string moduleConfig="true" name="${name}">${params[param]}</string>`;
  });
  const patch = values.length > 0 ? `${values.join('\n')}\n` : '';
  return {
    pattern: '<resources>\n',
    patch
  };
}