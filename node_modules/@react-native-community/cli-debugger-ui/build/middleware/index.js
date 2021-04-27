"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debuggerUIMiddleware = debuggerUIMiddleware;

function _serveStatic() {
  const data = _interopRequireDefault(require("serve-static"));

  _serveStatic = function () {
    return data;
  };

  return data;
}

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

function debuggerUIMiddleware() {
  return (0, _serveStatic().default)(_path().default.join(__dirname, '..', 'ui'));
}