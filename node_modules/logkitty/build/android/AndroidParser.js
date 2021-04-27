"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dayjs = _interopRequireDefault(require("dayjs"));

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AndroidParser {
  splitMessages(raw) {
    const messages = [];
    let data = raw.toString();
    let match = data.match(AndroidParser.timeRegex);

    while (match) {
      const timeHeader = match[0];
      data = data.slice((match.index || 0) + timeHeader.length);
      const nextMatch = data.match(AndroidParser.timeRegex);
      const body = nextMatch ? data.slice(0, nextMatch.index) : data;
      messages.push(`${timeHeader} ${body}`);
      match = nextMatch;
    }

    return messages;
  }

  parseMessages(messages) {
    return messages.map(rawMessage => {
      const timeMatch = rawMessage.match(AndroidParser.timeRegex);

      if (!timeMatch) {
        throw new Error(`Time regex was not matched in message: ${rawMessage}`);
      }

      const headerMatch = rawMessage.slice(timeMatch[0].length).match(AndroidParser.headerRegex) || ['', 'U', 'unknown', '-1'];
      const [, priority, tag, pid] = headerMatch;
      return {
        platform: 'android',
        date: (0, _dayjs.default)().set('month', parseInt(timeMatch[1], 10)).set('day', parseInt(timeMatch[2], 10)).set('hour', parseInt(timeMatch[3], 10)).set('minute', parseInt(timeMatch[4], 10)).set('second', parseInt(timeMatch[5], 10)).set('millisecond', 0),
        pid: parseInt(pid.trim(), 10) || 0,
        priority: _constants.Priority.fromLetter(priority),
        tag: tag.trim() || 'unknown',
        messages: [rawMessage.slice(timeMatch[0].length + headerMatch[0].length).trim()]
      };
    }).reduce((acc, entry) => {
      if (acc.length > 0 && acc[acc.length - 1].date.isSame(entry.date) && acc[acc.length - 1].tag === entry.tag && acc[acc.length - 1].pid === entry.pid && acc[acc.length - 1].priority === entry.priority) {
        acc[acc.length - 1].messages.push(...entry.messages);
        return acc;
      }

      return [...acc, entry];
    }, []);
  }

}

exports.default = AndroidParser;

_defineProperty(AndroidParser, "timeRegex", /(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2}).\d{3}/m);

_defineProperty(AndroidParser, "headerRegex", /^\s*(\w)\/(.+)\(([\s\d]+)\):/);
//# sourceMappingURL=AndroidParser.js.map