/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */
"use strict";

const InspectorProxy = require("./InspectorProxy"); // Runs new HTTP Server and attaches Inspector Proxy to it.
// Requires are inlined here because we don't want to import them
// when someone needs only InspectorProxy instance (without starting
// new HTTP server).

function runInspectorProxy(port) {
  const inspectorProxy = new InspectorProxy();

  const app = require("connect")();

  app.use(inspectorProxy.processRequest.bind(inspectorProxy));

  const httpServer = require("http").createServer(app);

  httpServer.listen(port, "127.0.0.1", () => {
    inspectorProxy.addWebSocketListener(httpServer);
  });
}

module.exports = {
  InspectorProxy,
  runInspectorProxy
};
