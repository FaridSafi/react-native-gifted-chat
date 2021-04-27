/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule EventSubscription
 * 
 */
'use strict';

/**
 * EventSubscription represents a subscription to a particular event. It can
 * remove its own subscription.
 */
var EventSubscription =
/*#__PURE__*/
function () {
  /**
   * @param {EventSubscriptionVendor} subscriber the subscriber that controls
   *   this subscription.
   */
  function EventSubscription(subscriber) {
    this.subscriber = subscriber;
  }
  /**
   * Removes this subscription from the subscriber that controls it.
   */


  var _proto = EventSubscription.prototype;

  _proto.remove = function remove() {
    this.subscriber.removeSubscription(this);
  };

  return EventSubscription;
}();

export default EventSubscription;