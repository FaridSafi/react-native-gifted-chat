"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeHook;

function _execa() {
  const data = _interopRequireDefault(require("execa"));

  _execa = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeHook(command) {
  return () => {
    const args = command.split(' ');
    const cmd = args.shift();
    return (0, _execa().default)(cmd, args, {
      stdio: 'inherit'
    });
  };
}