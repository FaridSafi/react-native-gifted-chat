"use strict";

exports.__esModule = true;
exports.default = renderApplication;
exports.getApplication = getApplication;

var _AppContainer = _interopRequireDefault(require("./AppContainer"));

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

var _hydrate = _interopRequireDefault(require("../../modules/hydrate"));

var _render = _interopRequireDefault(require("../render"));

var _styleResolver = _interopRequireDefault(require("../StyleSheet/styleResolver"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var renderFn = process.env.NODE_ENV !== 'production' ? _render.default : _hydrate.default;

function renderApplication(RootComponent, initialProps, rootTag, WrapperComponent, callback) {
  (0, _invariant.default)(rootTag, 'Expect to have a valid rootTag, instead got ', rootTag);
  renderFn(_react.default.createElement(_AppContainer.default, {
    WrapperComponent: WrapperComponent,
    rootTag: rootTag
  }, _react.default.createElement(RootComponent, initialProps)), rootTag, callback);
}

function getApplication(RootComponent, initialProps, WrapperComponent) {
  var element = _react.default.createElement(_AppContainer.default, {
    WrapperComponent: WrapperComponent,
    rootTag: {}
  }, _react.default.createElement(RootComponent, initialProps)); // Don't escape CSS text


  var getStyleElement = function getStyleElement(props) {
    var sheet = _styleResolver.default.getStyleSheet();

    return _react.default.createElement("style", _extends({}, props, {
      dangerouslySetInnerHTML: {
        __html: sheet.textContent
      },
      id: sheet.id
    }));
  };

  return {
    element: element,
    getStyleElement: getStyleElement
  };
}