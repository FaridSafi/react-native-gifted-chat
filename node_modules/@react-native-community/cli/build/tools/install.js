"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.install = install;

var _brewInstall = require("./brewInstall");

var _common = require("../commands/doctor/healthchecks/common");

async function install({
  pkg,
  label,
  url,
  loader
}) {
  try {
    switch (process.platform) {
      case 'darwin':
        await (0, _brewInstall.brewInstall)({
          pkg,
          label,
          loader
        });
        break;

      default:
        throw new Error('Not implemented yet');
    }
  } catch (_error) {
    loader.fail();
    (0, _common.logManualInstallation)({
      healthcheck: label,
      url
    });
  }
}