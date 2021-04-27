"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class DirectoryAlreadyExistsError extends Error {
  constructor(directory) {
    super(`Cannot initialize new project because directory "${directory}" already exists.`);
  }

}

exports.default = DirectoryAlreadyExistsError;