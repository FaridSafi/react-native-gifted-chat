"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = indexPageMiddleware;

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
    return data;
  };

  return data;
}

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
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
 */
function indexPageMiddleware(req, res, next) {
  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.end(_fs().default.readFileSync(_path().default.join(__dirname, 'index.html')));
  } else {
    next();
  }
}