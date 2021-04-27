"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatError = formatError;
exports.formatEntry = formatEntry;

var _ansiFragments = require("ansi-fragments");

var _constants = require("./android/constants");

var _constants2 = require("./ios/constants");

function formatError(error) {
  return (0, _ansiFragments.container)((0, _ansiFragments.color)('red', '✖︎ Ups, something went wrong'), (0, _ansiFragments.pad)(2, '\n'), (0, _ansiFragments.color)('red', (0, _ansiFragments.modifier)('bold', 'CODE'), ' ▶︎ '), 'code' in error ? error.code : 'ERR_UNKNOWN', (0, _ansiFragments.pad)(1, '\n'), (0, _ansiFragments.color)('red', (0, _ansiFragments.modifier)('bold', 'MESSAGE'), ' ▶︎ '), error.message).build();
}

function formatEntry(entry) {
  let priorityColor = 'none';
  let priorityModifier = 'none';

  if (entry.platform === 'android' && entry.priority >= _constants.Priority.ERROR || entry.platform === 'ios' && entry.priority >= _constants2.Priority.ERROR) {
    priorityColor = 'red';
  } else if (entry.platform === 'android' && entry.priority === _constants.Priority.WARN) {
    priorityColor = 'yellow';
  } else if (entry.platform === 'android' && entry.priority === _constants.Priority.VERBOSE || entry.platform === 'ios' && entry.priority === _constants2.Priority.DEBUG) {
    priorityModifier = 'dim';
  }

  const output = (0, _ansiFragments.container)((0, _ansiFragments.modifier)('dim', `[${entry.date.format('HH:mm:ss')}]`), (0, _ansiFragments.pad)(1), (0, _ansiFragments.color)(priorityColor, (0, _ansiFragments.modifier)(priorityModifier, `${entry.platform === 'android' ? _constants.Priority.toLetter(entry.priority) : _constants2.Priority.toLetter(entry.priority)} |`)), (0, _ansiFragments.pad)(1), (0, _ansiFragments.modifier)('bold', (0, _ansiFragments.color)(priorityColor, (0, _ansiFragments.modifier)(priorityModifier, entry.tag || entry.appId || ''))), (0, _ansiFragments.pad)(1), (0, _ansiFragments.color)(priorityColor, (0, _ansiFragments.modifier)(priorityModifier, '▶︎')), (0, _ansiFragments.pad)(1), (0, _ansiFragments.color)(priorityColor, (0, _ansiFragments.modifier)(priorityModifier, entry.messages[0])), (0, _ansiFragments.ifElse)(entry.messages.length > 1, (0, _ansiFragments.container)(...entry.messages.slice(1).map((line, index, arr) => (0, _ansiFragments.container)((0, _ansiFragments.pad)(1, '\n'), (0, _ansiFragments.pad)((entry.tag || entry.appId || '').length + 16), (0, _ansiFragments.color)(priorityColor, (0, _ansiFragments.modifier)(priorityColor === 'none' ? 'dim' : 'none', `${index === arr.length - 1 ? '└' : '│'} `)), (0, _ansiFragments.color)(priorityColor, (0, _ansiFragments.modifier)(priorityModifier, line))))), '')).build();
  return `${output}\n`;
}
//# sourceMappingURL=formatters.js.map