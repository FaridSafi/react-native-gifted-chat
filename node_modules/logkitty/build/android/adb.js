"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runAndroidLoggingProcess = runAndroidLoggingProcess;
exports.getAdbPath = getAdbPath;
exports.spawnLogcatProcess = spawnLogcatProcess;
exports.getApplicationPid = getApplicationPid;

var _child_process = require("child_process");

var _path = _interopRequireDefault(require("path"));

var _errors = require("../errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function runAndroidLoggingProcess(adbPath) {
  const execPath = getAdbPath(adbPath);
  return spawnLogcatProcess(execPath);
}

function getAdbPath(customPath) {
  if (customPath) {
    return _path.default.resolve(customPath);
  }

  return process.env.ANDROID_HOME ? `${process.env.ANDROID_HOME}/platform-tools/adb` : 'adb';
}

function spawnLogcatProcess(adbPath) {
  try {
    (0, _child_process.execSync)(`${adbPath} logcat -c`);
  } catch (error) {
    throw new _errors.CodeError(_errors.ERR_ANDROID_CANNOT_CLEAN_LOGCAT_BUFFER, error.message);
  }

  try {
    return (0, _child_process.spawn)(adbPath, ['logcat', '-v', 'time', 'process', 'tag'], {
      stdio: 'pipe'
    });
  } catch (error) {
    throw new _errors.CodeError(_errors.ERR_ANDROID_CANNOT_START_LOGCAT, error.message);
  }
}

function getApplicationPid(applicationId, adbPath) {
  let output;

  try {
    output = (0, _child_process.execSync)(`'${getAdbPath(adbPath)}' shell pidof -s ${applicationId}`);
  } catch (error) {
    throw new _errors.CodeError(_errors.ERR_ANDROID_CANNOT_GET_APP_PID, error.message);
  }

  const pid = output ? parseInt(output.toString(), 10) : NaN;

  if (isNaN(pid)) {
    throw new _errors.CodeError(_errors.ERR_ANDROID_UNPROCESSABLE_PID);
  }

  return pid;
}
//# sourceMappingURL=adb.js.map