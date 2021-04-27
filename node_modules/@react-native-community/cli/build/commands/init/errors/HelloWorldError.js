"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class HelloWorldError extends Error {
  constructor() {
    super('Project name shouldn\'t contain "HelloWorld" name in it, because it is CLI\'s default placeholder name.');
  }

}

exports.default = HelloWorldError;