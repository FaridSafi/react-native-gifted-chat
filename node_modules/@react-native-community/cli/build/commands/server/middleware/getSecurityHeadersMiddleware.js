"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getSecurityHeadersMiddleware;

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function getSecurityHeadersMiddleware(req, res, next) {
  // @ts-ignore Property 'client' does not exist on type 'IncomingMessage', verify
  const address = req.client.server.address(); // Block any cross origin request.

  if (req.headers.origin && req.headers.origin !== `http://localhost:${address.port}`) {
    next(new Error('Unauthorized request from ' + req.headers.origin + '. This may happen because of a conflicting browser extension. Please try to disable it and try again.'));
    return;
  } // Block MIME-type sniffing.


  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
}