/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */
'use strict';

const EventEmitter = require('eventemitter3');

import type {HmrMessage} from './types.flow';

type SocketState = 'opening' | 'open' | 'closed';

/**
 * The Hot Module Reloading Client connects to Metro via WebSocket, to receive
 * updates from it and propagate them to the runtime to reflect the changes.
 */
class WebSocketHMRClient extends EventEmitter {
  _ws: WebSocket;
  _queue: Array<string> = [];
  _state: SocketState = 'opening';

  constructor(url: string) {
    super();

    // Access the global WebSocket object only after enabling the client,
    // since some polyfills do the initialization lazily.
    this._ws = new global.WebSocket(url);
    this._ws.onopen = () => {
      this._state = 'open';
      this.emit('open');
      this._flushQueue();
    };
    this._ws.onerror = error => {
      this.emit('connection-error', error);
    };
    this._ws.onclose = () => {
      this._state = 'closed';
      this.emit('close');
    };
    this._ws.onmessage = message => {
      const data: HmrMessage = JSON.parse(message.data);

      switch (data.type) {
        case 'bundle-registered':
          this.emit('bundle-registered');
          break;

        case 'update-start':
          this.emit('update-start', data.body);
          break;

        case 'update':
          this.emit('update', data.body);
          break;

        case 'update-done':
          this.emit('update-done');
          break;

        case 'error':
          this.emit('error', data.body);
          break;

        default:
          this.emit('error', {type: 'unknown-message', message: data});
      }
    };
  }

  close(): void {
    this._ws.close();
  }

  send(message: string): void {
    switch (this._state) {
      case 'opening':
        this._queue.push(message);
        break;
      case 'open':
        this._ws.send(message);
        break;
      case 'closed':
        // Ignore.
        break;
      default:
        throw new Error('[WebSocketHMRClient] Unknown state: ' + this._state);
    }
  }

  _flushQueue(): void {
    this._queue.forEach(message => this.send(message));
    this._queue.length = 0;
  }
}

module.exports = WebSocketHMRClient;
