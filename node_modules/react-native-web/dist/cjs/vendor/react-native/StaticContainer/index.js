"use strict";

exports.__esModule = true;
exports.default = void 0;

var _propTypes = require("prop-types");

var _react = require("react");

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var StaticContainer =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(StaticContainer, _Component);

  function StaticContainer() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = StaticContainer.prototype;

  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    return nextProps.shouldUpdate;
  };

  _proto.render = function render() {
    var child = this.props.children;
    return child === null || child === false ? null : _react.Children.only(child);
  };

  return StaticContainer;
}(_react.Component);

exports.default = StaticContainer;
StaticContainer.propTypes = process.env.NODE_ENV !== "production" ? {
  children: _propTypes.any.isRequired,
  shouldUpdate: _propTypes.bool.isRequired
} : {};
module.exports = exports.default;