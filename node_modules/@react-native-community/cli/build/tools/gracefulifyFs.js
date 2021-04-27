"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
    return data;
  };

  return data;
}

function _gracefulFs() {
  const data = _interopRequireDefault(require("graceful-fs"));

  _gracefulFs = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_gracefulFs().default.gracefulify(_fs().default);

var _default = _gracefulFs().default;

exports.default = _default;