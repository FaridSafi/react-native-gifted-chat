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

var _versionRanges = _interopRequireDefault(require("../versionRanges"));

var _checkInstallation = require("../checkInstallation");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  label: 'Android NDK',
  description: 'Required for building React Native from the source',
  getDiagnostics: async ({
    SDKs
  }) => {
    const androidSdk = SDKs['Android SDK'];
    const version = androidSdk === 'Not Found' ? androidSdk : androidSdk['Android NDK'];
    return {
      needsToBeFixed: (0, _checkInstallation.doesSoftwareNeedToBeFixed)({
        version,
        versionRange: _versionRanges.default.ANDROID_NDK
      }),
      version,
      versionRange: _versionRanges.default.ANDROID_NDK
    };
  },
  runAutomaticFix: async ({
    loader,
    environmentInfo
  }) => {
    const androidSdk = environmentInfo.SDKs['Android SDK'];
    const isNDKInstalled = androidSdk !== 'Not Found' && androidSdk['Android NDK'] !== 'Not Found';
    loader.fail();

    if (isNDKInstalled) {
      return (0, _common.logManualInstallation)({
        message: `Read more about how to update Android NDK at ${_chalk().default.dim('https://developer.android.com/ndk/downloads')}`
      });
    }

    return (0, _common.logManualInstallation)({
      healthcheck: 'Android NDK',
      url: 'https://developer.android.com/ndk/downloads'
    });
  }
};
exports.default = _default;