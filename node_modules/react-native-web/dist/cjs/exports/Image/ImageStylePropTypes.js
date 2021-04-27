"use strict";

exports.__esModule = true;
exports.default = void 0;

var _AnimationPropTypes = _interopRequireDefault(require("../../modules/AnimationPropTypes"));

var _BorderPropTypes = _interopRequireDefault(require("../../modules/BorderPropTypes"));

var _ColorPropType = _interopRequireDefault(require("../ColorPropType"));

var _ImageResizeMode = _interopRequireDefault(require("./ImageResizeMode"));

var _InteractionPropTypes = _interopRequireDefault(require("../../modules/InteractionPropTypes"));

var _LayoutPropTypes = _interopRequireDefault(require("../../modules/LayoutPropTypes"));

var _ShadowPropTypes = _interopRequireDefault(require("../../modules/ShadowPropTypes"));

var _TransformPropTypes = _interopRequireDefault(require("../../modules/TransformPropTypes"));

var _propTypes = require("prop-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ImageStylePropTypes = _objectSpread({}, _AnimationPropTypes.default, _BorderPropTypes.default, _InteractionPropTypes.default, _LayoutPropTypes.default, _ShadowPropTypes.default, _TransformPropTypes.default, {
  backgroundColor: _ColorPropType.default,
  opacity: _propTypes.number,
  resizeMode: (0, _propTypes.oneOf)(Object.keys(_ImageResizeMode.default)),
  tintColor: _ColorPropType.default,

  /**
   * @platform unsupported
   */
  overlayColor: _propTypes.string,

  /**
   * @platform web
   */
  boxShadow: _propTypes.string,
  filter: _propTypes.string
});

var _default = ImageStylePropTypes;
exports.default = _default;
module.exports = exports.default;