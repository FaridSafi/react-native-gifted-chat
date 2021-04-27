"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _execa() {
  const data = _interopRequireDefault(require("execa"));

  _execa = function () {
    return data;
  };

  return data;
}

var _checkInstallation = require("../checkInstallation");

var _installPods = require("../../../tools/installPods");

var _common = require("./common");

var _brewInstall = require("../../../tools/brewInstall");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const label = 'CocoaPods';
var _default = {
  label,
  description: 'Required for installing iOS dependencies',
  getDiagnostics: async () => ({
    needsToBeFixed: await (0, _checkInstallation.isSoftwareNotInstalled)('pod')
  }),
  runAutomaticFix: async ({
    loader
  }) => {
    loader.stop();
    const {
      installMethod,
      promptQuestion
    } = await (0, _installPods.promptCocoaPodsInstallationQuestion)(); // Capitalise `Homebrew` when printing on the screen

    const installMethodCapitalized = installMethod === 'homebrew' ? installMethod.substr(0, 1).toUpperCase() + installMethod.substr(1) : installMethod;
    const loaderInstallationMessage = `${label} (installing with ${installMethodCapitalized})`;
    const loaderSucceedMessage = `${label} (installed with ${installMethodCapitalized})`; // Remove the prompt after the question of how to install CocoaPods is answered

    (0, _common.removeMessage)(promptQuestion);

    if (installMethod === 'gem') {
      loader.start(loaderInstallationMessage);
      const options = ['install', 'cocoapods', '--no-document'];

      try {
        // First attempt to install `cocoapods`
        await (0, _execa().default)('gem', options);
        return loader.succeed(loaderSucceedMessage);
      } catch (_error) {
        // If that doesn't work then try with sudo
        try {
          await (0, _installPods.runSudo)(`gem ${options.join(' ')}`);
          return loader.succeed(loaderSucceedMessage);
        } catch (error) {
          (0, _common.logError)({
            healthcheck: label,
            loader,
            error,
            command: 'sudo gem install cocoapods'
          });
        }
      }
    }

    if (installMethod === 'homebrew') {
      return await (0, _brewInstall.brewInstall)({
        pkg: 'cocoapods',
        label: loaderInstallationMessage,
        loader,
        onSuccess: () => loader.succeed(loaderSucceedMessage)
      });
    }
  }
};
exports.default = _default;