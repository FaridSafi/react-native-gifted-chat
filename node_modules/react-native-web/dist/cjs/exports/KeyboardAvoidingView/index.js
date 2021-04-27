"use strict";

exports.__esModule = true;
exports.default = void 0;

var _View = _interopRequireDefault(require("../View"));

var _propTypes = require("prop-types");

var _react = _interopRequireWildcard(require("react"));

var _ViewPropTypes = _interopRequireDefault(require("../ViewPropTypes"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var KeyboardAvoidingView =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(KeyboardAvoidingView, _Component);

  function KeyboardAvoidingView() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this.frame = null;

    _this.onLayout = function (event) {
      _this.frame = event.nativeEvent.layout;
    };

    return _this;
  }

  var _proto = KeyboardAvoidingView.prototype;

  _proto.relativeKeyboardHeight = function relativeKeyboardHeight(keyboardFrame) {
    var frame = this.frame;

    if (!frame || !keyboardFrame) {
      return 0;
    }

    var keyboardY = keyboardFrame.screenY - this.props.keyboardVerticalOffset;
    return Math.max(frame.y + frame.height - keyboardY, 0);
  };

  _proto.onKeyboardChange = function onKeyboardChange(event) {};

  _proto.render = function render() {
    var _this$props = this.props,
        behavior = _this$props.behavior,
        contentContainerStyle = _this$props.contentContainerStyle,
        keyboardVerticalOffset = _this$props.keyboardVerticalOffset,
        rest = _objectWithoutPropertiesLoose(_this$props, ["behavior", "contentContainerStyle", "keyboardVerticalOffset"]);

    return _react.default.createElement(_View.default, _extends({
      onLayout: this.onLayout
    }, rest));
  };

  return KeyboardAvoidingView;
}(_react.Component);

KeyboardAvoidingView.defaultProps = {
  keyboardVerticalOffset: 0
};
KeyboardAvoidingView.propTypes = process.env.NODE_ENV !== "production" ? _objectSpread({}, _ViewPropTypes.default, {
  behavior: (0, _propTypes.oneOf)(['height', 'padding', 'position']),
  contentContainerStyle: _ViewPropTypes.default.style,
  keyboardVerticalOffset: _propTypes.number.isRequired
}) : {};
var _default = KeyboardAvoidingView;
exports.default = _default;
module.exports = exports.default;