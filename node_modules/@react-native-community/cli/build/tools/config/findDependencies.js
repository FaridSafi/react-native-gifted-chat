"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findDependencies;

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns an array of dependencies from project's package.json
 */
function findDependencies(root) {
  let pjson;

  try {
    pjson = JSON.parse(_fs().default.readFileSync(_path().default.join(root, 'package.json'), 'UTF-8'));
  } catch (e) {
    return [];
  }

  const deps = [...Object.keys(pjson.dependencies || {}), ...Object.keys(pjson.devDependencies || {})];
  return deps;
}