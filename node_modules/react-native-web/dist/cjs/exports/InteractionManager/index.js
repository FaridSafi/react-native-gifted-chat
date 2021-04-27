"use strict";

exports.__esModule = true;
exports.default = void 0;

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

var _requestIdleCallback = _interopRequireWildcard(require("../../modules/requestIdleCallback"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
var InteractionManager = {
  Events: {
    interactionStart: 'interactionStart',
    interactionComplete: 'interactionComplete'
  },

  /**
   * Schedule a function to run after all interactions have completed.
   */
  runAfterInteractions: function runAfterInteractions(task) {
    var handle;
    var promise = new Promise(function (resolve) {
      handle = (0, _requestIdleCallback.default)(function () {
        if (task) {
          resolve(task());
        } else {
          resolve();
        }
      });
    });
    return {
      then: promise.then.bind(promise),
      done: promise.then.bind(promise),
      cancel: function cancel() {
        (0, _requestIdleCallback.cancelIdleCallback)(handle);
      }
    };
  },

  /**
   * Notify manager that an interaction has started.
   */
  createInteractionHandle: function createInteractionHandle() {
    return 1;
  },

  /**
   * Notify manager that an interaction has completed.
   */
  clearInteractionHandle: function clearInteractionHandle(handle) {
    (0, _invariant.default)(!!handle, 'Must provide a handle to clear.');
  },
  addListener: function addListener() {}
};
var _default = InteractionManager;
exports.default = _default;
module.exports = exports.default;