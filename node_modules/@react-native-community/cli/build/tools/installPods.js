"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promptCocoaPodsInstallationQuestion = promptCocoaPodsInstallationQuestion;
exports.runSudo = runSudo;
exports.installCocoaPods = installCocoaPods;
exports.default = void 0;

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
    return data;
  };

  return data;
}

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

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

var _loader = require("./loader");

function _sudoPrompt() {
  const data = _interopRequireDefault(require("sudo-prompt"));

  _sudoPrompt = function () {
    return data;
  };

  return data;
}

var _brewInstall = require("./brewInstall");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore untyped
// @ts-ignore untyped
async function updatePods(loader) {
  try {
    loader.start(`Updating CocoaPods repositories ${_chalk().default.dim('(this may take a few minutes)')}`);
    await (0, _execa().default)('pod', ['repo', 'update']);
  } catch (error) {
    // "pod" command outputs errors to stdout (at least some of them)
    _cliTools().logger.log(error.stderr || error.stdout);

    loader.fail();
    throw new Error(`Failed to update CocoaPods repositories for iOS project.\nPlease try again manually: "pod repo update".\nCocoaPods documentation: ${_chalk().default.dim.underline('https://cocoapods.org/')}`);
  }
}

function runSudo(command) {
  return new Promise((resolve, reject) => {
    _sudoPrompt().default.exec(command, error => {
      if (error) {
        reject(error);
      }

      resolve();
    });
  });
}

async function promptCocoaPodsInstallationQuestion() {
  const promptQuestion = `CocoaPods ${_chalk().default.dim.underline('(https://cocoapods.org/)')} ${_chalk().default.reset.bold('is not installed. CocoaPods is necessary for the iOS project to run correctly. Do you want to install it?')}`;
  const installWithGem = 'Yes, with gem (may require sudo)';
  const installWithHomebrew = 'Yes, with Homebrew';
  const {
    shouldInstallCocoaPods
  } = await _inquirer().default.prompt([{
    type: 'list',
    name: 'shouldInstallCocoaPods',
    message: promptQuestion,
    choices: [installWithGem, installWithHomebrew]
  }]);
  const shouldInstallWithGem = shouldInstallCocoaPods === installWithGem;
  return {
    installMethod: shouldInstallWithGem ? 'gem' : 'homebrew',
    // This is used for removing the message in `doctor` after it's answered
    promptQuestion: `? ${promptQuestion} ${shouldInstallWithGem ? installWithGem : installWithHomebrew}`
  };
}

async function installCocoaPodsWithGem() {
  const options = ['install', 'cocoapods', '--no-document'];

  try {
    // First attempt to install `cocoapods`
    await (0, _execa().default)('gem', options);
  } catch (_error) {
    // If that doesn't work then try with sudo
    await runSudo(`gem ${options.join(' ')}`);
  }
}

async function installCocoaPods(loader) {
  loader.stop();
  const {
    installMethod
  } = await promptCocoaPodsInstallationQuestion();

  if (installMethod === 'gem') {
    loader.start('Installing CocoaPods');

    try {
      await installCocoaPodsWithGem();
      return loader.succeed();
    } catch (error) {
      loader.fail();

      _cliTools().logger.error(error.stderr);

      throw new Error(`An error occured while trying to install CocoaPods, which is required by this template.\nPlease try again manually: sudo gem install cocoapods.\nCocoaPods documentation: ${_chalk().default.dim.underline('https://cocoapods.org/')}`);
    }
  }

  if (installMethod === 'homebrew') {
    return await (0, _brewInstall.brewInstall)({
      pkg: 'cocoapods',
      label: 'Installing CocoaPods',
      loader
    });
  }
}

async function installPods({
  projectName,
  loader,
  shouldUpdatePods
}) {
  loader = loader || new _loader.NoopLoader();

  try {
    if (!_fs().default.existsSync('ios')) {
      return;
    }

    process.chdir('ios');

    const hasPods = _fs().default.existsSync('Podfile');

    if (!hasPods) {
      return;
    }

    try {
      // Check if "pod" is available and usable. It happens that there are
      // multiple versions of "pod" command and even though it's there, it exits
      // with a failure
      await (0, _execa().default)('pod', ['--version']);
    } catch (e) {
      loader.info();
      await installCocoaPods(loader);
    }

    if (shouldUpdatePods) {
      await updatePods(loader);
    }

    try {
      loader.start(`Installing CocoaPods dependencies ${_chalk().default.dim('(this may take a few minutes)')}`);
      await (0, _execa().default)('pod', ['install']);
    } catch (error) {
      // "pod" command outputs errors to stdout (at least some of them)
      _cliTools().logger.log(error.stderr || error.stdout);

      throw new Error(`Failed to install CocoaPods dependencies for iOS project, which is required by this template.\nPlease try again manually: "cd ./${projectName}/ios && pod install".\nCocoaPods documentation: ${_chalk().default.dim.underline('https://cocoapods.org/')}`);
    }
  } catch (error) {
    throw error;
  } finally {
    process.chdir('..');
  }
}

var _default = installPods;
exports.default = _default;