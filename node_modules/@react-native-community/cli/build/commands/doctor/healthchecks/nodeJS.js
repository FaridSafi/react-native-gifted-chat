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
  label: 'Node.js',
  getDiagnostics: async ({
    Binaries
  }) => ({
    needsToBeFixed: (0, _checkInstallation.doesSoftwareNeedToBeFixed)({
      version: Binaries.Node.version,
      versionRange: _versionRanges.default.NODE_JS
    }),
    version: Binaries.Node.version,
    versionRange: _versionRanges.default.NODE_JS
  }),
  runAutomaticFix: async ({
    loader
  }) => {
    loader.fail();
    (0, _common.logManualInstallation)({
      healthcheck: 'Node.js',
      url: 'https://nodejs.org/en/download/'
    });
  }
};
exports.default = _default;