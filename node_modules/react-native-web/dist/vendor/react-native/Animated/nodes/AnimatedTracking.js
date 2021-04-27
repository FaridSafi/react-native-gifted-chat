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

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

import AnimatedValue from './AnimatedValue';
import AnimatedNode from './AnimatedNode';
import { generateNewAnimationId, shouldUseNativeDriver } from '../NativeAnimatedHelper';

var AnimatedTracking =
/*#__PURE__*/
function (_AnimatedNode) {
  _inheritsLoose(AnimatedTracking, _AnimatedNode);

  function AnimatedTracking(value, parent, animationClass, animationConfig, callback) {
    var _this;

    _this = _AnimatedNode.call(this) || this;
    _this._value = value;
    _this._parent = parent;
    _this._animationClass = animationClass;
    _this._animationConfig = animationConfig;
    _this._useNativeDriver = shouldUseNativeDriver(animationConfig);
    _this._callback = callback;

    _this.__attach();

    return _this;
  }

  var _proto = AnimatedTracking.prototype;

  _proto.__makeNative = function __makeNative() {
    this.__isNative = true;

    this._parent.__makeNative();

    _AnimatedNode.prototype.__makeNative.call(this);

    this._value.__makeNative();
  };

  _proto.__getValue = function __getValue() {
    return this._parent.__getValue();
  };

  _proto.__attach = function __attach() {
    this._parent.__addChild(this);

    if (this._useNativeDriver) {
      // when the tracking starts we need to convert this node to a "native node"
      // so that the parent node will be made "native" too. This is necessary as
      // if we don't do this `update` method will get called. At that point it
      // may be too late as it would mean the JS driver has already started
      // updating node values
      this.__makeNative();
    }
  };

  _proto.__detach = function __detach() {
    this._parent.__removeChild(this);

    _AnimatedNode.prototype.__detach.call(this);
  };

  _proto.update = function update() {
    this._value.animate(new this._animationClass(_objectSpread({}, this._animationConfig, {
      toValue: this._animationConfig.toValue.__getValue()
    })), this._callback);
  };

  _proto.__getNativeConfig = function __getNativeConfig() {
    var animation = new this._animationClass(_objectSpread({}, this._animationConfig, {
      // remove toValue from the config as it's a ref to Animated.Value
      toValue: undefined
    }));

    var animationConfig = animation.__getNativeAnimationConfig();

    return {
      type: 'tracking',
      animationId: generateNewAnimationId(),
      animationConfig: animationConfig,
      toValue: this._parent.__getNativeTag(),
      value: this._value.__getNativeTag()
    };
  };

  return AnimatedTracking;
}(AnimatedNode);

export default AnimatedTracking;