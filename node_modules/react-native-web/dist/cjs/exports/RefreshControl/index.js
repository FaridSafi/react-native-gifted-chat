"use strict";

exports.__esModule = true;
exports.default = void 0;

var _ColorPropType = _interopRequireDefault(require("../ColorPropType"));

var _View = _interopRequireDefault(require("../View"));

var _ViewPropTypes = _interopRequireDefault(require("../ViewPropTypes"));

var _propTypes = require("prop-types");

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var RefreshControl =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(RefreshControl, _Component);

  function RefreshControl() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = RefreshControl.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        colors = _this$props.colors,
        enabled = _this$props.enabled,
        onRefresh = _this$props.onRefresh,
        progressBackgroundColor = _this$props.progressBackgroundColor,
        progressViewOffset = _this$props.progressViewOffset,
        refreshing = _this$props.refreshing,
        size = _this$props.size,
        tintColor = _this$props.tintColor,
        title = _this$props.title,
        titleColor = _this$props.titleColor,
        rest = _objectWithoutPropertiesLoose(_this$props, ["colors", "enabled", "onRefresh", "progressBackgroundColor", "progressViewOffset", "refreshing", "size", "tintColor", "title", "titleColor"]);

    return _react.default.createElement(_View.default, rest);
  };

  return RefreshControl;
}(_react.Component);

RefreshControl.propTypes = process.env.NODE_ENV !== "production" ? _objectSpread({}, _ViewPropTypes.default, {
  colors: (0, _propTypes.arrayOf)(_ColorPropType.default),
  enabled: _propTypes.bool,
  onRefresh: _propTypes.func,
  progressBackgroundColor: _ColorPropType.default,
  progressViewOffset: _propTypes.number,
  refreshing: _propTypes.bool.isRequired,
  size: (0, _propTypes.oneOf)([0, 1]),
  tintColor: _ColorPropType.default,
  title: _propTypes.string,
  titleColor: _ColorPropType.default
}) : {};
var _default = RefreshControl;
exports.default = _default;
module.exports = exports.default;