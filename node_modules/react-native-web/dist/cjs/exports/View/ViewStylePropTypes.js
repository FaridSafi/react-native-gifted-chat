"use strict";

exports.__esModule = true;
exports.default = void 0;

var _AnimationPropTypes = _interopRequireDefault(require("../../modules/AnimationPropTypes"));

var _BorderPropTypes = _interopRequireDefault(require("../../modules/BorderPropTypes"));

var _ColorPropType = _interopRequireDefault(require("../ColorPropType"));

var _InteractionPropTypes = _interopRequireDefault(require("../../modules/InteractionPropTypes"));

var _LayoutPropTypes = _interopRequireDefault(require("../../modules/LayoutPropTypes"));

var _ShadowPropTypes = _interopRequireDefault(require("../../modules/ShadowPropTypes"));

var _TransformPropTypes = _interopRequireDefault(require("../../modules/TransformPropTypes"));

var _propTypes = require("prop-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var stringOrNumber = (0, _propTypes.oneOfType)([_propTypes.string, _propTypes.number]);
var overscrollBehaviorType = (0, _propTypes.oneOf)(['auto', 'contain', 'none']);

var ViewStylePropTypes = _objectSpread({}, _AnimationPropTypes.default, _BorderPropTypes.default, _InteractionPropTypes.default, _LayoutPropTypes.default, _ShadowPropTypes.default, _TransformPropTypes.default, {
  backgroundColor: _ColorPropType.default,
  opacity: _propTypes.number,

  /**
   * @platform unsupported
   */
  elevation: _propTypes.number,

  /**
   * @platform web
   */
  backdropFilter: _propTypes.string,
  backgroundAttachment: _propTypes.string,
  backgroundBlendMode: _propTypes.string,
  backgroundClip: _propTypes.string,
  backgroundImage: _propTypes.string,
  backgroundOrigin: (0, _propTypes.oneOf)(['border-box', 'content-box', 'padding-box']),
  backgroundPosition: _propTypes.string,
  backgroundRepeat: _propTypes.string,
  backgroundSize: _propTypes.string,
  boxShadow: _propTypes.string,
  clip: _propTypes.string,
  filter: _propTypes.string,
  outlineColor: _ColorPropType.default,
  outlineOffset: stringOrNumber,
  outlineStyle: _propTypes.string,
  outlineWidth: stringOrNumber,
  overscrollBehavior: overscrollBehaviorType,
  overscrollBehaviorX: overscrollBehaviorType,
  overscrollBehaviorY: overscrollBehaviorType,
  scrollbarWidth: (0, _propTypes.oneOf)(['auto', 'none']),
  scrollSnapAlign: _propTypes.string,
  scrollSnapType: _propTypes.string,
  WebkitMaskImage: _propTypes.string,
  WebkitOverflowScrolling: (0, _propTypes.oneOf)(['auto', 'touch'])
});

var _default = ViewStylePropTypes;
exports.default = _default;
module.exports = exports.default;