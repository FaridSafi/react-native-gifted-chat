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

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

function _inquirer() {
  const data = _interopRequireDefault(require("inquirer"));

  _inquirer = function () {
    return data;
  };

  return data;
}

var _checkInstallation = require("../checkInstallation");

var _packageManagers = require("./packageManagers");

var _common = require("./common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore untyped
const label = 'ios-deploy';
const installationWithYarn = 'yarn global add ios-deploy';
const installationWithNpm = 'npm install ios-deploy --global';

const identifyInstallationCommand = () => {
  if (_packageManagers.packageManager === _checkInstallation.PACKAGE_MANAGERS.YARN) {
    return installationWithYarn;
  }

  if (_packageManagers.packageManager === _checkInstallation.PACKAGE_MANAGERS.NPM) {
    return installationWithNpm;
  }

  return undefined;
};

const installLibrary = async ({
  installationCommand,
  packageManagerToUse,
  loader
}) => {
  try {
    loader.start(`${label} (installing with ${packageManagerToUse})`);
    const installationCommandArgs = installationCommand.split(' ');
    await (0, _execa().default)(installationCommandArgs[0], installationCommandArgs.splice(1));
    loader.succeed(`${label} (installed with ${packageManagerToUse})`);
  } catch (error) {
    (0, _common.logError)({
      healthcheck: label,
      loader,
      error,
      command: installationCommand
    });
  }
};

var _default = {
  label,
  isRequired: false,
  description: 'Required for installing your app on a physical device with the CLI',
  getDiagnostics: async () => ({
    needsToBeFixed: await (0, _checkInstallation.isSoftwareNotInstalled)('ios-deploy')
  }),
  runAutomaticFix: async ({
    loader
  }) => {
    loader.stop();
    const installationCommand = identifyInstallationCommand(); // This means that we couldn't "guess" the package manager

    if (installationCommand === undefined) {
      const promptQuestion = `ios-deploy needs to be installed either by ${_chalk().default.bold('yarn')} ${_chalk().default.reset('or')} ${_chalk().default.bold('npm')} ${_chalk().default.reset()}, which one do you want to use?`;
      const installWithYarn = 'yarn';
      const installWithNpm = 'npm';
      const skipInstallation = 'Skip installation';
      const {
        chosenPackageManager
      } = await _inquirer().default.prompt([{
        type: 'list',
        name: 'chosenPackageManager',
        message: promptQuestion,
        choices: [installWithYarn, installWithNpm, skipInstallation]
      }]);
      (0, _common.removeMessage)(`? ${promptQuestion} ${chosenPackageManager}`);

      if (chosenPackageManager === skipInstallation) {
        loader.fail(); // Then we just print out the URL that the user can head to download the library

        (0, _common.logManualInstallation)({
          healthcheck: 'ios-deploy',
          url: 'https://github.com/ios-control/ios-deploy#readme'
        });
        return;
      }

      const shouldInstallWithYarn = chosenPackageManager === installWithYarn;
      return installLibrary({
        installationCommand: shouldInstallWithYarn ? installationWithYarn : installationWithNpm,
        loader,
        packageManagerToUse: chosenPackageManager
      });
    }

    return installLibrary({
      installationCommand,
      packageManagerToUse: _packageManagers.packageManager.toLowerCase(),
      loader
    });
  }
};
exports.default = _default;