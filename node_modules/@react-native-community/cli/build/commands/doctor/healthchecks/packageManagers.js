"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.npm = exports.yarn = exports.packageManager = void 0;

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
    return data;
  };

  return data;
}

var _versionRanges = _interopRequireDefault(require("../versionRanges"));

var _checkInstallation = require("../checkInstallation");

var _install = require("../../../tools/install");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const packageManager = (() => {
  if (_fs().default.existsSync('yarn.lock')) {
    return _checkInstallation.PACKAGE_MANAGERS.YARN;
  }

  if (_fs().default.existsSync('package-lock.json')) {
    return _checkInstallation.PACKAGE_MANAGERS.NPM;
  }

  return undefined;
})();

exports.packageManager = packageManager;
const yarn = {
  label: 'yarn',
  getDiagnostics: async ({
    Binaries
  }) => ({
    needsToBeFixed: (0, _checkInstallation.doesSoftwareNeedToBeFixed)({
      version: Binaries.Yarn.version,
      versionRange: _versionRanges.default.YARN
    }),
    version: Binaries.Yarn.version,
    versionRange: _versionRanges.default.YARN
  }),
  // Only show `yarn` if there's a `yarn.lock` file in the current directory
  // or if we can't identify that the user uses yarn or npm
  visible: packageManager === _checkInstallation.PACKAGE_MANAGERS.YARN || packageManager === undefined,
  runAutomaticFix: async ({
    loader
  }) => await (0, _install.install)({
    pkg: 'yarn',
    label: 'yarn',
    url: 'https://yarnpkg.com/docs/install',
    loader
  })
};
exports.yarn = yarn;
const npm = {
  label: 'npm',
  getDiagnostics: async ({
    Binaries
  }) => ({
    needsToBeFixed: (0, _checkInstallation.doesSoftwareNeedToBeFixed)({
      version: Binaries.npm.version,
      versionRange: _versionRanges.default.NPM
    }),
    version: Binaries.npm.version,
    versionRange: _versionRanges.default.NPM
  }),
  // Only show `yarn` if there's a `package-lock.json` file in the current directory
  // or if we can't identify that the user uses yarn or npm
  visible: packageManager === _checkInstallation.PACKAGE_MANAGERS.NPM || packageManager === undefined,
  runAutomaticFix: async ({
    loader
  }) => await (0, _install.install)({
    pkg: 'node',
    label: 'node',
    url: 'https://nodejs.org/',
    loader
  })
};
exports.npm = npm;