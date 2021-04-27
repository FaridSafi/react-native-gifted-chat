"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = groupFilesByType;

function _lodash() {
  const data = require("lodash");

  _lodash = function () {
    return data;
  };

  return data;
}

function _mime() {
  const data = _interopRequireDefault(require("mime"));

  _mime = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Given an array of files, it groups it by it's type.
 * Type of the file is inferred from it's mimetype based on the extension
 * file ends up with. The returned value is an object with properties that
 * correspond to the first part of the mimetype, e.g. images will be grouped
 * under `image` key since the mimetype for them is `image/jpg` etc.
 *
 * Example:
 * Given an array ['fonts/a.ttf', 'images/b.jpg'],
 * the returned object will be: {font: ['fonts/a.ttf'], image: ['images/b.jpg']}
 */
function groupFilesByType(assets) {
  return (0, _lodash().groupBy)(assets, type => (_mime().default.getType(type) || '').split('/')[0]);
}