"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _compression() {
  const data = _interopRequireDefault(require("compression"));

  _compression = function () {
    return data;
  };

  return data;
}

function _connect() {
  const data = _interopRequireDefault(require("connect"));

  _connect = function () {
    return data;
  };

  return data;
}

function _errorhandler() {
  const data = _interopRequireDefault(require("errorhandler"));

  _errorhandler = function () {
    return data;
  };

  return data;
}

function _serveStatic() {
  const data = _interopRequireDefault(require("serve-static"));

  _serveStatic = function () {
    return data;
  };

  return data;
}

function _cliDebuggerUi() {
  const data = require("@react-native-community/cli-debugger-ui");

  _cliDebuggerUi = function () {
    return data;
  };

  return data;
}

var _indexPage = _interopRequireDefault(require("./indexPage"));

var _copyToClipBoardMiddleware = _interopRequireDefault(require("./copyToClipBoardMiddleware"));

var _getSecurityHeadersMiddleware = _interopRequireDefault(require("./getSecurityHeadersMiddleware"));

var _loadRawBodyMiddleware = _interopRequireDefault(require("./loadRawBodyMiddleware"));

var _openStackFrameInEditorMiddleware = _interopRequireDefault(require("./openStackFrameInEditorMiddleware"));

var _openURLMiddleware = _interopRequireDefault(require("./openURLMiddleware"));

var _statusPageMiddleware = _interopRequireDefault(require("./statusPageMiddleware"));

var _systraceProfileMiddleware = _interopRequireDefault(require("./systraceProfileMiddleware"));

var _getDevToolsMiddleware = _interopRequireDefault(require("./getDevToolsMiddleware"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MiddlewareManager {
  constructor(options) {
    _defineProperty(this, "app", void 0);

    _defineProperty(this, "options", void 0);

    this.options = options;
    this.app = (0, _connect().default)().use(_getSecurityHeadersMiddleware.default).use(_loadRawBodyMiddleware.default) // @ts-ignore compression and connect types mismatch
    .use((0, _compression().default)()).use('/debugger-ui', (0, _cliDebuggerUi().debuggerUIMiddleware)()).use((0, _openStackFrameInEditorMiddleware.default)(this.options)).use(_openURLMiddleware.default).use(_copyToClipBoardMiddleware.default).use(_statusPageMiddleware.default).use(_systraceProfileMiddleware.default).use(_indexPage.default).use((0, _errorhandler().default)());
  }

  serveStatic(folder) {
    // @ts-ignore serveStatic and connect types mismatch
    this.app.use((0, _serveStatic().default)(folder));
  }

  getConnectInstance() {
    return this.app;
  }

  attachDevToolsSocket(socket) {
    this.app.use((0, _getDevToolsMiddleware.default)(this.options, () => socket.isDebuggerConnected()));
  }

}

exports.default = MiddlewareManager;