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

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

import Animation from './Animation';
import { shouldUseNativeDriver } from '../NativeAnimatedHelper';

var DecayAnimation =
/*#__PURE__*/
function (_Animation) {
  _inheritsLoose(DecayAnimation, _Animation);

  function DecayAnimation(config) {
    var _this;

    _this = _Animation.call(this) || this;
    _this._deceleration = config.deceleration !== undefined ? config.deceleration : 0.998;
    _this._velocity = config.velocity;
    _this._useNativeDriver = shouldUseNativeDriver(config);
    _this.__isInteraction = config.isInteraction !== undefined ? config.isInteraction : true;
    _this.__iterations = config.iterations !== undefined ? config.iterations : 1;
    return _this;
  }

  var _proto = DecayAnimation.prototype;

  _proto.__getNativeAnimationConfig = function __getNativeAnimationConfig() {
    return {
      type: 'decay',
      deceleration: this._deceleration,
      velocity: this._velocity,
      iterations: this.__iterations
    };
  };

  _proto.start = function start(fromValue, onUpdate, onEnd, previousAnimation, animatedValue) {
    this.__active = true;
    this._lastValue = fromValue;
    this._fromValue = fromValue;
    this._onUpdate = onUpdate;
    this.__onEnd = onEnd;
    this._startTime = Date.now();

    if (this._useNativeDriver) {
      this.__startNativeAnimation(animatedValue);
    } else {
      this._animationFrame = requestAnimationFrame(this.onUpdate.bind(this));
    }
  };

  _proto.onUpdate = function onUpdate() {
    var now = Date.now();
    var value = this._fromValue + this._velocity / (1 - this._deceleration) * (1 - Math.exp(-(1 - this._deceleration) * (now - this._startTime)));

    this._onUpdate(value);

    if (Math.abs(this._lastValue - value) < 0.1) {
      this.__debouncedOnEnd({
        finished: true
      });

      return;
    }

    this._lastValue = value;

    if (this.__active) {
      this._animationFrame = requestAnimationFrame(this.onUpdate.bind(this));
    }
  };

  _proto.stop = function stop() {
    _Animation.prototype.stop.call(this);

    this.__active = false;
    global.cancelAnimationFrame(this._animationFrame);

    this.__debouncedOnEnd({
      finished: false
    });
  };

  return DecayAnimation;
}(Animation);

export default DecayAnimation;