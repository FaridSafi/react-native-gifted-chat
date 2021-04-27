"use strict";

exports.__esModule = true;
exports.default = void 0;

var _ExecutionEnvironment = require("fbjs/lib/ExecutionEnvironment");

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

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
var initialURL = _ExecutionEnvironment.canUseDOM ? window.location.href : '';
var Linking = {
  addEventListener: function addEventListener() {},
  removeEventListener: function removeEventListener() {},
  canOpenURL: function canOpenURL() {
    return Promise.resolve(true);
  },
  getInitialURL: function getInitialURL() {
    return Promise.resolve(initialURL);
  },
  openURL: function openURL(url) {
    try {
      open(url);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },
  _validateURL: function _validateURL(url) {
    (0, _invariant.default)(typeof url === 'string', 'Invalid URL: should be a string. Was: ' + url);
    (0, _invariant.default)(url, 'Invalid URL: cannot be empty');
  }
};

var open = function open(url) {
  if (_ExecutionEnvironment.canUseDOM) {
    window.location = new URL(url, window.location).toString();
  }
};

var _default = Linking;
exports.default = _default;
module.exports = exports.default;