"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _adb = require("./adb");

var _constants = require("./constants");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AndroidFilter {
  constructor(minPriority = 0) {
    _defineProperty(this, "minPriority", void 0);

    _defineProperty(this, "filter", void 0);

    this.minPriority = minPriority; // Default filter by all

    this.filter = entry => {
      return entry.priority >= this.minPriority;
    };
  }

  setFilterByTag(tags) {
    this.filter = entry => {
      return Boolean(entry.priority >= this.minPriority && entry.tag && tags.indexOf(entry.tag) > -1);
    };
  }

  setFilterByApp(applicationId, adbPath) {
    const pid = (0, _adb.getApplicationPid)(applicationId, adbPath);

    this.filter = entry => {
      return entry.priority >= this.minPriority && entry.pid === pid;
    };
  }

  setFilterByMatch(regexes) {
    this.filter = entry => {
      return entry.priority >= this.minPriority && Boolean(regexes.find(reg => Boolean(entry.messages.find(message => reg.test(message)))));
    };
  }

  setCustomFilter(patterns) {
    const tagFilters = patterns.reduce((acc, pattern) => {
      const [tag, priority] = pattern.split(':');
      return { ...acc,
        [tag]: _constants.Priority.fromLetter(priority)
      };
    }, {});

    this.filter = entry => {
      return entry.tag && entry.priority >= (tagFilters[entry.tag] || _constants.Priority.SILENT) || entry.priority >= (tagFilters['*'] || _constants.Priority.UNKNOWN);
    };
  }

  shouldInclude(entry) {
    return this.filter(entry);
  }

}

exports.default = AndroidFilter;
//# sourceMappingURL=AndroidFilter.js.map