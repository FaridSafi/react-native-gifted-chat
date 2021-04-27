"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLoader = getLoader;
exports.NoopLoader = void 0;

function _ora() {
  const data = _interopRequireDefault(require("ora"));

  _ora = function () {
    return data;
  };

  return data;
}

function _cliTools() {
  const data = require("@react-native-community/cli-tools");

  _cliTools = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class OraNoop {
  constructor() {
    _defineProperty(this, "spinner", {
      interval: 1,
      frames: []
    });

    _defineProperty(this, "indent", 0);

    _defineProperty(this, "isSpinning", false);

    _defineProperty(this, "text", '');

    _defineProperty(this, "prefixText", '');

    _defineProperty(this, "color", 'blue');
  }

  succeed(_text) {
    return (0, _ora().default)();
  }

  fail(_text) {
    return (0, _ora().default)();
  }

  start(_text) {
    return (0, _ora().default)();
  }

  stop() {
    return (0, _ora().default)();
  }

  warn(_text) {
    return (0, _ora().default)();
  }

  info(_text) {
    return (0, _ora().default)();
  }

  stopAndPersist() {
    return (0, _ora().default)();
  }

  clear() {
    return (0, _ora().default)();
  }

  render() {
    return (0, _ora().default)();
  }

  frame() {
    return (0, _ora().default)();
  }

}

function getLoader() {
  // FIXME refactor getLoader to not rely on class instantiation to avoid type conflict or implement an default Ora Loader Class definition
  return _cliTools().logger.isVerbose() ? OraNoop : _ora().default;
}

const NoopLoader = OraNoop;
exports.NoopLoader = NoopLoader;