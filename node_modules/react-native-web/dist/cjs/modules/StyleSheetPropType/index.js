"use strict";

exports.__esModule = true;
exports.default = void 0;

var _createStrictShapeTypeChecker = _interopRequireDefault(require("../createStrictShapeTypeChecker"));

var _StyleSheet = _interopRequireDefault(require("../../exports/StyleSheet"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
function StyleSheetPropType(shape) {
  var shapePropType = (0, _createStrictShapeTypeChecker.default)(shape);
  return function (props, propName, componentName, location) {
    var newProps = props;

    if (props[propName]) {
      // Just make a dummy prop object with only the flattened style
      newProps = {};

      var flatStyle = _StyleSheet.default.flatten(props[propName]); // Remove custom properties from check


      var nextStyle = Object.keys(flatStyle).reduce(function (acc, curr) {
        if (curr.indexOf('--') !== 0) {
          acc[curr] = flatStyle[curr];
        }

        return acc;
      }, {});
      newProps[propName] = nextStyle;
    }

    for (var _len = arguments.length, rest = new Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
      rest[_key - 4] = arguments[_key];
    }

    return shapePropType.apply(void 0, [newProps, propName, componentName, location].concat(rest));
  };
}

var _default = StyleSheetPropType;
exports.default = _default;
module.exports = exports.default;