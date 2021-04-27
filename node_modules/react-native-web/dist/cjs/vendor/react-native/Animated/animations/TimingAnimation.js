/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
'use strict';

exports.__esModule = true;
exports.default = void 0;

var _AnimatedValue = _interopRequireDefault(require("../nodes/AnimatedValue"));

var _AnimatedValueXY = _interopRequireDefault(require("../nodes/AnimatedValueXY"));

var _Animation2 = _interopRequireDefault(require("./Animation"));

var _Easing = _interopRequireDefault(require("../Easing"));

var _NativeAnimatedHelper = require("../NativeAnimatedHelper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _easeInOut;

function easeInOut() {
  if (!_easeInOut) {
    _easeInOut = _Easing.default.inOut(_Easing.default.ease);
  }

  return _easeInOut;
}

var TimingAnimation =
/*#__PURE__*/
function (_Animation) {
  _inheritsLoose(TimingAnimation, _Animation);

  function TimingAnimation(config) {
    var _this;

    _this = _Animation.call(this) || this;
    _this._toValue = config.toValue;
    _this._easing = config.easing !== undefined ? config.easing : easeInOut();
    _this._duration = config.duration !== undefined ? config.duration : 500;
    _this._delay = config.delay !== undefined ? config.delay : 0;
    _this.__iterations = config.iterations !== undefined ? config.iterations : 1;
    _this.__isInteraction = config.isInteraction !== undefined ? config.isInteraction : true;
    _this._useNativeDriver = (0, _NativeAnimatedHelper.shouldUseNativeDriver)(config);
    return _this;
  }

  var _proto = TimingAnimation.prototype;

  _proto.__getNativeAnimationConfig = function __getNativeAnimationConfig() {
    var frameDuration = 1000.0 / 60.0;
    var frames = [];

    for (var dt = 0.0; dt < this._duration; dt += frameDuration) {
      frames.push(this._easing(dt / this._duration));
    }

    frames.push(this._easing(1));
    return {
      type: 'frames',
      frames: frames,
      toValue: this._toValue,
      iterations: this.__iterations
    };
  };

  _proto.start = function start(fromValue, onUpdate, onEnd, previousAnimation, animatedValue) {
    var _this2 = this;

    this.__active = true;
    this._fromValue = fromValue;
    this._onUpdate = onUpdate;
    this.__onEnd = onEnd;

    var start = function start() {
      // Animations that sometimes have 0 duration and sometimes do not
      // still need to use the native driver when duration is 0 so as to
      // not cause intermixed JS and native animations.
      if (_this2._duration === 0 && !_this2._useNativeDriver) {
        _this2._onUpdate(_this2._toValue);

        _this2.__debouncedOnEnd({
          finished: true
        });
      } else {
        _this2._startTime = Date.now();

        if (_this2._useNativeDriver) {
          _this2.__startNativeAnimation(animatedValue);
        } else {
          _this2._animationFrame = requestAnimationFrame(_this2.onUpdate.bind(_this2));
        }
      }
    };

    if (this._delay) {
      this._timeout = setTimeout(start, this._delay);
    } else {
      start();
    }
  };

  _proto.onUpdate = function onUpdate() {
    var now = Date.now();

    if (now >= this._startTime + this._duration) {
      if (this._duration === 0) {
        this._onUpdate(this._toValue);
      } else {
        this._onUpdate(this._fromValue + this._easing(1) * (this._toValue - this._fromValue));
      }

      this.__debouncedOnEnd({
        finished: true
      });

      return;
    }

    this._onUpdate(this._fromValue + this._easing((now - this._startTime) / this._duration) * (this._toValue - this._fromValue));

    if (this.__active) {
      this._animationFrame = requestAnimationFrame(this.onUpdate.bind(this));
    }
  };

  _proto.stop = function stop() {
    _Animation.prototype.stop.call(this);

    this.__active = false;
    clearTimeout(this._timeout);
    global.cancelAnimationFrame(this._animationFrame);

    this.__debouncedOnEnd({
      finished: false
    });
  };

  return TimingAnimation;
}(_Animation2.default);

var _default = TimingAnimation;
exports.default = _default;
module.exports = exports.default;