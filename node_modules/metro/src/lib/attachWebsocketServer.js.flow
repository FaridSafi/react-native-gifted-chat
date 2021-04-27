/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

'use strict';

import type {Server as HttpServer} from 'http';
import type {Server as HttpsServer} from 'https';

type WebsocketServiceInterface<T> = {
  +onClientConnect: (
    url: string,
    sendFn: (data: string) => void,
  ) => Promise<?T>,
  +onClientDisconnect?: (client: T) => mixed,
  +onClientError?: (client: T, e: Error) => mixed,
  +onClientMessage?: (
    client: T,
    message: string,
    sendFn: (data: string) => void,
  ) => mixed,
};

type HMROptions<TClient> = {
  httpServer: HttpServer | HttpsServer,
  websocketServer: WebsocketServiceInterface<TClient>,
  path: string,
};

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

module.exports = function attachWebsocketServer<TClient: Object>({
  httpServer,
  websocketServer,
  path,
}: HMROptions<TClient>): void {
  const WebSocketServer = require('ws').Server;
  const wss = new WebSocketServer({
    server: httpServer,
    path,
  });

  wss.on('connection', async ws => {
    let connected = true;
    const url = ws.upgradeReq.url;

    const sendFn = (...args) => {
      if (connected) {
        ws.send(...args);
      }
    };

    const client = await websocketServer.onClientConnect(url, sendFn);

    if (client == null) {
      ws.close();
      return;
    }

    ws.on('error', e => {
      websocketServer.onClientError && websocketServer.onClientError(client, e);
    });

    ws.on('close', () => {
      websocketServer.onClientDisconnect &&
        websocketServer.onClientDisconnect(client);
      connected = false;
    });

    ws.on('message', message => {
      websocketServer.onClientMessage &&
        websocketServer.onClientMessage(client, message, sendFn);
    });
  });
};
