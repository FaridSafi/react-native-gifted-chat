"use strict";

exports.__esModule = true;
exports.default = void 0;

var _ensureComponentIsNative = _interopRequireDefault(require("../../modules/ensureComponentIsNative"));

var _Image = _interopRequireDefault(require("../Image"));

var _StyleSheet = _interopRequireDefault(require("../StyleSheet"));

var _View = _interopRequireDefault(require("../View"));

var _ViewPropTypes = _interopRequireDefault(require("../ViewPropTypes"));

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var emptyObject = {};
/**
 * Very simple drop-in replacement for <Image> which supports nesting views.
 */

var ImageBackground =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(ImageBackground, _Component);

  function ImageBackground() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this._viewRef = null;

    _this._captureRef = function (ref) {
      _this._viewRef = ref;
    };

    return _this;
  }

  var _proto = ImageBackground.prototype;

  _proto.setNativeProps = function setNativeProps(props) {
    // Work-around flow
    var viewRef = this._viewRef;

    if (viewRef) {
      (0, _ensureComponentIsNative.default)(viewRef);
      viewRef.setNativeProps(props);
    }
  };

  _proto.render = function render() {
    var _this$props = this.props,
        children = _this$props.children,
        style = _this$props.style,
        imageStyle = _this$props.imageStyle,
        imageRef = _this$props.imageRef,
        props = _objectWithoutPropertiesLoose(_this$props, ["children", "style", "imageStyle", "imageRef"]);

    return _react.default.createElement(_View.default, {
      ref: this._captureRef,
      style: style
    }, _react.default.createElement(_Image.default, _extends({}, props, {
      ref: imageRef,
      style: [_StyleSheet.default.absoluteFill, {
        // Temporary Workaround:
        // Current (imperfect yet) implementation of <Image> overwrites width and height styles
        // (which is not quite correct), and these styles conflict with explicitly set styles
        // of <ImageBackground> and with our internal layout model here.
        // So, we have to proxy/reapply these styles explicitly for actual <Image> component.
        // This workaround should be removed after implementing proper support of
        // intrinsic content size of the <Image>.
        width: style.width,
        height: style.height,
        zIndex: -1
      }, imageStyle]
    })), children);
  };

  return ImageBackground;
}(_react.Component);

ImageBackground.defaultProps = {
  style: emptyObject
};
ImageBackground.propTypes = process.env.NODE_ENV !== "production" ? _objectSpread({}, _Image.default.propTypes, {
  imageStyle: _Image.default.propTypes.style,
  style: _ViewPropTypes.default.style
}) : {};
var _default = ImageBackground;
exports.default = _default;
module.exports = exports.default;