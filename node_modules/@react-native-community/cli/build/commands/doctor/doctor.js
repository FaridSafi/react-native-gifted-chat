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

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

var _healthchecks = require("./healthchecks");

var _loader = require("../../tools/loader");

var _printFixOptions = _interopRequireWildcard(require("./printFixOptions"));

var _runAutomaticFix = _interopRequireWildcard(require("./runAutomaticFix"));

var _envinfo = _interopRequireDefault(require("../../tools/envinfo"));

var _common = require("./healthchecks/common");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const printCategory = ({
  label,
  key
}) => {
  if (key > 0) {
    _cliTools().logger.log();
  }

  _cliTools().logger.log(_chalk().default.dim(label));
};

const printVersions = ({
  version,
  versions,
  versionRange
}) => {
  if (versions) {
    const versionsToShow = Array.isArray(versions) ? versions.join(', ') : 'N/A';
    (0, _common.logMessage)(`- Versions found: ${_chalk().default.red(versionsToShow)}`);
    (0, _common.logMessage)(`- Version supported: ${_chalk().default.green(versionRange)}`);
    return;
  }

  const versionsToShow = version && version !== 'Not Found' ? version : 'N/A';
  (0, _common.logMessage)(`- Version found: ${_chalk().default.red(versionsToShow)}`);
  (0, _common.logMessage)(`- Version supported: ${_chalk().default.green(versionRange)}`);
  return;
};

const printIssue = ({
  label,
  needsToBeFixed,
  version,
  versions,
  versionRange,
  isRequired,
  description
}) => {
  const symbol = needsToBeFixed ? isRequired ? _chalk().default.red('✖') : _chalk().default.yellow('●') : _chalk().default.green('✓');
  const descriptionToShow = description ? ` - ${description}` : '';

  _cliTools().logger.log(` ${symbol} ${label}${descriptionToShow}`);

  if (needsToBeFixed && versionRange) {
    return printVersions({
      version,
      versions,
      versionRange
    });
  }
};

const printOverallStats = ({
  errors,
  warnings
}) => {
  _cliTools().logger.log(`\n${_chalk().default.bold('Errors:')}   ${errors}`);

  _cliTools().logger.log(`${_chalk().default.bold('Warnings:')} ${warnings}`);
};

var _default = async (_, __, options) => {
  const Loader = (0, _loader.getLoader)();
  const loader = new Loader();
  loader.start('Running diagnostics...');
  const environmentInfo = await (0, _envinfo.default)();

  const iterateOverHealthChecks = async ({
    label,
    healthchecks
  }) => ({
    label,
    healthchecks: (await Promise.all(healthchecks.map(async healthcheck => {
      if (healthcheck.visible === false) {
        return;
      }

      const {
        needsToBeFixed,
        version,
        versions,
        versionRange
      } = await healthcheck.getDiagnostics(environmentInfo); // Assume that it's required unless specified otherwise

      const isRequired = healthcheck.isRequired !== false;
      const isWarning = needsToBeFixed && !isRequired;
      return {
        label: healthcheck.label,
        needsToBeFixed: Boolean(needsToBeFixed),
        version,
        versions,
        versionRange,
        description: healthcheck.description,
        runAutomaticFix: healthcheck.runAutomaticFix,
        isRequired,
        type: needsToBeFixed ? isWarning ? _healthchecks.HEALTHCHECK_TYPES.WARNING : _healthchecks.HEALTHCHECK_TYPES.ERROR : undefined
      };
    }))).filter(healthcheck => healthcheck !== undefined)
  }); // Remove all the categories that don't have any healthcheck with
  // `needsToBeFixed` so they don't show when the user taps to fix encountered
  // issues


  const removeFixedCategories = categories => categories.filter(category => category.healthchecks.some(healthcheck => healthcheck.needsToBeFixed));

  const iterateOverCategories = categories => Promise.all(categories.map(iterateOverHealthChecks));

  const healthchecksPerCategory = await iterateOverCategories(Object.values((0, _healthchecks.getHealthchecks)(options)).filter(category => category !== undefined));
  loader.stop();
  const stats = {
    errors: 0,
    warnings: 0
  };
  healthchecksPerCategory.forEach((issueCategory, key) => {
    printCategory(_objectSpread({}, issueCategory, {
      key
    }));
    issueCategory.healthchecks.forEach(healthcheck => {
      printIssue(healthcheck);

      if (healthcheck.type === _healthchecks.HEALTHCHECK_TYPES.WARNING) {
        stats.warnings++;
        return;
      }

      if (healthcheck.type === _healthchecks.HEALTHCHECK_TYPES.ERROR) {
        stats.errors++;
        return;
      }
    });
  });
  printOverallStats(stats);

  if (options.fix) {
    return await (0, _runAutomaticFix.default)({
      healthchecks: removeFixedCategories(healthchecksPerCategory),
      automaticFixLevel: _runAutomaticFix.AUTOMATIC_FIX_LEVELS.ALL_ISSUES,
      stats,
      loader,
      environmentInfo
    });
  }

  const removeKeyPressListener = () => {
    if (typeof process.stdin.setRawMode === 'function') {
      process.stdin.setRawMode(false);
    }

    process.stdin.removeAllListeners('data');
  };

  const onKeyPress = async key => {
    if (key === _printFixOptions.KEYS.EXIT || key === '\u0003') {
      removeKeyPressListener();
      process.exit(0);
      return;
    }

    if ([_printFixOptions.KEYS.FIX_ALL_ISSUES, _printFixOptions.KEYS.FIX_ERRORS, _printFixOptions.KEYS.FIX_WARNINGS].includes(key)) {
      removeKeyPressListener();

      try {
        const automaticFixLevel = {
          [_printFixOptions.KEYS.FIX_ALL_ISSUES]: _runAutomaticFix.AUTOMATIC_FIX_LEVELS.ALL_ISSUES,
          [_printFixOptions.KEYS.FIX_ERRORS]: _runAutomaticFix.AUTOMATIC_FIX_LEVELS.ERRORS,
          [_printFixOptions.KEYS.FIX_WARNINGS]: _runAutomaticFix.AUTOMATIC_FIX_LEVELS.WARNINGS
        };
        await (0, _runAutomaticFix.default)({
          healthchecks: removeFixedCategories(healthchecksPerCategory),
          automaticFixLevel: automaticFixLevel[key],
          stats,
          loader,
          environmentInfo
        });
        process.exit(0);
      } catch (err) {
        // TODO: log error
        process.exit(1);
      }
    }
  };

  if (stats.errors || stats.warnings) {
    (0, _printFixOptions.default)({
      onKeyPress
    });
  }
};

exports.default = _default;