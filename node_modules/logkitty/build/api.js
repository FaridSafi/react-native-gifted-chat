"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeTagsFilter = makeTagsFilter;
exports.makeAppFilter = makeAppFilter;
exports.makeMatchFilter = makeMatchFilter;
exports.makeCustomFilter = makeCustomFilter;
exports.logkitty = logkitty;
Object.defineProperty(exports, "Entry", {
  enumerable: true,
  get: function () {
    return _types.Entry;
  }
});
Object.defineProperty(exports, "AndroidPriority", {
  enumerable: true,
  get: function () {
    return _constants.Priority;
  }
});
Object.defineProperty(exports, "IosPriority", {
  enumerable: true,
  get: function () {
    return _constants2.Priority;
  }
});
Object.defineProperty(exports, "formatEntry", {
  enumerable: true,
  get: function () {
    return _formatters.formatEntry;
  }
});
Object.defineProperty(exports, "formatError", {
  enumerable: true,
  get: function () {
    return _formatters.formatError;
  }
});

var _events = require("events");

var _types = require("./types");

var _AndroidFilter = _interopRequireDefault(require("./android/AndroidFilter"));

var _AndroidParser = _interopRequireDefault(require("./android/AndroidParser"));

var _adb = require("./android/adb");

var _constants = require("./android/constants");

var _IosParser = _interopRequireDefault(require("./ios/IosParser"));

var _IosFilter = _interopRequireDefault(require("./ios/IosFilter"));

var _simulator = require("./ios/simulator");

var _errors = require("./errors");

var _constants2 = require("./ios/constants");

var _formatters = require("./formatters");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Common */

/* Android */

/* iOS */

/* Exports */
function makeTagsFilter(...tags) {
  return (platform, minPriority) => {
    const filter = platform === 'android' ? new _AndroidFilter.default(minPriority) : new _IosFilter.default(minPriority);
    filter.setFilterByTag(tags);
    return filter;
  };
}

function makeAppFilter(appIdentifier) {
  return (platform, minPriority, adbPath) => {
    if (platform !== 'android') {
      throw new Error('App filter is only available for Android');
    }

    const filter = new _AndroidFilter.default(minPriority);
    filter.setFilterByApp(appIdentifier, adbPath);
    return filter;
  };
}

function makeMatchFilter(...regexes) {
  return (platform, minPriority) => {
    const filter = platform === 'android' ? new _AndroidFilter.default(minPriority) : new _IosFilter.default(minPriority);
    filter.setFilterByMatch(regexes);
    return filter;
  };
}

function makeCustomFilter(...patterns) {
  return (platform, minPriority) => {
    if (platform !== 'android') {
      throw new Error('Custom filter is only available for Android');
    }

    const filter = new _AndroidFilter.default(minPriority);
    filter.setCustomFilter(patterns);
    return filter;
  };
}

function logkitty(options) {
  const {
    platform,
    adbPath,
    priority,
    filter: createFilter
  } = options;
  const emitter = new _events.EventEmitter();

  if (!['ios', 'android'].some(availablePlatform => availablePlatform === platform)) {
    throw new Error(`Platform ${platform} is not supported`);
  }

  const parser = platform === 'android' ? new _AndroidParser.default() : new _IosParser.default();
  let filter;

  if (createFilter) {
    filter = createFilter(platform, priority, adbPath);
  } else {
    filter = platform === 'android' ? new _AndroidFilter.default(priority) : new _IosFilter.default(priority);
  }

  const loggingProcess = platform === 'android' ? (0, _adb.runAndroidLoggingProcess)(adbPath) : (0, _simulator.runSimulatorLoggingProcess)();
  process.on('exit', () => {
    loggingProcess.kill();
    emitter.emit('exit');
  });
  loggingProcess.stderr.on('data', errorData => {
    if (platform === 'ios' && errorData.toString().includes('No devices are booted.')) {
      emitter.emit('error', new _errors.CodeError(_errors.ERR_IOS_NO_SIMULATORS_BOOTED, 'No simulators are booted.'));
    } else {
      emitter.emit('error', new Error(errorData.toString()));
    }
  });
  loggingProcess.stdout.on('data', raw => {
    let entryToLog;

    try {
      const messages = parser.splitMessages(raw.toString());
      const entries = parser.parseMessages(messages);
      entries.forEach(entry => {
        if (filter.shouldInclude(entry)) {
          entryToLog = entry;
        }
      });
    } catch (error) {
      emitter.emit('error', error);
    }

    if (entryToLog) {
      emitter.emit('entry', entryToLog);
    }
  });
  loggingProcess.stdout.on('error', error => {
    emitter.emit('error', error);
    emitter.emit('exit');
  });
  return emitter;
}
//# sourceMappingURL=api.js.map