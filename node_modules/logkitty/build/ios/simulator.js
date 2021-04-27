"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runSimulatorLoggingProcess = runSimulatorLoggingProcess;

var _child_process = require("child_process");

var _errors = require("../errors");

function runSimulatorLoggingProcess() {
  try {
    return (0, _child_process.spawn)('xcrun', ['simctl', 'spawn', 'booted', 'log', 'stream', '--type', 'log', '--level', 'debug'], {
      stdio: 'pipe'
    });
  } catch (error) {
    throw new _errors.CodeError(_errors.ERR_IOS_CANNOT_START_SYSLOG, error.message);
  }
}
//# sourceMappingURL=simulator.js.map