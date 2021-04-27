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

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function() {
    var self = this,
      args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

/**
 * Attach a websocket server to an already existing HTTP[S] server, and forward
 * the received events on the given "websocketServer" parameter. It must be an
 * object with the following fields:
 *
 *   - onClientConnect
 *   - onClientError
 *   - onClientMessage
 *   - onClientDisconnect
 */
module.exports = function attachWebsocketServer(_ref) {
  let httpServer = _ref.httpServer,
    websocketServer = _ref.websocketServer,
    path = _ref.path;

  const WebSocketServer = require("ws").Server;

  const wss = new WebSocketServer({
    server: httpServer,
    path
  });
  wss.on(
    "connection",
    /*#__PURE__*/
    (function() {
      var _ref2 = _asyncToGenerator(function*(ws) {
        let connected = true;
        const url = ws.upgradeReq.url;

        const sendFn = function() {
          if (connected) {
            ws.send.apply(ws, arguments);
          }
        };

        const client = yield websocketServer.onClientConnect(url, sendFn);

        if (client == null) {
          ws.close();
          return;
        }

        ws.on("error", e => {
          websocketServer.onClientError &&
            websocketServer.onClientError(client, e);
        });
        ws.on("close", () => {
          websocketServer.onClientDisconnect &&
            websocketServer.onClientDisconnect(client);
          connected = false;
        });
        ws.on("message", message => {
          websocketServer.onClientMessage &&
            websocketServer.onClientMessage(client, message, sendFn);
        });
      });

      return function(_x) {
        return _ref2.apply(this, arguments);
      };
    })()
  );
};
