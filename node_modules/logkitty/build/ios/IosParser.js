"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dayjs = _interopRequireDefault(require("dayjs"));

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class IosParser {
  splitMessages(raw) {
    const messages = [];
    let data = raw.toString();
    let match = data.match(IosParser.timeRegex);

    while (match) {
      const timeMatch = match[0];
      data = data.slice((match.index || 0) + timeMatch.length);
      const nextMatch = data.match(IosParser.timeRegex);
      const body = nextMatch ? data.slice(0, nextMatch.index) : data;
      messages.push(`${timeMatch} ${body}`);
      match = nextMatch;
    }

    return messages;
  }

  parseMessages(messages) {
    return messages.map(rawMessage => {
      const timeMatch = rawMessage.match(IosParser.timeRegex);

      if (!timeMatch) {
        throw new Error(`Time regex was not matched in message: ${rawMessage}`);
      }

      const headerMatch = rawMessage.slice(timeMatch[0].length).match(IosParser.headerRegex) || ['', 'Default', '-1', 'unknown'];
      const [, priority, pid, tag] = headerMatch;
      return {
        platform: 'ios',
        date: (0, _dayjs.default)(timeMatch[0]).set('millisecond', 0),
        pid: parseInt(pid.trim(), 10) || 0,
        priority: _constants.Priority.fromName(priority),
        tag,
        messages: [rawMessage.slice(timeMatch[0].length + headerMatch[0].length).trim()]
      };
    }).reduce((acc, entry) => {
      if (acc.length > 0 && acc[acc.length - 1].date.isSame(entry.date) && acc[acc.length - 1].appId === entry.appId && acc[acc.length - 1].pid === entry.pid && acc[acc.length - 1].priority === entry.priority) {
        acc[acc.length - 1].messages.push(...entry.messages);
        return acc;
      }

      return [...acc, entry];
    }, []);
  }

}

exports.default = IosParser;

_defineProperty(IosParser, "timeRegex", /\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.[\d+]+/m);

_defineProperty(IosParser, "headerRegex", /^\s+[a-z0-9]+\s+(\w+)\s+[a-z0-9]+\s+(\d+)\s+\d+\s+([^:]+):/);
//# sourceMappingURL=IosParser.js.map