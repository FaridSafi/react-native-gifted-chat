"use strict";

exports.__esModule = true;
exports.default = void 0;

var _ColorPropType = _interopRequireDefault(require("../ColorPropType"));

var _StyleSheet = _interopRequireDefault(require("../StyleSheet"));

var _TouchableOpacity = _interopRequireDefault(require("../TouchableOpacity"));

var _Text = _interopRequireDefault(require("../Text"));

var _propTypes = require("prop-types");

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Button =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(Button, _Component);

  function Button() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = Button.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        accessibilityLabel = _this$props.accessibilityLabel,
        color = _this$props.color,
        disabled = _this$props.disabled,
        onPress = _this$props.onPress,
        testID = _this$props.testID,
        title = _this$props.title;
    return _react.default.createElement(_TouchableOpacity.default, {
      accessibilityLabel: accessibilityLabel,
      accessibilityRole: "button",
      disabled: disabled,
      onPress: onPress,
      style: [styles.button, color && {
        backgroundColor: color
      }, disabled && styles.buttonDisabled],
      testID: testID
    }, _react.default.createElement(_Text.default, {
      style: [styles.text, disabled && styles.textDisabled]
    }, title));
  };

  return Button;
}(_react.Component);

Button.propTypes = process.env.NODE_ENV !== "production" ? {
  accessibilityLabel: _propTypes.string,
  color: _ColorPropType.default,
  disabled: _propTypes.bool,
  onPress: _propTypes.func.isRequired,
  testID: _propTypes.string,
  title: _propTypes.string.isRequired
} : {};

var styles = _StyleSheet.default.create({
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 2
  },
  text: {
    color: '#fff',
    fontWeight: '500',
    padding: 8,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  buttonDisabled: {
    backgroundColor: '#dfdfdf'
  },
  textDisabled: {
    color: '#a1a1a1'
  }
});

var _default = Button;
exports.default = _default;
module.exports = exports.default;