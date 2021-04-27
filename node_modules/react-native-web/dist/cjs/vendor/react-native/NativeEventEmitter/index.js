/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule NativeEventEmitter
 * 
 */
'use strict';

exports.__esModule = true;
exports.default = void 0;

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

var _EventEmitter2 = _interopRequireDefault(require("../emitter/EventEmitter"));

var _RCTDeviceEventEmitter = _interopRequireDefault(require("./RCTDeviceEventEmitter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * Abstract base class for implementing event-emitting modules. This implements
 * a subset of the standard EventEmitter node module API.
 */
var NativeEventEmitter =
/*#__PURE__*/
function (_EventEmitter) {
  _inheritsLoose(NativeEventEmitter, _EventEmitter);

  function NativeEventEmitter(nativeModule) {
    return _EventEmitter.call(this, _RCTDeviceEventEmitter.default.sharedSubscriber) || this;
  }

  var _proto = NativeEventEmitter.prototype;

  _proto.addListener = function addListener(eventType, listener, context) {
    if (this._nativeModule != null) {
      this._nativeModule.addListener(eventType);
    }

    return _EventEmitter.prototype.addListener.call(this, eventType, listener, context);
  };

  _proto.removeAllListeners = function removeAllListeners(eventType) {
    (0, _invariant.default)(eventType, 'eventType argument is required.');
    var count = this.listeners(eventType).length;

    if (this._nativeModule != null) {
      this._nativeModule.removeListeners(count);
    }

    _EventEmitter.prototype.removeAllListeners.call(this, eventType);
  };

  _proto.removeSubscription = function removeSubscription(subscription) {
    if (this._nativeModule != null) {
      this._nativeModule.removeListeners(1);
    }

    _EventEmitter.prototype.removeSubscription.call(this, subscription);
  };

  return NativeEventEmitter;
}(_EventEmitter2.default);

var _default = NativeEventEmitter;
exports.default = _default;
module.exports = exports.default;