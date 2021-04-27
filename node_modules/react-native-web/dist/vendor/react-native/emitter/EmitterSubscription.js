/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule EmitterSubscription
 * 
 */
'use strict';

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

import EventSubscription from './EventSubscription';

/**
 * EmitterSubscription represents a subscription with listener and context data.
 */
var EmitterSubscription =
/*#__PURE__*/
function (_EventSubscription) {
  _inheritsLoose(EmitterSubscription, _EventSubscription);

  /**
   * @param {EventEmitter} emitter - The event emitter that registered this
   *   subscription
   * @param {EventSubscriptionVendor} subscriber - The subscriber that controls
   *   this subscription
   * @param {function} listener - Function to invoke when the specified event is
   *   emitted
   * @param {*} context - Optional context object to use when invoking the
   *   listener
   */
  function EmitterSubscription(emitter, subscriber, listener, context) {
    var _this;

    _this = _EventSubscription.call(this, subscriber) || this;
    _this.emitter = emitter;
    _this.listener = listener;
    _this.context = context;
    return _this;
  }
  /**
   * Removes this subscription from the emitter that registered it.
   * Note: we're overriding the `remove()` method of EventSubscription here
   * but deliberately not calling `super.remove()` as the responsibility
   * for removing the subscription lies with the EventEmitter.
   */


  var _proto = EmitterSubscription.prototype;

  _proto.remove = function remove() {
    this.emitter.removeSubscription(this);
  };

  return EmitterSubscription;
}(EventSubscription);

export default EmitterSubscription;