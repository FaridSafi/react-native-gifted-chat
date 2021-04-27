"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class ReservedNameError extends Error {
  constructor() {
    super('Not a valid name for a project. Please do not use the reserved word "React".');
  }

}

exports.default = ReservedNameError;