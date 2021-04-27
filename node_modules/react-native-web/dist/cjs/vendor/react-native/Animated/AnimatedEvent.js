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
exports.attachNativeEvent = attachNativeEvent;
exports.default = exports.AnimatedEvent = void 0;

var _AnimatedValue = _interopRequireDefault(require("./nodes/AnimatedValue"));

var _NativeAnimatedHelper = _interopRequireDefault(require("./NativeAnimatedHelper"));

var _findNodeHandle = _interopRequireDefault(require("../../../exports/findNodeHandle"));

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var shouldUseNativeDriver = _NativeAnimatedHelper.default.shouldUseNativeDriver;

function attachNativeEvent(viewRef, eventName, argMapping) {
  // Find animated values in `argMapping` and create an array representing their
  // key path inside the `nativeEvent` object. Ex.: ['contentOffset', 'x'].
  var eventMappings = [];

  var traverse = function traverse(value, path) {
    if (value instanceof _AnimatedValue.default) {
      value.__makeNative();

      eventMappings.push({
        nativeEventPath: path,
        animatedValueTag: value.__getNativeTag()
      });
    } else if (typeof value === 'object') {
      for (var _key in value) {
        traverse(value[_key], path.concat(_key));
      }
    }
  };

  (0, _invariant.default)(argMapping[0] && argMapping[0].nativeEvent, 'Native driven events only support animated values contained inside `nativeEvent`.'); // Assume that the event containing `nativeEvent` is always the first argument.

  traverse(argMapping[0].nativeEvent, []);
  var viewTag = (0, _findNodeHandle.default)(viewRef);
  eventMappings.forEach(function (mapping) {
    _NativeAnimatedHelper.default.API.addAnimatedEventToView(viewTag, eventName, mapping);
  });
  return {
    detach: function detach() {
      eventMappings.forEach(function (mapping) {
        _NativeAnimatedHelper.default.API.removeAnimatedEventFromView(viewTag, eventName, mapping.animatedValueTag);
      });
    }
  };
}

var AnimatedEvent =
/*#__PURE__*/
function () {
  function AnimatedEvent(argMapping, config) {
    if (config === void 0) {
      config = {};
    }

    this._listeners = [];
    this._argMapping = argMapping;

    if (config.listener) {
      this.__addListener(config.listener);
    }

    this._callListeners = this._callListeners.bind(this);
    this._attachedEvent = null;
    this.__isNative = shouldUseNativeDriver(config);

    if (process.env.NODE_ENV !== 'production') {
      this._validateMapping();
    }
  }

  var _proto = AnimatedEvent.prototype;

  _proto.__addListener = function __addListener(callback) {
    this._listeners.push(callback);
  };

  _proto.__removeListener = function __removeListener(callback) {
    this._listeners = this._listeners.filter(function (listener) {
      return listener !== callback;
    });
  };

  _proto.__attach = function __attach(viewRef, eventName) {
    (0, _invariant.default)(this.__isNative, 'Only native driven events need to be attached.');
    this._attachedEvent = attachNativeEvent(viewRef, eventName, this._argMapping);
  };

  _proto.__detach = function __detach(viewTag, eventName) {
    (0, _invariant.default)(this.__isNative, 'Only native driven events need to be detached.');
    this._attachedEvent && this._attachedEvent.detach();
  };

  _proto.__getHandler = function __getHandler() {
    var _this = this;

    if (this.__isNative) {
      return this._callListeners;
    }

    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key2 = 0; _key2 < _len; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var traverse = function traverse(recMapping, recEvt, key) {
        if (typeof recEvt === 'number' && recMapping instanceof _AnimatedValue.default) {
          recMapping.setValue(recEvt);
        } else if (typeof recMapping === 'object') {
          for (var mappingKey in recMapping) {
            /* $FlowFixMe(>=0.53.0 site=react_native_fb,react_native_oss) This
             * comment suppresses an error when upgrading Flow's support for
             * React. To see the error delete this comment and run Flow. */
            traverse(recMapping[mappingKey], recEvt[mappingKey], mappingKey);
          }
        }
      };

      if (!_this.__isNative) {
        _this._argMapping.forEach(function (mapping, idx) {
          traverse(mapping, args[idx], 'arg' + idx);
        });
      }

      _this._callListeners.apply(_this, args);
    };
  };

  _proto._callListeners = function _callListeners() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
      args[_key3] = arguments[_key3];
    }

    this._listeners.forEach(function (listener) {
      return listener.apply(void 0, args);
    });
  };

  _proto._validateMapping = function _validateMapping() {
    var traverse = function traverse(recMapping, recEvt, key) {
      if (typeof recEvt === 'number') {
        (0, _invariant.default)(recMapping instanceof _AnimatedValue.default, 'Bad mapping of type ' + typeof recMapping + ' for key ' + key + ', event value must map to AnimatedValue');
        return;
      }

      (0, _invariant.default)(typeof recMapping === 'object', 'Bad mapping of type ' + typeof recMapping + ' for key ' + key);
      (0, _invariant.default)(typeof recEvt === 'object', 'Bad event of type ' + typeof recEvt + ' for key ' + key);

      for (var mappingKey in recMapping) {
        traverse(recMapping[mappingKey], recEvt[mappingKey], mappingKey);
      }
    };
  };

  return AnimatedEvent;
}();

exports.AnimatedEvent = AnimatedEvent;
var _default = {
  AnimatedEvent: AnimatedEvent,
  attachNativeEvent: attachNativeEvent
};
exports.default = _default;