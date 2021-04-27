"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _url() {
  const data = _interopRequireDefault(require("url"));

  _url = function () {
    return data;
  };

  return data;
}

function _ws() {
  const data = require("ws");

  _ws = function () {
    return data;
  };

  return data;
}

function _nodeNotifier() {
  const data = _interopRequireDefault(require("node-notifier"));

  _nodeNotifier = function () {
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
 */
const PROTOCOL_VERSION = 2;

function parseMessage(data, binary) {
  if (binary) {
    _cliTools().logger.error('Expected text message, got binary!');

    return undefined;
  }

  try {
    const message = JSON.parse(data);

    if (message.version === PROTOCOL_VERSION) {
      return message;
    }

    _cliTools().logger.error(`Received message had wrong protocol version: ${message.version}`);
  } catch (e) {
    _cliTools().logger.error(`Failed to parse the message as JSON:\n${data}`);
  }

  return undefined;
}

function isBroadcast(message) {
  return typeof message.method === 'string' && message.id === undefined && message.target === undefined;
}

function isRequest(message) {
  return typeof message.method === 'string' && typeof message.target === 'string';
}

function isResponse(message) {
  return typeof message.id === 'object' && typeof message.id.requestId !== 'undefined' && typeof message.id.clientId === 'string' && (message.result !== undefined || message.error !== undefined);
}

function attachToServer(server, path) {
  const wss = new (_ws().Server)({
    server,
    path
  });
  const clients = new Map();
  let nextClientId = 0;

  function getClientWs(clientId) {
    const clientWs = clients.get(clientId);

    if (clientWs === undefined) {
      throw new Error(`could not find id "${clientId}" while forwarding request`);
    }

    return clientWs;
  }

  function handleSendBroadcast(broadcasterId, message) {
    const forwarded = {
      version: PROTOCOL_VERSION,
      method: message.method,
      params: message.params
    };

    if (clients.size === 0) {
      _nodeNotifier().default.notify({
        title: 'React Native: No apps connected',
        message: `Sending '${message.method}' to all React Native apps ` + 'failed. Make sure your app is running in the simulator ' + 'or on a phone connected via USB.'
      });
    }

    for (const [otherId, otherWs] of clients) {
      if (otherId !== broadcasterId) {
        try {
          otherWs.send(JSON.stringify(forwarded));
        } catch (e) {
          _cliTools().logger.error(`Failed to send broadcast to client: '${otherId}' ` + `due to:\n ${e.toString()}`);
        }
      }
    }
  }

  wss.on('connection', clientWs => {
    const clientId = `client#${nextClientId++}`;

    function handleCaughtError(message, error) {
      const errorMessage = {
        id: message.id,
        method: message.method,
        target: message.target,
        error: message.error === undefined ? 'undefined' : 'defined',
        params: message.params === undefined ? 'undefined' : 'defined',
        result: message.result === undefined ? 'undefined' : 'defined'
      };

      if (message.id === undefined) {
        _cliTools().logger.error(`Handling message from ${clientId} failed with:\n${error}\n` + `message:\n${JSON.stringify(errorMessage)}`);
      } else {
        try {
          clientWs.send(JSON.stringify({
            version: PROTOCOL_VERSION,
            error,
            id: message.id
          }));
        } catch (e) {
          _cliTools().logger.error(`Failed to reply to ${clientId} with error:\n${error}` + `\nmessage:\n${JSON.stringify(errorMessage)}` + `\ndue to error: ${e.toString()}`);
        }
      }
    }

    function handleServerRequest(message) {
      let result = null;

      switch (message.method) {
        case 'getid':
          result = clientId;
          break;

        case 'getpeers':
          result = {};
          clients.forEach((otherWs, otherId) => {
            if (clientId !== otherId) {
              result[otherId] = _url().default.parse(otherWs.upgradeReq.url, true).query;
            }
          });
          break;

        default:
          throw new Error(`unknown method: ${message.method}`);
      }

      clientWs.send(JSON.stringify({
        version: PROTOCOL_VERSION,
        result,
        id: message.id
      }));
    }

    function forwardRequest(message) {
      getClientWs(message.target).send(JSON.stringify({
        version: PROTOCOL_VERSION,
        method: message.method,
        params: message.params,
        id: message.id === undefined ? undefined : {
          requestId: message.id,
          clientId
        }
      }));
    }

    function forwardResponse(message) {
      if (!message.id) {
        return;
      }

      getClientWs(message.id.clientId).send(JSON.stringify({
        version: PROTOCOL_VERSION,
        result: message.result,
        error: message.error,
        id: message.id.requestId
      }));
    }

    clients.set(clientId, clientWs);

    const onCloseHandler = () => {
      // @ts-ignore
      clientWs.onmessage = null;
      clients.delete(clientId);
    };

    clientWs.onclose = onCloseHandler;
    clientWs.onerror = onCloseHandler;

    clientWs.onmessage = event => {
      const message = parseMessage(event.data, event.binary);

      if (message === undefined) {
        _cliTools().logger.error('Received message not matching protocol');

        return;
      }

      try {
        if (isBroadcast(message)) {
          handleSendBroadcast(clientId, message);
        } else if (isRequest(message)) {
          if (message.target === 'server') {
            handleServerRequest(message);
          } else {
            forwardRequest(message);
          }
        } else if (isResponse(message)) {
          forwardResponse(message);
        } else {
          throw new Error('Invalid message, did not match the protocol');
        }
      } catch (e) {
        handleCaughtError(message, e.toString());
      }
    };
  });
  return {
    isDebuggerConnected: () => true,
    broadcast: (method, params) => {
      handleSendBroadcast(null, {
        method,
        params
      });
    }
  };
}

var _default = {
  attachToServer,
  parseMessage
};
exports.default = _default;