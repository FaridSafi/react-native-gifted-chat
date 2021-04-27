"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rawBodyMiddleware;

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function rawBodyMiddleware(req, _res, next) {
  req.rawBody = '';
  req.setEncoding('utf8');
  req.on('data', chunk => {
    req.rawBody += chunk;
  });
  req.on('end', () => {
    next();
  });
}