"use strict";

exports.__esModule = true;
exports.default = void 0;

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
function emptyFunction() {}

var AccessibilityInfo = {
  /**
   * Query whether a screen reader is currently enabled.
   *
   * Returns a promise which resolves to a boolean.
   * The result is `true` when a screen reader is enabled and `false` otherwise.
   */
  fetch: function fetch() {
    return new Promise(function (resolve, reject) {
      resolve(true);
    });
  },

  /**
   * Add an event handler. Supported events:
   */
  addEventListener: function addEventListener(eventName, handler) {
    return {
      remove: emptyFunction
    };
  },

  /**
   * Set accessibility focus to a react component.
   */
  setAccessibilityFocus: function setAccessibilityFocus(reactTag) {},

  /**
   * Post a string to be announced by the screen reader.
   */
  announceForAccessibility: function announceForAccessibility(announcement) {},

  /**
   * Remove an event handler.
   */
  removeEventListener: function removeEventListener(eventName, handler) {
    return;
  }
};
var _default = AccessibilityInfo;
exports.default = _default;
module.exports = exports.default;