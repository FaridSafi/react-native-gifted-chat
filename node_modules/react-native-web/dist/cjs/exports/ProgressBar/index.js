"use strict";

exports.__esModule = true;
exports.default = void 0;

var _applyNativeMethods = _interopRequireDefault(require("../../modules/applyNativeMethods"));

var _ColorPropType = _interopRequireDefault(require("../ColorPropType"));

var _StyleSheet = _interopRequireDefault(require("../StyleSheet"));

var _View = _interopRequireDefault(require("../View"));

var _ViewPropTypes = _interopRequireDefault(require("../ViewPropTypes"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = require("prop-types");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var ProgressBar =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(ProgressBar, _Component);

  function ProgressBar() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;

    _this._setProgressRef = function (element) {
      _this._progressElement = element;
    };

    _this._updateProgressWidth = function () {
      var _this$props = _this.props,
          indeterminate = _this$props.indeterminate,
          progress = _this$props.progress;
      var percentageProgress = indeterminate ? 50 : progress * 100;
      var width = indeterminate ? '25%' : percentageProgress + "%";

      if (_this._progressElement) {
        _this._progressElement.setNativeProps({
          style: {
            width: width
          }
        });
      }
    };

    return _this;
  }

  var _proto = ProgressBar.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this._updateProgressWidth();
  };

  _proto.componentDidUpdate = function componentDidUpdate() {
    this._updateProgressWidth();
  };

  _proto.render = function render() {
    var _this$props2 = this.props,
        color = _this$props2.color,
        indeterminate = _this$props2.indeterminate,
        progress = _this$props2.progress,
        trackColor = _this$props2.trackColor,
        style = _this$props2.style,
        other = _objectWithoutPropertiesLoose(_this$props2, ["color", "indeterminate", "progress", "trackColor", "style"]);

    var percentageProgress = progress * 100;
    return _react.default.createElement(_View.default, _extends({}, other, {
      accessibilityRole: "progressbar",
      "aria-valuemax": "100",
      "aria-valuemin": "0",
      "aria-valuenow": indeterminate ? null : percentageProgress,
      style: [styles.track, style, {
        backgroundColor: trackColor
      }]
    }), _react.default.createElement(_View.default, {
      ref: this._setProgressRef,
      style: [styles.progress, indeterminate && styles.animation, {
        backgroundColor: color
      }]
    }));
  };

  return ProgressBar;
}(_react.Component);

ProgressBar.displayName = 'ProgressBar';
ProgressBar.defaultProps = {
  color: '#1976D2',
  indeterminate: false,
  progress: 0,
  trackColor: 'transparent'
};
ProgressBar.propTypes = process.env.NODE_ENV !== "production" ? _objectSpread({}, _ViewPropTypes.default, {
  color: _ColorPropType.default,
  indeterminate: _propTypes.bool,
  progress: _propTypes.number,
  trackColor: _ColorPropType.default
}) : {};

var styles = _StyleSheet.default.create({
  track: {
    height: 5,
    overflow: 'hidden',
    userSelect: 'none',
    zIndex: 0
  },
  progress: {
    height: '100%',
    zIndex: -1
  },
  animation: {
    animationDuration: '1s',
    animationKeyframes: [{
      '0%': {
        transform: [{
          translateX: '-100%'
        }]
      },
      '100%': {
        transform: [{
          translateX: '400%'
        }]
      }
    }],
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite'
  }
});

var _default = (0, _applyNativeMethods.default)(ProgressBar);

exports.default = _default;
module.exports = exports.default;