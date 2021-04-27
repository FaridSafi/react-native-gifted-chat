"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveNodeModuleDir;

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Finds a path inside `node_modules`
 */
function resolveNodeModuleDir(root, packageName) {
  return _path().default.dirname(require.resolve(_path().default.join(packageName, 'package.json'), {
    paths: [root]
  }));
}