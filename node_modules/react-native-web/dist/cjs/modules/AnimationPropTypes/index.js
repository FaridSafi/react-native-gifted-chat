"use strict";

exports.__esModule = true;
exports.default = void 0;

var _propTypes = require("prop-types");

/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
var animationDirectionEnum = ['alternate', 'alternate-reverse', 'normal', 'reverse'];
var animationFillModeEnum = ['none', 'forwards', 'backwards', 'both'];
var animationPlayStateEnum = ['paused', 'running'];
var AnimationPropTypes = {
  animationDelay: (0, _propTypes.oneOfType)([_propTypes.string, (0, _propTypes.arrayOf)(_propTypes.string)]),
  animationDirection: (0, _propTypes.oneOfType)([(0, _propTypes.oneOf)(animationDirectionEnum), (0, _propTypes.arrayOf)(animationDirectionEnum)]),
  animationDuration: (0, _propTypes.oneOfType)([_propTypes.string, (0, _propTypes.arrayOf)(_propTypes.string)]),
  animationFillMode: (0, _propTypes.oneOfType)([(0, _propTypes.oneOf)(animationFillModeEnum), (0, _propTypes.arrayOf)(animationFillModeEnum)]),
  animationIterationCount: (0, _propTypes.oneOfType)([_propTypes.number, (0, _propTypes.oneOf)(['infinite']), (0, _propTypes.arrayOf)((0, _propTypes.oneOfType)([_propTypes.number, (0, _propTypes.oneOf)(['infinite'])]))]),
  animationKeyframes: (0, _propTypes.oneOfType)([_propTypes.string, _propTypes.object, (0, _propTypes.arrayOf)((0, _propTypes.oneOfType)([_propTypes.string, _propTypes.object]))]),
  animationPlayState: (0, _propTypes.oneOfType)([(0, _propTypes.oneOf)(animationPlayStateEnum), (0, _propTypes.arrayOf)(animationPlayStateEnum)]),
  animationTimingFunction: (0, _propTypes.oneOfType)([_propTypes.string, (0, _propTypes.arrayOf)(_propTypes.string)]),
  transitionDelay: (0, _propTypes.oneOfType)([_propTypes.string, (0, _propTypes.arrayOf)(_propTypes.string)]),
  transitionDuration: (0, _propTypes.oneOfType)([_propTypes.string, (0, _propTypes.arrayOf)(_propTypes.string)]),
  transitionProperty: (0, _propTypes.oneOfType)([_propTypes.string, (0, _propTypes.arrayOf)(_propTypes.string)]),
  transitionTimingFunction: (0, _propTypes.oneOfType)([_propTypes.string, (0, _propTypes.arrayOf)(_propTypes.string)])
};
var _default = AnimationPropTypes;
exports.default = _default;
module.exports = exports.default;