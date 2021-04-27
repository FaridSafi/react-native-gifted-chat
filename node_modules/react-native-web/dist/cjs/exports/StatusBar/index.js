"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = require("react");

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var StatusBar =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(StatusBar, _Component);

  function StatusBar() {
    return _Component.apply(this, arguments) || this;
  }

  StatusBar.setBackgroundColor = function setBackgroundColor() {};

  StatusBar.setBarStyle = function setBarStyle() {};

  StatusBar.setHidden = function setHidden() {};

  StatusBar.setNetworkActivityIndicatorVisible = function setNetworkActivityIndicatorVisible() {};

  StatusBar.setTranslucent = function setTranslucent() {};

  var _proto = StatusBar.prototype;

  _proto.render = function render() {
    return null;
  };

  return StatusBar;
}(_react.Component);

exports.default = StatusBar;
module.exports = exports.default;