/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule EventEmitterWithHolding
 * 
 */
'use strict';

exports.__esModule = true;
exports.default = void 0;

/**
 * @class EventEmitterWithHolding
 * @description
 * An EventEmitterWithHolding decorates an event emitter and enables one to
 * "hold" or cache events and then have a handler register later to actually
 * handle them.
 *
 * This is separated into its own decorator so that only those who want to use
 * the holding functionality have to and others can just use an emitter. Since
 * it implements the emitter interface it can also be combined with anything
 * that uses an emitter.
 */
var EventEmitterWithHolding =
/*#__PURE__*/
function () {
  /**
   * @constructor
   * @param {object} emitter - The object responsible for emitting the actual
   *   events.
   * @param {object} holder - The event holder that is responsible for holding
   *   and then emitting held events.
   */
  function EventEmitterWithHolding(emitter, holder) {
    this._emitter = emitter;
    this._eventHolder = holder;
    this._currentEventToken = null;
    this._emittingHeldEvents = false;
  }
  /**
   * @see EventEmitter#addListener
   */


  var _proto = EventEmitterWithHolding.prototype;

  _proto.addListener = function addListener(eventType, listener, context) {
    return this._emitter.addListener(eventType, listener, context);
  }
  /**
   * @see EventEmitter#once
   */
  ;

  _proto.once = function once(eventType, listener, context) {
    return this._emitter.once(eventType, listener, context);
  }
  /**
   * Adds a listener to be invoked when events of the specified type are
   * emitted. An optional calling context may be provided. The data arguments
   * emitted will be passed to the listener function. In addition to subscribing
   * to all subsequent events, this method will also handle any events that have
   * already been emitted, held, and not released.
   *
   * @param {string} eventType - Name of the event to listen to
   * @param {function} listener - Function to invoke when the specified event is
   *   emitted
   * @param {*} context - Optional context object to use when invoking the
   *   listener
   *
   * @example
   *   emitter.emitAndHold('someEvent', 'abc');
   *
   *   emitter.addRetroactiveListener('someEvent', function(message) {
   *     console.log(message);
   *   }); // logs 'abc'
   */
  ;

  _proto.addRetroactiveListener = function addRetroactiveListener(eventType, listener, context) {
    var subscription = this._emitter.addListener(eventType, listener, context);

    this._emittingHeldEvents = true;

    this._eventHolder.emitToListener(eventType, listener, context);

    this._emittingHeldEvents = false;
    return subscription;
  }
  /**
   * @see EventEmitter#removeAllListeners
   */
  ;

  _proto.removeAllListeners = function removeAllListeners(eventType) {
    this._emitter.removeAllListeners(eventType);
  }
  /**
   * @see EventEmitter#removeCurrentListener
   */
  ;

  _proto.removeCurrentListener = function removeCurrentListener() {
    this._emitter.removeCurrentListener();
  }
  /**
   * @see EventEmitter#listeners
   */
  ;

  _proto.listeners = function listeners(eventType)
  /* TODO: Annotate return type here */
  {
    return this._emitter.listeners(eventType);
  }
  /**
   * @see EventEmitter#emit
   */
  ;

  _proto.emit = function emit(eventType) {
    var _this$_emitter;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    (_this$_emitter = this._emitter).emit.apply(_this$_emitter, [eventType].concat(args));
  }
  /**
   * Emits an event of the given type with the given data, and holds that event
   * in order to be able to dispatch it to a later subscriber when they say they
   * want to handle held events.
   *
   * @param {string} eventType - Name of the event to emit
   * @param {...*} Arbitrary arguments to be passed to each registered listener
   *
   * @example
   *   emitter.emitAndHold('someEvent', 'abc');
   *
   *   emitter.addRetroactiveListener('someEvent', function(message) {
   *     console.log(message);
   *   }); // logs 'abc'
   */
  ;

  _proto.emitAndHold = function emitAndHold(eventType) {
    var _this$_eventHolder, _this$_emitter2;

    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    this._currentEventToken = (_this$_eventHolder = this._eventHolder).holdEvent.apply(_this$_eventHolder, [eventType].concat(args));

    (_this$_emitter2 = this._emitter).emit.apply(_this$_emitter2, [eventType].concat(args));

    this._currentEventToken = null;
  }
  /**
   * @see EventHolder#releaseCurrentEvent
   */
  ;

  _proto.releaseCurrentEvent = function releaseCurrentEvent() {
    if (this._currentEventToken) {
      this._eventHolder.releaseEvent(this._currentEventToken);
    } else if (this._emittingHeldEvents) {
      this._eventHolder.releaseCurrentEvent();
    }
  }
  /**
   * @see EventHolder#releaseEventType
   * @param {string} eventType
   */
  ;

  _proto.releaseHeldEventType = function releaseHeldEventType(eventType) {
    this._eventHolder.releaseEventType(eventType);
  };

  return EventEmitterWithHolding;
}();

var _default = EventEmitterWithHolding;
exports.default = _default;
module.exports = exports.default;