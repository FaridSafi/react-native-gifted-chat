"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = require("react");

var _propTypes = require("prop-types");

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var StaticRenderer =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(StaticRenderer, _Component);

  function StaticRenderer() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = StaticRenderer.prototype;

  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    return nextProps.shouldUpdate;
  };

  _proto.render = function render() {
    return this.props.render();
  };

  return StaticRenderer;
}(_react.Component);

exports.default = StaticRenderer;
StaticRenderer.propTypes = process.env.NODE_ENV !== "production" ? {
  render: _propTypes.func.isRequired,
  shouldUpdate: _propTypes.bool.isRequired
} : {};
module.exports = exports.default;