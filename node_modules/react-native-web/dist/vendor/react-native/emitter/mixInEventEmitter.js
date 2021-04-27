/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule mixInEventEmitter
 * 
 */
'use strict';

import EventEmitter from './EventEmitter';
import EventEmitterWithHolding from './EventEmitterWithHolding';
import EventHolder from './EventHolder';
import EventValidator from './EventValidator';
import invariant from 'fbjs/lib/invariant';
/* $FlowFixMe(>=0.54.0 site=react_native_oss) This comment suppresses an error
 * found when Flow v0.54 was deployed. To see the error delete this comment and
 * run Flow. */

import keyOf from 'fbjs/lib/keyOf';

var __DEV__ = process.env.NODE_ENV !== 'production';

var TYPES_KEY = keyOf({
  __types: true
});
/**
 * API to setup an object or constructor to be able to emit data events.
 *
 * @example
 * function Dog() { ...dog stuff... }
 * mixInEventEmitter(Dog, {bark: true});
 *
 * var puppy = new Dog();
 * puppy.addListener('bark', function (volume) {
 *   console.log('Puppy', this, 'barked at volume:', volume);
 * });
 * puppy.emit('bark', 'quiet');
 * // Puppy <puppy> barked at volume: quiet
 *
 *
 * // A "singleton" object may also be commissioned:
 *
 * var Singleton = {};
 * mixInEventEmitter(Singleton, {lonely: true});
 * Singleton.emit('lonely', true);
 */

function mixInEventEmitter(cls, types) {
  invariant(types, 'Must supply set of valid event types'); // If this is a constructor, write to the prototype, otherwise write to the
  // singleton object.

  var target = cls.prototype || cls;
  invariant(!target.__eventEmitter, 'An active emitter is already mixed in');
  var ctor = cls.constructor;

  if (ctor) {
    invariant(ctor === Object || ctor === Function, 'Mix EventEmitter into a class, not an instance');
  } // Keep track of the provided types, union the types if they already exist,
  // which allows for prototype subclasses to provide more types.


  if (target.hasOwnProperty(TYPES_KEY)) {
    Object.assign(target.__types, types);
  } else if (target.__types) {
    target.__types = Object.assign({}, target.__types, types);
  } else {
    target.__types = types;
  }

  Object.assign(target, EventEmitterMixin);
}

var EventEmitterMixin = {
  emit: function emit(eventType, a, b, c, d, e, _) {
    return this.__getEventEmitter().emit(eventType, a, b, c, d, e, _);
  },
  emitAndHold: function emitAndHold(eventType, a, b, c, d, e, _) {
    return this.__getEventEmitter().emitAndHold(eventType, a, b, c, d, e, _);
  },
  addListener: function addListener(eventType, listener, context) {
    return this.__getEventEmitter().addListener(eventType, listener, context);
  },
  once: function once(eventType, listener, context) {
    return this.__getEventEmitter().once(eventType, listener, context);
  },
  addRetroactiveListener: function addRetroactiveListener(eventType, listener, context) {
    return this.__getEventEmitter().addRetroactiveListener(eventType, listener, context);
  },
  addListenerMap: function addListenerMap(listenerMap, context) {
    return this.__getEventEmitter().addListenerMap(listenerMap, context);
  },
  addRetroactiveListenerMap: function addRetroactiveListenerMap(listenerMap, context) {
    return this.__getEventEmitter().addListenerMap(listenerMap, context);
  },
  removeAllListeners: function removeAllListeners() {
    this.__getEventEmitter().removeAllListeners();
  },
  removeCurrentListener: function removeCurrentListener() {
    this.__getEventEmitter().removeCurrentListener();
  },
  releaseHeldEventType: function releaseHeldEventType(eventType) {
    this.__getEventEmitter().releaseHeldEventType(eventType);
  },
  __getEventEmitter: function __getEventEmitter() {
    if (!this.__eventEmitter) {
      var emitter = new EventEmitter();

      if (__DEV__) {
        emitter = EventValidator.addValidation(emitter, this.__types);
      }

      var holder = new EventHolder();
      this.__eventEmitter = new EventEmitterWithHolding(emitter, holder);
    }

    return this.__eventEmitter;
  }
};
export default mixInEventEmitter;