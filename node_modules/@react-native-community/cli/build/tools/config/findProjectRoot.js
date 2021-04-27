"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findProjectRoot;

function _findUp() {
  const data = _interopRequireDefault(require("find-up"));

  _findUp = function () {
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

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Finds project root by looking for a closest `package.json`.
 */
function findProjectRoot(cwd = process.cwd()) {
  const packageLocation = _findUp().default.sync('package.json', {
    cwd
  });
  /**
   * It is possible that `package.json` doesn't exist
   * in the tree. In that case, we want to throw an error.
   *
   * When executing via `npx`, this will never happen as `npm`
   * requires that file to be present in order to run.
   */


  if (!packageLocation) {
    throw new (_cliTools().CLIError)(`
      We couldn't find a package.json in your project.
      Are you sure you are running it inside a React Native project?
    `);
  }

  return _path().default.dirname(packageLocation);
}