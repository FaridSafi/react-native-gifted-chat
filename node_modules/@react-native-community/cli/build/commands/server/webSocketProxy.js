"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _ws() {
  const data = _interopRequireDefault(require("ws"));

  _ws = function () {
    return data;
  };

  return data;
}

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
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
 *
 * @format
 */
function attachToServer(server, path) {
  const WebSocketServer = _ws().default.Server;

  const wss = new WebSocketServer({
    server,
    path
  });
  let debuggerSocket;
  let clientSocket;

  function send(dest, message) {
    if (!dest) {
      return;
    }

    try {
      dest.send(message);
    } catch (e) {
      _cliTools().logger.warn(e); // Sometimes this call throws 'not opened'

    }
  }

  const debuggerSocketCloseHandler = () => {
    debuggerSocket = null;

    if (clientSocket) {
      clientSocket.close(1011, 'Debugger was disconnected');
    }
  };

  const clientSocketCloseHandler = () => {
    clientSocket = null;
    send(debuggerSocket, JSON.stringify({
      method: '$disconnected'
    }));
  };

  wss.on('connection', connection => {
    // @ts-ignore current definition of ws does not have upgradeReq type
    const {
      url
    } = connection.upgradeReq;

    if (url.indexOf('role=debugger') > -1) {
      if (debuggerSocket) {
        connection.close(1011, 'Another debugger is already connected');
        return;
      }

      debuggerSocket = connection;

      if (debuggerSocket) {
        debuggerSocket.onerror = debuggerSocketCloseHandler;
        debuggerSocket.onclose = debuggerSocketCloseHandler;

        debuggerSocket.onmessage = ({
          data
        }) => send(clientSocket, data);
      }
    } else if (url.indexOf('role=client') > -1) {
      if (clientSocket) {
        // @ts-ignore not nullable with current type definition of ws
        clientSocket.onerror = null; // @ts-ignore not nullable with current type definition of ws

        clientSocket.onclose = null; // @ts-ignore not nullable with current type definition of ws

        clientSocket.onmessage = null;
        clientSocket.close(1011, 'Another client connected');
      }

      clientSocket = connection;
      clientSocket.onerror = clientSocketCloseHandler;
      clientSocket.onclose = clientSocketCloseHandler;

      clientSocket.onmessage = ({
        data
      }) => send(debuggerSocket, data);
    } else {
      connection.close(1011, 'Missing role param');
    }
  });
  return {
    server: wss,

    isDebuggerConnected() {
      return !!debuggerSocket;
    }

  };
}

var _default = {
  attachToServer
};
exports.default = _default;