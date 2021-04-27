"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = replacePathSepForRegex;

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function replacePathSepForRegex(string) {
  if (_path().default.sep === '\\') {
    return string.replace(/(\/|(.)?\\(?![[\]{}()*+?.^$|\\]))/g, (_match, _, p2) => p2 && p2 !== '\\' ? p2 + '\\\\' : '\\\\');
  }

  return string;
}