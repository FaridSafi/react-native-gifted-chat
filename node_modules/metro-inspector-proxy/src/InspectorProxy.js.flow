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

const Device = require('./Device');
const WS = require('ws');

const debug = require('debug')('Metro:InspectorProxy');
const url = require('url');

import type {
  JsonPagesListResponse,
  JsonVersionResponse,
  Page,
  PageDescription,
} from './types';
import type {Server as HttpServer, IncomingMessage, ServerResponse} from 'http';
import type {Server as HttpsServer} from 'https';

const WS_DEVICE_URL = '/inspector/device';
const WS_DEBUGGER_URL = '/inspector/debug';
const PAGES_LIST_JSON_URL = '/json';
const PAGES_LIST_JSON_URL_2 = '/json/list';
const PAGES_LIST_JSON_VERSION_URL = '/json/version';

const INTERNAL_ERROR_CODE = 1011;

/**
 * Main Inspector Proxy class that connects JavaScript VM inside Android/iOS apps and JS debugger.
 */
class InspectorProxy {
  // Maps device ID to Device instance.
  _devices: Map<number, Device>;

  // Internal counter for device IDs -- just gets incremented for each new device.
  _deviceCounter: number = 0;

  // We store server's address with port (like '127.0.0.1:8081') to be able to build URLs
  // (devtoolsFrontendUrl and webSocketDebuggerUrl) for page descriptions. These URLs are used
  // by debugger to know where to connect.
  _serverAddressWithPort: string = '';

  constructor() {
    this._devices = new Map();
  }

  // Process HTTP request sent to server. We only respond to 2 HTTP requests:
  // 1. /json/version returns Chrome debugger protocol version that we use
  // 2. /json and /json/list returns list of page descriptions (list of inspectable apps).
  // This list is combined from all the connected devices.
  processRequest(
    request: IncomingMessage,
    response: ServerResponse,
    next: (?Error) => mixed,
  ) {
    if (
      request.url === PAGES_LIST_JSON_URL ||
      request.url === PAGES_LIST_JSON_URL_2
    ) {
      // Build list of pages from all devices.
      let result = [];
      Array.from(this._devices.entries()).forEach(
        ([deviceId: number, device: Device]) => {
          result = result.concat(
            device
              .getPagesList()
              .map((page: Page) =>
                this._buildPageDescription(deviceId, device, page),
              ),
          );
        },
      );

      this._sendJsonResponse(response, result);
    } else if (request.url === PAGES_LIST_JSON_VERSION_URL) {
      this._sendJsonResponse(response, {
        Browser: 'Mobile JavaScript',
        'Protocol-Version': '1.1',
      });
    } else {
      next();
    }
  }

  // Adds websocket listeners to the provided HTTP/HTTPS server.
  addWebSocketListener(server: HttpServer | HttpsServer) {
    const {address, port} = server.address();
    if (server.address().family === 'IPv6') {
      this._serverAddressWithPort = `[${address}]:${port}`;
    } else {
      this._serverAddressWithPort = `${address}:${port}`;
    }
    this._addDeviceConnectionHandler(server);
    this._addDebuggerConnectionHandler(server);
  }

  // Converts page information received from device into PageDescription object
  // that is sent to debugger.
  _buildPageDescription(
    deviceId: number,
    device: Device,
    page: Page,
  ): PageDescription {
    const debuggerUrl = `${
      this._serverAddressWithPort
    }${WS_DEBUGGER_URL}?device=${deviceId}&page=${page.id}`;
    const webSocketDebuggerUrl = 'ws://' + debuggerUrl;
    const devtoolsFrontendUrl =
      'chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=' +
      debuggerUrl;
    return {
      id: `${deviceId}-${page.id}`,
      description: page.app,
      title: page.title,
      faviconUrl: 'https://reactjs.org/favicon.ico',
      devtoolsFrontendUrl,
      type: 'node',
      webSocketDebuggerUrl,
      vm: page.vm,
    };
  }

  // Sends object as response to HTTP request.
  // Just serializes object using JSON and sets required headers.
  _sendJsonResponse(
    response: ServerResponse,
    object: JsonPagesListResponse | JsonVersionResponse,
  ) {
    const data = JSON.stringify(object, null, 2);
    response.writeHead(200, {
      'Content-Type': 'application/json; charset=UTF-8',
      'Cache-Control': 'no-cache',
      'Content-Length': data.length.toString(),
      Connection: 'close',
    });
    response.end(data);
  }

  // Adds websocket handler for device connections.
  // Device connects to /inspector/device and passes device and app names as
  // HTTP GET params.
  // For each new websocket connection we parse device and app names and create
  // new instance of Device class.
  _addDeviceConnectionHandler(server: HttpServer | HttpsServer) {
    const wss = new WS.Server({
      server,
      path: WS_DEVICE_URL,
      perMessageDeflate: true,
    });
    wss.on('connection', async (socket: WS) => {
      try {
        const query = url.parse(socket.upgradeReq.url || '', true).query || {};
        const deviceName = query.name || 'Unknown';
        const appName = query.app || 'Unknown';
        const deviceId = this._deviceCounter++;
        this._devices.set(
          deviceId,
          new Device(deviceId, deviceName, appName, socket),
        );

        debug(`Got new connection: device=${deviceName}, app=${appName}`);

        socket.on('close', () => {
          this._devices.delete(deviceId);
          debug(`Device ${deviceName} disconnected.`);
        });
      } catch (e) {
        console.error('error', e);
        socket.close(INTERNAL_ERROR_CODE, e);
      }
    });
  }

  // Adds websocket handler for debugger connections.
  // Debugger connects to webSocketDebuggerUrl that we return as part of page description
  // in /json response.
  // When debugger connects we try to parse device and page IDs from the query and pass
  // websocket object to corresponding Device instance.
  _addDebuggerConnectionHandler(server: HttpServer | HttpsServer) {
    const wss = new WS.Server({
      server,
      path: WS_DEBUGGER_URL,
      perMessageDeflate: false,
    });
    wss.on('connection', async (socket: WS) => {
      try {
        const query = url.parse(socket.upgradeReq.url || '', true).query || {};
        const deviceId = query.device;
        const pageId = query.page;

        if (deviceId == null || pageId == null) {
          throw new Error('Incorrect URL - must provide device and page IDs');
        }

        const device = this._devices.get(parseInt(deviceId, 10));
        if (device == null) {
          throw new Error('Unknown device with ID ' + deviceId);
        }

        device.handleDebuggerConnection(socket, pageId);
      } catch (e) {
        console.error(e);
        socket.close(INTERNAL_ERROR_CODE, e);
      }
    });
  }
}

module.exports = InspectorProxy;
