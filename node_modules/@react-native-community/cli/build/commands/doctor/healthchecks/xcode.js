"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _versionRanges = _interopRequireDefault(require("../versionRanges"));

var _checkInstallation = require("../checkInstallation");

var _common = require("./common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  label: 'Xcode',
  description: 'Required for building and installing your app on iOS',
  getDiagnostics: async ({
    IDEs
  }) => {
    const version = IDEs.Xcode.version.split('/')[0];
    return {
      needsToBeFixed: (0, _checkInstallation.doesSoftwareNeedToBeFixed)({
        version,
        versionRange: _versionRanges.default.XCODE
      }),
      version,
      versionRange: _versionRanges.default.XCODE
    };
  },
  runAutomaticFix: async ({
    loader
  }) => {
    loader.fail();
    (0, _common.logManualInstallation)({
      healthcheck: 'Xcode',
      url: 'https://developer.apple.com/xcode/'
    });
  }
};
exports.default = _default;