"use strict";

exports.__esModule = true;
exports.default = void 0;

/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

/* global HTMLElement */
var getBoundingClientRect = function getBoundingClientRect(node) {
  if (node) {
    var isElement = node.nodeType === 1;
    /* Node.ELEMENT_NODE */

    if (isElement && typeof node.getBoundingClientRect === 'function') {
      return node.getBoundingClientRect();
    }
  }
};

var _default = getBoundingClientRect;
exports.default = _default;
module.exports = exports.default;