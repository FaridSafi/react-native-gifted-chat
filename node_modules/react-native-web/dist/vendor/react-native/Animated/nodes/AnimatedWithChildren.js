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

import AnimatedNode from './AnimatedNode';
import NativeAnimatedHelper from '../NativeAnimatedHelper';

var AnimatedWithChildren =
/*#__PURE__*/
function (_AnimatedNode) {
  _inheritsLoose(AnimatedWithChildren, _AnimatedNode);

  function AnimatedWithChildren() {
    var _this;

    _this = _AnimatedNode.call(this) || this;
    _this._children = [];
    return _this;
  }

  var _proto = AnimatedWithChildren.prototype;

  _proto.__makeNative = function __makeNative() {
    if (!this.__isNative) {
      this.__isNative = true;

      for (var _iterator = this._children, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var child = _ref;

        child.__makeNative();

        NativeAnimatedHelper.API.connectAnimatedNodes(this.__getNativeTag(), child.__getNativeTag());
      }
    }
  };

  _proto.__addChild = function __addChild(child) {
    if (this._children.length === 0) {
      this.__attach();
    }

    this._children.push(child);

    if (this.__isNative) {
      // Only accept "native" animated nodes as children
      child.__makeNative();

      NativeAnimatedHelper.API.connectAnimatedNodes(this.__getNativeTag(), child.__getNativeTag());
    }
  };

  _proto.__removeChild = function __removeChild(child) {
    var index = this._children.indexOf(child);

    if (index === -1) {
      console.warn("Trying to remove a child that doesn't exist");
      return;
    }

    if (this.__isNative && child.__isNative) {
      NativeAnimatedHelper.API.disconnectAnimatedNodes(this.__getNativeTag(), child.__getNativeTag());
    }

    this._children.splice(index, 1);

    if (this._children.length === 0) {
      this.__detach();
    }
  };

  _proto.__getChildren = function __getChildren() {
    return this._children;
  };

  return AnimatedWithChildren;
}(AnimatedNode);

export default AnimatedWithChildren;