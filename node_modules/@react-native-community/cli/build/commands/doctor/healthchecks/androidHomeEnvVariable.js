"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

var _common = require("./common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// List of answers on how to set `ANDROID_HOME` for each platform
const URLS = {
  darwin: 'https://stackoverflow.com/a/28296325/4252781',
  win32: 'https://stackoverflow.com/a/54888107/4252781',
  linux: 'https://stackoverflow.com/a/39228100/4252781'
};
const label = 'ANDROID_HOME'; // Force the options for the platform to avoid providing a link
// for `ANDROID_HOME` for every platform NodeJS supports

const platform = process.platform;
const message = `Read more about how to set the ${label} at ${_chalk().default.dim(URLS[platform])}`;
var _default = {
  label,
  getDiagnostics: async () => ({
    needsToBeFixed: !process.env.ANDROID_HOME
  }),
  runAutomaticFix: async ({
    loader
  }) => {
    loader.fail();
    (0, _common.logManualInstallation)({
      message
    });
  }
};
exports.default = _default;