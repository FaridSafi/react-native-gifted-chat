"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Priority = void 0;
const codes = {
  DEBUG: 0,
  DEFAULT: 1,
  INFO: 2,
  ERROR: 3
};
const Priority = { ...codes,

  fromName(name) {
    const value = codes[name.toUpperCase()];
    return value ? value : 0;
  },

  toName(code) {
    return Object.keys(codes).find(key => codes[key] === code) || 'DEFAULT';
  },

  fromLetter(letter) {
    return codes[Object.keys(codes).find(key => key[0] === letter.toUpperCase()) || 'DEFAULT'];
  },

  toLetter(code) {
    return Priority.toName(code)[0];
  }

};
exports.Priority = Priority;
//# sourceMappingURL=constants.js.map