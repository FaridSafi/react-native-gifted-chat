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

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

const Device = require("./Device");

const WS = require("ws");

const debug = require("debug")("Metro:InspectorProxy");

const url = require("url");

const WS_DEVICE_URL = "/inspector/device";
const WS_DEBUGGER_URL = "/inspector/debug";
const PAGES_LIST_JSON_URL = "/json";
const PAGES_LIST_JSON_URL_2 = "/json/list";
const PAGES_LIST_JSON_VERSION_URL = "/json/version";
const INTERNAL_ERROR_CODE = 1011;
/**
 * Main Inspector Proxy class that connects JavaScript VM inside Android/iOS apps and JS debugger.
 */

class InspectorProxy {
  // Maps device ID to Device instance.
  // Internal counter for device IDs -- just gets incremented for each new device.
  // We store server's address with port (like '127.0.0.1:8081') to be able to build URLs
  // (devtoolsFrontendUrl and webSocketDebuggerUrl) for page descriptions. These URLs are used
  // by debugger to know where to connect.
  constructor() {
    _defineProperty(this, "_deviceCounter", 0);

    _defineProperty(this, "_serverAddressWithPort", "");

    this._devices = new Map();
  } // Process HTTP request sent to server. We only respond to 2 HTTP requests:
  // 1. /json/version returns Chrome debugger protocol version that we use
  // 2. /json and /json/list returns list of page descriptions (list of inspectable apps).
  // This list is combined from all the connected devices.

  processRequest(request, response, next) {
    if (
      request.url === PAGES_LIST_JSON_URL ||
      request.url === PAGES_LIST_JSON_URL_2
    ) {
      // Build list of pages from all devices.
      let result = [];
      Array.from(this._devices.entries()).forEach(_ref => {
        let _ref2 = _slicedToArray(_ref, 2),
          deviceId = _ref2[0],
          device = _ref2[1];

        result = result.concat(
          device
            .getPagesList()
            .map(page => this._buildPageDescription(deviceId, device, page))
        );
      });

      this._sendJsonResponse(response, result);
    } else if (request.url === PAGES_LIST_JSON_VERSION_URL) {
      this._sendJsonResponse(response, {
        Browser: "Mobile JavaScript",
        "Protocol-Version": "1.1"
      });
    } else {
      next();
    }
  } // Adds websocket listeners to the provided HTTP/HTTPS server.

  addWebSocketListener(server) {
    const _server$address = server.address(),
      address = _server$address.address,
      port = _server$address.port;

    if (server.address().family === "IPv6") {
      this._serverAddressWithPort = `[${address}]:${port}`;
    } else {
      this._serverAddressWithPort = `${address}:${port}`;
    }

    this._addDeviceConnectionHandler(server);

    this._addDebuggerConnectionHandler(server);
  } // Converts page information received from device into PageDescription object
  // that is sent to debugger.

  _buildPageDescription(deviceId, device, page) {
    const debuggerUrl = `${
      this._serverAddressWithPort
    }${WS_DEBUGGER_URL}?device=${deviceId}&page=${page.id}`;
    const webSocketDebuggerUrl = "ws://" + debuggerUrl;
    const devtoolsFrontendUrl =
      "chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=" +
      debuggerUrl;
    return {
      id: `${deviceId}-${page.id}`,
      description: page.app,
      title: page.title,
      faviconUrl: "https://reactjs.org/favicon.ico",
      devtoolsFrontendUrl,
      type: "node",
      webSocketDebuggerUrl,
      vm: page.vm
    };
  } // Sends object as response to HTTP request.
  // Just serializes object using JSON and sets required headers.

  _sendJsonResponse(response, object) {
    const data = JSON.stringify(object, null, 2);
    response.writeHead(200, {
      "Content-Type": "application/json; charset=UTF-8",
      "Cache-Control": "no-cache",
      "Content-Length": data.length.toString(),
      Connection: "close"
    });
    response.end(data);
  } // Adds websocket handler for device connections.
  // Device connects to /inspector/device and passes device and app names as
  // HTTP GET params.
  // For each new websocket connection we parse device and app names and create
  // new instance of Device class.

  _addDeviceConnectionHandler(server) {
    var _this = this;

    const wss = new WS.Server({
      server,
      path: WS_DEVICE_URL,
      perMessageDeflate: true
    });
    wss.on(
      "connection",
      /*#__PURE__*/
      (function() {
        var _ref3 = _asyncToGenerator(function*(socket) {
          try {
            const query =
              url.parse(socket.upgradeReq.url || "", true).query || {};
            const deviceName = query.name || "Unknown";
            const appName = query.app || "Unknown";
            const deviceId = _this._deviceCounter++;

            _this._devices.set(
              deviceId,
              new Device(deviceId, deviceName, appName, socket)
            );

            debug(`Got new connection: device=${deviceName}, app=${appName}`);
            socket.on("close", () => {
              _this._devices.delete(deviceId);

              debug(`Device ${deviceName} disconnected.`);
            });
          } catch (e) {
            console.error("error", e);
            socket.close(INTERNAL_ERROR_CODE, e);
          }
        });

        return function(_x) {
          return _ref3.apply(this, arguments);
        };
      })()
    );
  } // Adds websocket handler for debugger connections.
  // Debugger connects to webSocketDebuggerUrl that we return as part of page description
  // in /json response.
  // When debugger connects we try to parse device and page IDs from the query and pass
  // websocket object to corresponding Device instance.

  _addDebuggerConnectionHandler(server) {
    var _this2 = this;

    const wss = new WS.Server({
      server,
      path: WS_DEBUGGER_URL,
      perMessageDeflate: false
    });
    wss.on(
      "connection",
      /*#__PURE__*/
      (function() {
        var _ref4 = _asyncToGenerator(function*(socket) {
          try {
            const query =
              url.parse(socket.upgradeReq.url || "", true).query || {};
            const deviceId = query.device;
            const pageId = query.page;

            if (deviceId == null || pageId == null) {
              throw new Error(
                "Incorrect URL - must provide device and page IDs"
              );
            }

            const device = _this2._devices.get(parseInt(deviceId, 10));

            if (device == null) {
              throw new Error("Unknown device with ID " + deviceId);
            }

            device.handleDebuggerConnection(socket, pageId);
          } catch (e) {
            console.error(e);
            socket.close(INTERNAL_ERROR_CODE, e);
          }
        });

        return function(_x2) {
          return _ref4.apply(this, arguments);
        };
      })()
    );
  }
}

module.exports = InspectorProxy;
