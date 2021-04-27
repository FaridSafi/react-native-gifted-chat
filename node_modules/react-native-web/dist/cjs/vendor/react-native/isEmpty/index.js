/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule isEmpty
 */
'use strict';
/**
 * Mimics empty from PHP.
 */

exports.__esModule = true;
exports.default = void 0;

function isEmpty(obj) {
  if (Array.isArray(obj)) {
    return obj.length === 0;
  } else if (typeof obj === 'object') {
    for (var i in obj) {
      return false;
    }

    return true;
  } else {
    return !obj;
  }
}

var _default = isEmpty;
exports.default = _default;
module.exports = exports.default;