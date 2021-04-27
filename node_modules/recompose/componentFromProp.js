'use strict';

exports.__esModule = true;

var _react = require('react');

var _omit = require('./utils/omit');

var _omit2 = _interopRequireDefault(_omit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var componentFromProp = function componentFromProp(propName) {
  var Component = function Component(props) {
    return (0, _react.createElement)(props[propName], (0, _omit2.default)(props, [propName]));
  };
  Component.displayName = 'componentFromProp(' + propName + ')';
  return Component;
};

exports.default = componentFromProp;