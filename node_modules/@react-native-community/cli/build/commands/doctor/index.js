"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _doctor = _interopRequireDefault(require("./doctor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  func: _doctor.default,
  name: 'doctor',
  description: '[EXPERIMENTAL] Diagnose and fix common Node.js, iOS, Android & React Native issues.',
  options: [{
    name: '--fix',
    description: 'Attempt to fix all diagnosed issues.'
  }, {
    name: '--contributor',
    description: 'Add healthchecks required to installations required for contributing to React Native.'
  }]
};
exports.default = _default;