"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHealthchecks = exports.HEALTHCHECK_TYPES = void 0;

var _nodeJS = _interopRequireDefault(require("./nodeJS"));

var _packageManagers = require("./packageManagers");

var _watchman = _interopRequireDefault(require("./watchman"));

var _androidHomeEnvVariable = _interopRequireDefault(require("./androidHomeEnvVariable"));

var _androidSDK = _interopRequireDefault(require("./androidSDK"));

var _androidNDK = _interopRequireDefault(require("./androidNDK"));

var _xcode = _interopRequireDefault(require("./xcode"));

var _cocoaPods = _interopRequireDefault(require("./cocoaPods"));

var _iosDeploy = _interopRequireDefault(require("./iosDeploy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const HEALTHCHECK_TYPES = {
  ERROR: 'ERROR',
  WARNING: 'WARNING'
};
exports.HEALTHCHECK_TYPES = HEALTHCHECK_TYPES;

const getHealthchecks = ({
  contributor
}) => _objectSpread({
  common: {
    label: 'Common',
    healthchecks: [_nodeJS.default, _packageManagers.yarn, _packageManagers.npm, ...(process.platform === 'darwin' ? [_watchman.default] : [])]
  },
  android: {
    label: 'Android',
    healthchecks: [_androidHomeEnvVariable.default, _androidSDK.default, ...(contributor ? [_androidNDK.default] : [])]
  }
}, process.platform === 'darwin' ? {
  ios: {
    label: 'iOS',
    healthchecks: [_xcode.default, _cocoaPods.default, _iosDeploy.default]
  }
} : {});

exports.getHealthchecks = getHealthchecks;