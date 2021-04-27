/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule EventHolder
 * 
 */
'use strict';

exports.__esModule = true;
exports.default = void 0;

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventHolder =
/*#__PURE__*/
function () {
  function EventHolder() {
    this._heldEvents = {};
    this._currentEventKey = null;
  }
  /**
   * Holds a given event for processing later.
   *
   * TODO: Annotate return type better. The structural type of the return here
   *       is pretty obvious.
   *
   * @param {string} eventType - Name of the event to hold and later emit
   * @param {...*} Arbitrary arguments to be passed to each registered listener
   * @return {object} Token that can be used to release the held event
   *
   * @example
   *
   *   holder.holdEvent({someEvent: 'abc'});
   *
   *   holder.emitToHandler({
   *     someEvent: function(data, event) {
   *       console.log(data);
   *     }
   *   }); //logs 'abc'
   *
   */


  var _proto = EventHolder.prototype;

  _proto.holdEvent = function holdEvent(eventType) {
    this._heldEvents[eventType] = this._heldEvents[eventType] || [];
    var eventsOfType = this._heldEvents[eventType];
    var key = {
      eventType: eventType,
      index: eventsOfType.length
    };

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    eventsOfType.push(args);
    return key;
  }
  /**
   * Emits the held events of the specified type to the given listener.
   *
   * @param {?string} eventType - Optional name of the events to replay
   * @param {function} listener - The listener to which to dispatch the event
   * @param {?object} context - Optional context object to use when invoking
   *   the listener
   */
  ;

  _proto.emitToListener = function emitToListener(eventType, listener, context) {
    var _this = this;

    var eventsOfType = this._heldEvents[eventType];

    if (!eventsOfType) {
      return;
    }

    var origEventKey = this._currentEventKey;
    eventsOfType.forEach(function (
    /*?array*/
    eventHeld,
    /*number*/
    index) {
      if (!eventHeld) {
        return;
      }

      _this._currentEventKey = {
        eventType: eventType,
        index: index
      };
      listener.apply(context, eventHeld);
    });
    this._currentEventKey = origEventKey;
  }
  /**
   * Provides an API that can be called during an eventing cycle to release
   * the last event that was invoked, so that it is no longer "held".
   *
   * If it is called when not inside of an emitting cycle it will throw.
   *
   * @throws {Error} When called not during an eventing cycle
   */
  ;

  _proto.releaseCurrentEvent = function releaseCurrentEvent() {
    (0, _invariant.default)(this._currentEventKey !== null, 'Not in an emitting cycle; there is no current event');
    this._currentEventKey && this.releaseEvent(this._currentEventKey);
  }
  /**
   * Releases the event corresponding to the handle that was returned when the
   * event was first held.
   *
   * @param {object} token - The token returned from holdEvent
   */
  ;

  _proto.releaseEvent = function releaseEvent(token) {
    delete this._heldEvents[token.eventType][token.index];
  }
  /**
   * Releases all events of a certain type.
   *
   * @param {string} type
   */
  ;

  _proto.releaseEventType = function releaseEventType(type) {
    this._heldEvents[type] = [];
  };

  return EventHolder;
}();

var _default = EventHolder;
exports.default = _default;
module.exports = exports.default;