"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.AUTOMATIC_FIX_LEVELS = void 0;

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

function _ora() {
  const data = _interopRequireDefault(require("ora"));

  _ora = function () {
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

var _healthchecks = require("./healthchecks");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let AUTOMATIC_FIX_LEVELS;
exports.AUTOMATIC_FIX_LEVELS = AUTOMATIC_FIX_LEVELS;

(function (AUTOMATIC_FIX_LEVELS) {
  AUTOMATIC_FIX_LEVELS["ALL_ISSUES"] = "ALL_ISSUES";
  AUTOMATIC_FIX_LEVELS["ERRORS"] = "ERRORS";
  AUTOMATIC_FIX_LEVELS["WARNINGS"] = "WARNINGS";
})(AUTOMATIC_FIX_LEVELS || (exports.AUTOMATIC_FIX_LEVELS = AUTOMATIC_FIX_LEVELS = {}));

async function _default({
  healthchecks,
  automaticFixLevel,
  stats,
  environmentInfo
}) {
  // Remove the fix options from screen
  if (process.stdout.isTTY) {
    // @ts-ignore
    process.stdout.moveCursor(0, -6); // @ts-ignore

    process.stdout.clearScreenDown();
  }

  const totalIssuesBasedOnFixLevel = {
    [AUTOMATIC_FIX_LEVELS.ALL_ISSUES]: stats.errors + stats.warnings,
    [AUTOMATIC_FIX_LEVELS.ERRORS]: stats.errors,
    [AUTOMATIC_FIX_LEVELS.WARNINGS]: stats.warnings
  };
  const issuesCount = totalIssuesBasedOnFixLevel[automaticFixLevel];

  _cliTools().logger.log(`\nAttempting to fix ${_chalk().default.bold(issuesCount.toString())} issue${issuesCount > 1 ? 's' : ''}...`);

  for (const category of healthchecks) {
    const healthchecksToRun = category.healthchecks.filter(healthcheck => {
      if (automaticFixLevel === AUTOMATIC_FIX_LEVELS.ALL_ISSUES) {
        return healthcheck.needsToBeFixed;
      }

      if (automaticFixLevel === AUTOMATIC_FIX_LEVELS.ERRORS) {
        return healthcheck.needsToBeFixed && healthcheck.type === _healthchecks.HEALTHCHECK_TYPES.ERROR;
      }

      if (automaticFixLevel === AUTOMATIC_FIX_LEVELS.WARNINGS) {
        return healthcheck.needsToBeFixed && healthcheck.type === _healthchecks.HEALTHCHECK_TYPES.WARNING;
      }

      return;
    });

    if (!healthchecksToRun.length) {
      continue;
    }

    _cliTools().logger.log(`\n${_chalk().default.dim(category.label)}`);

    for (const healthcheckToRun of healthchecksToRun) {
      const spinner = (0, _ora().default)({
        prefixText: '',
        text: healthcheckToRun.label
      }).start();

      try {
        await healthcheckToRun.runAutomaticFix({
          loader: spinner,
          environmentInfo
        });
      } catch (error) {// TODO: log the error in a meaningful way
      }
    }
  }
}