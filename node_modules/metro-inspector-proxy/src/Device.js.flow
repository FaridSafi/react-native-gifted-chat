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

import type {Page, MessageFromDevice, MessageToDevice} from './types';
import {Observable} from 'rxjs';
import WS from 'ws';

const PAGES_POLLING_INTERVAL = 1000;

const debug = require('debug')('Metro:InspectorProxy');

// Android's stock emulator and other emulators such as genymotion use a standard localhost alias.
const EMULATOR_LOCALHOST_ADDRESSES: Array<string> = ['10.0.2.2', '10.0.3.2'];

// Prefix for script URLs that are alphanumeric IDs. See comment in _processMessageFromDevice method for
// more details.
const FILE_PREFIX = 'file://';

type DebuggerInfo = {
  // Debugger web socket connection
  socket: WS,

  // If we replaced address (like '10.0.2.2') to localhost we need to store original
  // address because Chrome uses URL or urlRegex params (instead of scriptId) to set breakpoints.
  originalSourceURLAddress?: string,

  prependedFilePrefix: boolean,
};

/**
 * Device class represents single device connection to Inspector Proxy. Each device
 * can have multiple inspectable pages.
 */
class Device {
  // ID of the device.
  _id: number;

  // Name of the device.
  _name: string;

  // Package name of the app.
  _app: string;

  // Stores socket connection between Inspector Proxy and device.
  _deviceSocket: WS;

  // Stores last list of device's pages.
  _pages: Array<Page>;

  // Maps Page ID to debugger information for the pages that are currently
  // debugged.
  _debuggerConnections: Map<string, DebuggerInfo>;

  constructor(id: number, name: string, app: string, socket: WS) {
    this._id = id;
    this._name = name;
    this._app = app;
    this._pages = [];
    this._debuggerConnections = new Map();
    this._deviceSocket = socket;
    this._deviceSocket.on('message', (message: string) => {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.event !== 'getPages') {
        debug('<- From device: ' + message);
      }
      this._handleMessageFromDevice(parsedMessage);
    });
    this._deviceSocket.on('close', () => {
      // Device disconnected - close all debugger connections.
      Array.from(this._debuggerConnections.values()).forEach(({socket: WS}) =>
        socket.close(),
      );
    });

    this._setPagesPolling();
  }

  getName(): string {
    return this._name;
  }

  getPagesList(): Array<Page> {
    return this._pages;
  }

  // Handles new debugger connection to this device:
  // 1. Sends connect event to device
  // 2. Forwards all messages from the debugger to device as wrappedEvent
  // 3. Sends disconnect event to device when debugger connection socket closes.
  handleDebuggerConnection(socket: WS, pageId: string) {
    const debuggerInfo = {
      socket,
      prependedFilePrefix: false,
    };
    this._debuggerConnections.set(pageId, debuggerInfo);
    debug(`Got new debugger connection for page ${pageId} of ${this._name}`);

    this._sendMessageToDevice({
      event: 'connect',
      payload: {
        pageId,
      },
    });

    socket.on('message', (message: string) => {
      debug('<- From debugger: ' + message);
      const parsedMessage = JSON.parse(message);
      this._processMessageFromDebugger(parsedMessage, debuggerInfo);

      this._sendMessageToDevice({
        event: 'wrappedEvent',
        payload: {
          pageId,
          wrappedEvent: JSON.stringify(parsedMessage),
        },
      });
    });
    socket.on('close', () => {
      debug(`Debugger for page ${pageId} and ${this._name} disconnected.`);
      this._sendMessageToDevice({
        event: 'disconnect',
        payload: {
          pageId,
        },
      });
    });
  }

  // Handles messages received from device:
  // 1. For getPages responses updates local _pages list.
  // 2. All other messages are forwarded to debugger as wrappedEvent.
  //
  // In the future more logic will be added to this method for modifying
  // some of the messages (like updating messages with source maps and file
  // locations).
  _handleMessageFromDevice(message: MessageFromDevice) {
    if (message.event === 'getPages') {
      this._pages = message.payload;
    } else if (message.event === 'disconnect') {
      // Device sends disconnect events only when page is reloaded or
      // if debugger socket was disconnected.
      const pageId = message.payload.pageId;
      const debuggerInfo = this._debuggerConnections.get(pageId);
      const debuggerSocket = debuggerInfo ? debuggerInfo.socket : null;
      if (debuggerSocket && debuggerSocket.readyState == WS.OPEN) {
        debug(`Page ${pageId} is reloading.`);
        debuggerSocket.send(JSON.stringify({method: 'reload'}));
      }
    } else if (message.event === 'wrappedEvent') {
      const pageId = message.payload.pageId;
      const debuggerInfo = this._debuggerConnections.get(pageId);
      if (debuggerInfo == null) {
        return;
      }

      const debuggerSocket = debuggerInfo.socket;
      if (debuggerSocket == null) {
        // TODO(hypuk): Send error back to device?
        return;
      }

      const parsedPayload = JSON.parse(message.payload.wrappedEvent);
      this._processMessageFromDevice(parsedPayload, debuggerInfo);

      const messageToSend = JSON.stringify(parsedPayload);
      debug('-> To debugger: ' + messageToSend);
      debuggerSocket.send(messageToSend);
    }
  }

  // Sends single message to device.
  _sendMessageToDevice(message: MessageToDevice) {
    try {
      if (message.event !== 'getPages') {
        debug('-> To device' + JSON.stringify(message));
      }
      this._deviceSocket.send(JSON.stringify(message));
    } catch (error) {}
  }

  // Sends 'getPages' request to device every PAGES_POLLING_INTERVAL milliseconds.
  _setPagesPolling() {
    Observable.interval(PAGES_POLLING_INTERVAL).subscribe(_ =>
      this._sendMessageToDevice({event: 'getPages'}),
    );
  }

  // Allows to make changes in incoming message from device.
  // eslint-disable-next-line lint/no-unclear-flowtypes
  _processMessageFromDevice(payload: Object, debuggerInfo: DebuggerInfo) {
    // Replace Android addresses for scriptParsed event.
    if (payload.method === 'Debugger.scriptParsed') {
      const params = payload.params || {};
      if ('sourceMapURL' in params) {
        for (let i = 0; i < EMULATOR_LOCALHOST_ADDRESSES.length; ++i) {
          const address = EMULATOR_LOCALHOST_ADDRESSES[i];
          if (params.sourceMapURL.indexOf(address) >= 0) {
            payload.params.sourceMapURL = params.sourceMapURL.replace(
              address,
              'localhost',
            );
            debuggerInfo.originalSourceURLAddress = address;
          }
        }
      }
      if ('url' in params) {
        for (let i = 0; i < EMULATOR_LOCALHOST_ADDRESSES.length; ++i) {
          const address = EMULATOR_LOCALHOST_ADDRESSES[i];
          if (params.url.indexOf(address) >= 0) {
            payload.params.url = params.url.replace(address, 'localhost');
            debuggerInfo.originalSourceURLAddress = address;
          }
        }

        // Chrome doesn't download source maps if URL param is not a valid
        // URL. Some frameworks pass alphanumeric script ID instead of URL which causes
        // Chrome to not download source maps. In this case we want to prepend script ID
        // with 'file://' prefix.
        if (payload.params.url.match(/^[0-9a-z]+$/)) {
          payload.params.url = FILE_PREFIX + payload.params.url;
          debuggerInfo.prependedFilePrefix = true;
        }
      }
    }
  }

  // Allows to make changes in incoming messages from debugger.
  // eslint-disable-next-line lint/no-unclear-flowtypes
  _processMessageFromDebugger(payload: Object, debuggerInfo: DebuggerInfo) {
    // If we replaced Android emulator's address to localhost we need to change it back.
    if (
      payload.method === 'Debugger.setBreakpointByUrl' &&
      debuggerInfo.originalSourceURLAddress
    ) {
      const params = payload.params || {};
      if ('url' in params) {
        payload.params.url = params.url.replace(
          'localhost',
          debuggerInfo.originalSourceURLAddress,
        );

        if (
          payload.params.url.startsWith(FILE_PREFIX) &&
          debuggerInfo.prependedFilePrefix
        ) {
          // Remove fake URL prefix if we modified URL in _processMessageFromDevice.
          payload.params.url = payload.params.url.slice(FILE_PREFIX.length);
        }
      }
      if ('urlRegex' in params) {
        payload.params.urlRegex = params.urlRegex.replace(
          'localhost',
          debuggerInfo.originalSourceURLAddress,
        );
      }
    }
  }
}

module.exports = Device;
