"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.brewInstall = brewInstall;

function _execa() {
  const data = _interopRequireDefault(require("execa"));

  _execa = function () {
    return data;
  };

  return data;
}

var _common = require("../commands/doctor/healthchecks/common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function brewInstall({
  pkg,
  label,
  loader,
  onSuccess,
  onFail
}) {
  loader.start(label);

  try {
    await (0, _execa().default)('brew', ['install', pkg]);

    if (typeof onSuccess === 'function') {
      return onSuccess();
    }

    return loader.succeed();
  } catch (error) {
    if (typeof onFail === 'function') {
      return onFail();
    }

    (0, _common.logError)({
      healthcheck: label || pkg,
      loader,
      error,
      command: `brew install ${pkg}`
    });
  }
}