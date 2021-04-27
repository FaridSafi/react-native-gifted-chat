"use strict";

exports.__esModule = true;
exports.default = void 0;

var _AnimatedImplementation = _interopRequireDefault(require("../../vendor/react-native/Animated/AnimatedImplementation"));

var _Image = _interopRequireDefault(require("../Image"));

var _ScrollView = _interopRequireDefault(require("../ScrollView"));

var _Text = _interopRequireDefault(require("../Text"));

var _View = _interopRequireDefault(require("../View"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Animated = _objectSpread({}, _AnimatedImplementation.default, {
  Image: _AnimatedImplementation.default.createAnimatedComponent(_Image.default),
  ScrollView: _AnimatedImplementation.default.createAnimatedComponent(_ScrollView.default),
  View: _AnimatedImplementation.default.createAnimatedComponent(_View.default),
  Text: _AnimatedImplementation.default.createAnimatedComponent(_Text.default)
});

var _default = Animated;
exports.default = _default;
module.exports = exports.default;