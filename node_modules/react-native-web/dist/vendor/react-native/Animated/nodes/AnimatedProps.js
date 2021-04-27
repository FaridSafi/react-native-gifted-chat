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

import { AnimatedEvent } from '../AnimatedEvent';
import AnimatedNode from './AnimatedNode';
import AnimatedStyle from './AnimatedStyle';
import NativeAnimatedHelper from '../NativeAnimatedHelper';
import findNodeHandle from '../../../../exports/findNodeHandle';
import invariant from 'fbjs/lib/invariant';

var AnimatedProps =
/*#__PURE__*/
function (_AnimatedNode) {
  _inheritsLoose(AnimatedProps, _AnimatedNode);

  function AnimatedProps(props, callback) {
    var _this;

    _this = _AnimatedNode.call(this) || this;

    if (props.style) {
      props = _objectSpread({}, props, {
        style: new AnimatedStyle(props.style)
      });
    }

    _this._props = props;
    _this._callback = callback;

    _this.__attach();

    return _this;
  }

  var _proto = AnimatedProps.prototype;

  _proto.__getValue = function __getValue() {
    var props = {};

    for (var key in this._props) {
      var value = this._props[key];

      if (value instanceof AnimatedNode) {
        if (!value.__isNative || value instanceof AnimatedStyle) {
          // We cannot use value of natively driven nodes this way as the value we have access from
          // JS may not be up to date.
          props[key] = value.__getValue();
        }
      } else if (value instanceof AnimatedEvent) {
        props[key] = value.__getHandler();
      } else {
        props[key] = value;
      }
    }

    return props;
  };

  _proto.__getAnimatedValue = function __getAnimatedValue() {
    var props = {};

    for (var key in this._props) {
      var value = this._props[key];

      if (value instanceof AnimatedNode) {
        props[key] = value.__getAnimatedValue();
      }
    }

    return props;
  };

  _proto.__attach = function __attach() {
    for (var key in this._props) {
      var value = this._props[key];

      if (value instanceof AnimatedNode) {
        value.__addChild(this);
      }
    }
  };

  _proto.__detach = function __detach() {
    if (this.__isNative && this._animatedView) {
      this.__disconnectAnimatedView();
    }

    for (var key in this._props) {
      var value = this._props[key];

      if (value instanceof AnimatedNode) {
        value.__removeChild(this);
      }
    }

    _AnimatedNode.prototype.__detach.call(this);
  };

  _proto.update = function update() {
    this._callback();
  };

  _proto.__makeNative = function __makeNative() {
    if (!this.__isNative) {
      this.__isNative = true;

      for (var key in this._props) {
        var value = this._props[key];

        if (value instanceof AnimatedNode) {
          value.__makeNative();
        }
      }

      if (this._animatedView) {
        this.__connectAnimatedView();
      }
    }
  };

  _proto.setNativeView = function setNativeView(animatedView) {
    if (this._animatedView === animatedView) {
      return;
    }

    this._animatedView = animatedView;

    if (this.__isNative) {
      this.__connectAnimatedView();
    }
  };

  _proto.__connectAnimatedView = function __connectAnimatedView() {
    invariant(this.__isNative, 'Expected node to be marked as "native"');
    var nativeViewTag = findNodeHandle(this._animatedView);
    invariant(nativeViewTag != null, 'Unable to locate attached view in the native tree');
    NativeAnimatedHelper.API.connectAnimatedNodeToView(this.__getNativeTag(), nativeViewTag);
  };

  _proto.__disconnectAnimatedView = function __disconnectAnimatedView() {
    invariant(this.__isNative, 'Expected node to be marked as "native"');
    var nativeViewTag = findNodeHandle(this._animatedView);
    invariant(nativeViewTag != null, 'Unable to locate attached view in the native tree');
    NativeAnimatedHelper.API.disconnectAnimatedNodeFromView(this.__getNativeTag(), nativeViewTag);
  };

  _proto.__getNativeConfig = function __getNativeConfig() {
    var propsConfig = {};

    for (var propKey in this._props) {
      var value = this._props[propKey];

      if (value instanceof AnimatedNode) {
        propsConfig[propKey] = value.__getNativeTag();
      }
    }

    return {
      type: 'props',
      props: propsConfig
    };
  };

  return AnimatedProps;
}(AnimatedNode);

export default AnimatedProps;