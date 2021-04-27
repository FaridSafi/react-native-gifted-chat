"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _versionRanges = _interopRequireDefault(require("../versionRanges"));

var _checkInstallation = require("../checkInstallation");

var _install = require("../../../tools/install");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const label = 'Watchman';
var _default = {
  label,
  description: 'Used for watching changes in the filesystem when in development mode',
  getDiagnostics: async ({
    Binaries
  }) => ({
    needsToBeFixed: (0, _checkInstallation.doesSoftwareNeedToBeFixed)({
      version: Binaries.Watchman.version,
      versionRange: _versionRanges.default.WATCHMAN
    }),
    version: Binaries.Watchman.version,
    versionRange: _versionRanges.default.WATCHMAN
  }),
  runAutomaticFix: async ({
    loader
  }) => await (0, _install.install)({
    pkg: 'watchman',
    label,
    url: 'https://facebook.github.io/watchman/docs/install.html',
    loader
  })
};
exports.default = _default;