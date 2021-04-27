"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = tryLaunchEmulator;

function _execa() {
  const data = _interopRequireDefault(require("execa"));

  _execa = function () {
    return data;
  };

  return data;
}

var _adb = _interopRequireDefault(require("./adb"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const emulatorCommand = process.env.ANDROID_HOME ? `${process.env.ANDROID_HOME}/emulator/emulator` : 'emulator';

const getEmulators = () => {
  try {
    const emulatorsOutput = _execa().default.sync(emulatorCommand, ['-list-avds']).stdout;

    return emulatorsOutput.split('\n').filter(name => name !== '');
  } catch (_unused) {
    return [];
  }
};

const launchEmulator = async (emulatorName, adbPath) => {
  return new Promise((resolve, reject) => {
    const cp = (0, _execa().default)(emulatorCommand, [`@${emulatorName}`], {
      detached: true,
      stdio: 'ignore'
    });
    cp.unref();
    const timeout = 30; // Reject command after timeout

    const rejectTimeout = setTimeout(() => {
      cleanup();
      reject(`Could not start emulator within ${timeout} seconds.`);
    }, timeout * 1000);
    const bootCheckInterval = setInterval(() => {
      if (_adb.default.getDevices(adbPath).length > 0) {
        cleanup();
        resolve();
      }
    }, 1000);

    const cleanup = () => {
      clearTimeout(rejectTimeout);
      clearInterval(bootCheckInterval);
    };

    cp.on('exit', () => {
      cleanup();
      reject('Emulator exited before boot.');
    });
    cp.on('error', error => {
      cleanup();
      reject(error.message);
    });
  });
};

async function tryLaunchEmulator(adbPath) {
  const emulators = getEmulators();

  if (emulators.length > 0) {
    try {
      await launchEmulator(emulators[0], adbPath);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error
      };
    }
  }

  return {
    success: false,
    error: 'No emulators found as an output of `emulator -list-avds`'
  };
}