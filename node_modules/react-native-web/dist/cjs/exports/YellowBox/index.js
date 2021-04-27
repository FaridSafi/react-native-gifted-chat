"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _UnimplementedView = _interopRequireDefault(require("../../modules/UnimplementedView"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var YellowBox =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(YellowBox, _React$Component);

  function YellowBox() {
    return _React$Component.apply(this, arguments) || this;
  }

  YellowBox.ignoreWarnings = function ignoreWarnings() {};

  var _proto = YellowBox.prototype;

  _proto.render = function render() {
    return _react.default.createElement(_UnimplementedView.default, this.props);
  };

  return YellowBox;
}(_react.default.Component);

var _default = YellowBox;
exports.default = _default;
module.exports = exports.default;