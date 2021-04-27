"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveReactNativePath;

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

var _resolveNodeModuleDir = _interopRequireDefault(require("./resolveNodeModuleDir"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Finds path to React Native inside `node_modules` or throws
 * an error otherwise.
 */
function resolveReactNativePath(root) {
  try {
    return (0, _resolveNodeModuleDir.default)(root, 'react-native');
  } catch (_ignored) {
    throw new (_cliTools().CLIError)(`
      Unable to find React Native files looking up from ${root}. Make sure "react-native" module is installed
      in your project dependencies.

      If you are using React Native from a non-standard location, consider setting:
      {
        reactNativePath: "./path/to/react-native"
      }
      in your \`react-native.config.js\`.
    `);
  }
}