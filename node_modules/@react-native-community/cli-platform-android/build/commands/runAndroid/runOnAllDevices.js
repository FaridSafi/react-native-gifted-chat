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

function _child_process() {
  const data = require("child_process");

  _child_process = function () {
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

var _adb = _interopRequireDefault(require("./adb"));

var _tryRunAdbReverse = _interopRequireDefault(require("./tryRunAdbReverse"));

var _tryLaunchAppOnDevice = _interopRequireDefault(require("./tryLaunchAppOnDevice"));

var _tryLaunchEmulator = _interopRequireDefault(require("./tryLaunchEmulator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function getTaskNames(appFolder, commands) {
  return appFolder ? commands.map(command => `${appFolder}:${command}`) : commands;
}

function toPascalCase(value) {
  return value[0].toUpperCase() + value.slice(1);
}

async function runOnAllDevices(args, cmd, packageNameWithSuffix, packageName, adbPath) {
  let devices = _adb.default.getDevices(adbPath);

  if (devices.length === 0) {
    _cliTools().logger.info('Launching emulator...');

    const result = await (0, _tryLaunchEmulator.default)(adbPath);

    if (result.success) {
      _cliTools().logger.info('Successfully launched emulator.');

      devices = _adb.default.getDevices(adbPath);
    } else {
      _cliTools().logger.error(`Failed to launch emulator. Reason: ${_chalk().default.dim(result.error || '')}.`);

      _cliTools().logger.warn('Please launch an emulator manually or connect a device. Otherwise app may fail to launch.');
    }
  }

  try {
    const tasks = args.tasks || ['install' + toPascalCase(args.variant)];
    const gradleArgs = getTaskNames(args.appFolder, tasks);

    if (args.port != null) {
      gradleArgs.push('-PreactNativeDevServerPort=' + args.port);
    }

    _cliTools().logger.info('Installing the app...');

    _cliTools().logger.debug(`Running command "cd android && ${cmd} ${gradleArgs.join(' ')}"`);

    (0, _child_process().execFileSync)(cmd, gradleArgs, {
      stdio: ['inherit', 'inherit', 'pipe']
    });
  } catch (error) {
    throw createInstallError(error);
  }

  (devices.length > 0 ? devices : [undefined]).forEach(device => {
    (0, _tryRunAdbReverse.default)(args.port, device);
    (0, _tryLaunchAppOnDevice.default)(device, packageNameWithSuffix, packageName, adbPath, args.mainActivity);
  });
}

function createInstallError(error) {
  const stderr = (error.stderr || '').toString();
  const docs = 'https://facebook.github.io/react-native/docs/getting-started.html#android-development-environment';
  let message = `Make sure you have the Android development environment set up: ${_chalk().default.underline.dim(docs)}`; // Pass the error message from the command to stdout because we pipe it to
  // parent process so it's not visible

  _cliTools().logger.log(stderr); // Handle some common failures and make the errors more helpful


  if (stderr.includes('No connected devices')) {
    message = 'Make sure you have an Android emulator running or a device connected';
  } else if (stderr.includes('licences have not been accepted') || stderr.includes('accept the SDK license')) {
    message = `Please accept all necessary Android SDK licenses using Android SDK Manager: "${_chalk().default.bold('$ANDROID_HOME/tools/bin/sdkmanager --licenses')}"`;
  }

  return new (_cliTools().CLIError)(`Failed to install the app. ${message}.`, error);
}

var _default = runOnAllDevices;
exports.default = _default;