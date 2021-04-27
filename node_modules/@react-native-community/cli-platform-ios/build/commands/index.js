"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _logIOS = _interopRequireDefault(require("./logIOS"));

var _runIOS = _interopRequireDefault(require("./runIOS"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = [_logIOS.default, _runIOS.default];
exports.default = _default;