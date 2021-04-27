"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getEnvironmentInfo;

function _envinfo() {
  const data = _interopRequireDefault(require("envinfo"));

  _envinfo = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore
async function getEnvironmentInfo() {
  return JSON.parse((await _envinfo().default.run({
    Binaries: ['Node', 'Yarn', 'npm', 'Watchman'],
    IDEs: ['Xcode', 'Android Studio'],
    SDKs: ['iOS SDK', 'Android SDK'],
    npmPackages: ['react', 'react-native', '@react-native-community/cli'],
    npmGlobalPackages: ['*react-native*']
  }, {
    json: true,
    showNotFound: true
  })));
}