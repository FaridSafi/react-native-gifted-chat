"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const getDefaultUserTerminal = () => process.env.REACT_TERMINAL || process.env.TERM_PROGRAM;

var _default = getDefaultUserTerminal;
exports.default = _default;