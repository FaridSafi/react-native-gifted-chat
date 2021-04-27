"use strict";

exports.__esModule = true;
exports.default = void 0;

var _ColorPropType = _interopRequireDefault(require("../ColorPropType"));

var _react = require("react");

var _createElement = _interopRequireDefault(require("../createElement"));

var _propTypes = require("prop-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var PickerItem =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(PickerItem, _Component);

  function PickerItem() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = PickerItem.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        color = _this$props.color,
        label = _this$props.label,
        testID = _this$props.testID,
        value = _this$props.value;
    var style = {
      color: color
    };
    return (0, _createElement.default)('option', {
      style: style,
      testID: testID,
      value: value
    }, label);
  };

  return PickerItem;
}(_react.Component);

exports.default = PickerItem;
PickerItem.propTypes = process.env.NODE_ENV !== "production" ? {
  color: _ColorPropType.default,
  label: _propTypes.string.isRequired,
  testID: _propTypes.string,
  value: (0, _propTypes.oneOfType)([_propTypes.number, _propTypes.string])
} : {};
module.exports = exports.default;