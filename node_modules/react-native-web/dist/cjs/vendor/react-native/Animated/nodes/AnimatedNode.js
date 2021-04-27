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

var _NativeAnimatedHelper = _interopRequireDefault(require("../NativeAnimatedHelper"));

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Note(vjeux): this would be better as an interface but flow doesn't
// support them yet
var AnimatedNode =
/*#__PURE__*/
function () {
  function AnimatedNode() {}

  var _proto = AnimatedNode.prototype;

  _proto.__attach = function __attach() {};

  _proto.__detach = function __detach() {
    if (this.__isNative && this.__nativeTag != null) {
      _NativeAnimatedHelper.default.API.dropAnimatedNode(this.__nativeTag);

      this.__nativeTag = undefined;
    }
  };

  _proto.__getValue = function __getValue() {};

  _proto.__getAnimatedValue = function __getAnimatedValue() {
    return this.__getValue();
  };

  _proto.__addChild = function __addChild(child) {};

  _proto.__removeChild = function __removeChild(child) {};

  _proto.__getChildren = function __getChildren() {
    return [];
  }
  /* Methods and props used by native Animated impl */
  ;

  _proto.__makeNative = function __makeNative() {
    if (!this.__isNative) {
      throw new Error('This node cannot be made a "native" animated node');
    }
  };

  _proto.__getNativeTag = function __getNativeTag() {
    _NativeAnimatedHelper.default.assertNativeAnimatedModule();

    (0, _invariant.default)(this.__isNative, 'Attempt to get native tag from node not marked as "native"');

    if (this.__nativeTag == null) {
      var nativeTag = _NativeAnimatedHelper.default.generateNewNodeTag();

      _NativeAnimatedHelper.default.API.createAnimatedNode(nativeTag, this.__getNativeConfig());

      this.__nativeTag = nativeTag;
    }

    return this.__nativeTag;
  };

  _proto.__getNativeConfig = function __getNativeConfig() {
    throw new Error('This JS animated node type cannot be used as native animated node');
  };

  _proto.toJSON = function toJSON() {
    return this.__getValue();
  };

  return AnimatedNode;
}();

var _default = AnimatedNode;
exports.default = _default;
module.exports = exports.default;