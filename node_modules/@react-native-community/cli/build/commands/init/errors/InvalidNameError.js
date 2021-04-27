"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class InvalidNameError extends Error {
  constructor(name) {
    super(`"${name}" is not a valid name for a project. Please use a valid identifier name (alphanumeric).`);
  }

}

exports.default = InvalidNameError;