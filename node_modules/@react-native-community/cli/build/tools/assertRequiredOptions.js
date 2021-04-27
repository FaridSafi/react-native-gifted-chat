"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = assertRequiredOptions;

function _commander() {
  const data = require("commander");

  _commander = function () {
    return data;
  };

  return data;
}

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
 * @format
 */
// Commander.js has a 2 years old open issue to support <...> syntax
// for options. Until that gets merged, we run the checks manually
// https://github.com/tj/commander.js/issues/230
function assertRequiredOptions(options, passedOptions) {
  options.forEach(opt => {
    const option = new (_commander().Option)(opt.name);

    if (!option.required) {
      return;
    }

    const name = (0, _lodash().camelCase)(option.long);

    if (!passedOptions[name]) {
      // Provide commander.js like error message
      throw new Error(`Option "${option.long}" is missing`);
    }
  });
}