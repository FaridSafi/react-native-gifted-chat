/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule SwipeableRow
 * 
 */
'use strict';

import Animated from '../../../exports/Animated';
import I18nManager from '../../../exports/I18nManager';
import PanResponder from '../../../exports/PanResponder';
import React from 'react';
import PropTypes from 'prop-types';
import StyleSheet from '../../../exports/StyleSheet';
/* $FlowFixMe(>=0.54.0 site=react_native_oss) This comment suppresses an error
 * found when Flow v0.54 was deployed. To see the error delete this comment and
 * run Flow. */

import TimerMixin from 'react-timer-mixin';
import View from '../../../exports/View';
import createReactClass from 'create-react-class';
import emptyFunction from 'fbjs/lib/emptyFunction';

var isRTL = function isRTL() {
  return I18nManager.isRTL;
}; // NOTE: Eventually convert these consts to an input object of configurations
// Position of the left of the swipable item when closed


var CLOSED_LEFT_POSITION = 0; // Minimum swipe distance before we recognize it as such

var HORIZONTAL_SWIPE_DISTANCE_THRESHOLD = 10; // Minimum swipe speed before we fully animate the user's action (open/close)

var HORIZONTAL_FULL_SWIPE_SPEED_THRESHOLD = 0.3; // Factor to divide by to get slow speed; i.e. 4 means 1/4 of full speed

var SLOW_SPEED_SWIPE_FACTOR = 4; // Time, in milliseconds, of how long the animated swipe should be

var SWIPE_DURATION = 300;
/**
 * On SwipeableListView mount, the 1st item will bounce to show users it's
 * possible to swipe
 */

var ON_MOUNT_BOUNCE_DELAY = 700;
var ON_MOUNT_BOUNCE_DURATION = 400; // Distance left of closed position to bounce back when right-swiping from closed

var RIGHT_SWIPE_BOUNCE_BACK_DISTANCE = 30;
var RIGHT_SWIPE_BOUNCE_BACK_DURATION = 300;
/**
 * Max distance of right swipe to allow (right swipes do functionally nothing).
 * Must be multiplied by SLOW_SPEED_SWIPE_FACTOR because gestureState.dx tracks
 * how far the finger swipes, and not the actual animation distance.
*/

var RIGHT_SWIPE_THRESHOLD = 30 * SLOW_SPEED_SWIPE_FACTOR;
/**
 * Creates a swipable row that allows taps on the main item and a custom View
 * on the item hidden behind the row. Typically this should be used in
 * conjunction with SwipeableListView for additional functionality, but can be
 * used in a normal ListView. See the renderRow for SwipeableListView to see how
 * to use this component separately.
 */

var SwipeableRow = createReactClass({
  displayName: 'SwipeableRow',
  _panResponder: {},
  _previousLeft: CLOSED_LEFT_POSITION,
  mixins: [TimerMixin],
  propTypes: {
    children: PropTypes.any,
    isOpen: PropTypes.bool,
    preventSwipeRight: PropTypes.bool,
    maxSwipeDistance: PropTypes.number.isRequired,
    onOpen: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSwipeEnd: PropTypes.func.isRequired,
    onSwipeStart: PropTypes.func.isRequired,
    // Should bounce the row on mount
    shouldBounceOnMount: PropTypes.bool,

    /**
     * A ReactElement that is unveiled when the user swipes
     */
    slideoutView: PropTypes.node.isRequired,

    /**
     * The minimum swipe distance required before fully animating the swipe. If
     * the user swipes less than this distance, the item will return to its
     * previous (open/close) position.
     */
    swipeThreshold: PropTypes.number.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      currentLeft: new Animated.Value(this._previousLeft),

      /**
       * In order to render component A beneath component B, A must be rendered
       * before B. However, this will cause "flickering", aka we see A briefly
       * then B. To counter this, _isSwipeableViewRendered flag is used to set
       * component A to be transparent until component B is loaded.
       */
      isSwipeableViewRendered: false,
      rowHeight: null
    };
  },
  getDefaultProps: function getDefaultProps() {
    return {
      isOpen: false,
      preventSwipeRight: false,
      maxSwipeDistance: 0,
      onOpen: emptyFunction,
      onClose: emptyFunction,
      onSwipeEnd: emptyFunction,
      onSwipeStart: emptyFunction,
      swipeThreshold: 30
    };
  },
  UNSAFE_componentWillMount: function UNSAFE_componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: this._handleMoveShouldSetPanResponderCapture,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminationRequest: this._onPanResponderTerminationRequest,
      onPanResponderTerminate: this._handlePanResponderEnd,
      onShouldBlockNativeResponder: function onShouldBlockNativeResponder(event, gestureState) {
        return false;
      }
    });
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    if (this.props.shouldBounceOnMount) {
      /**
       * Do the on mount bounce after a delay because if we animate when other
       * components are loading, the animation will be laggy
       */
      this.setTimeout(function () {
        _this._animateBounceBack(ON_MOUNT_BOUNCE_DURATION);
      }, ON_MOUNT_BOUNCE_DELAY);
    }
  },
  UNSAFE_componentWillReceiveProps: function UNSAFE_componentWillReceiveProps(nextProps) {
    /**
     * We do not need an "animateOpen(noCallback)" because this animation is
     * handled internally by this component.
     */
    if (this.props.isOpen && !nextProps.isOpen) {
      this._animateToClosedPosition();
    }
  },
  render: function render() {
    // The view hidden behind the main view
    var slideOutView;

    if (this.state.isSwipeableViewRendered && this.state.rowHeight) {
      slideOutView = React.createElement(View, {
        style: [styles.slideOutContainer, {
          height: this.state.rowHeight
        }]
      }, this.props.slideoutView);
    } // The swipeable item


    var swipeableView = React.createElement(Animated.View, {
      onLayout: this._onSwipeableViewLayout,
      style: {
        transform: [{
          translateX: this.state.currentLeft
        }]
      }
    }, this.props.children);
    return React.createElement(View, this._panResponder.panHandlers, slideOutView, swipeableView);
  },
  close: function close() {
    this.props.onClose();

    this._animateToClosedPosition();
  },
  _onSwipeableViewLayout: function _onSwipeableViewLayout(event) {
    this.setState({
      isSwipeableViewRendered: true,
      rowHeight: event.nativeEvent.layout.height
    });
  },
  _handleMoveShouldSetPanResponderCapture: function _handleMoveShouldSetPanResponderCapture(event, gestureState) {
    // Decides whether a swipe is responded to by this component or its child
    return gestureState.dy < 10 && this._isValidSwipe(gestureState);
  },
  _handlePanResponderGrant: function _handlePanResponderGrant(event, gestureState) {},
  _handlePanResponderMove: function _handlePanResponderMove(event, gestureState) {
    if (this._isSwipingExcessivelyRightFromClosedPosition(gestureState)) {
      return;
    }

    this.props.onSwipeStart();

    if (this._isSwipingRightFromClosed(gestureState)) {
      this._swipeSlowSpeed(gestureState);
    } else {
      this._swipeFullSpeed(gestureState);
    }
  },
  _isSwipingRightFromClosed: function _isSwipingRightFromClosed(gestureState) {
    var gestureStateDx = isRTL() ? -gestureState.dx : gestureState.dx;
    return this._previousLeft === CLOSED_LEFT_POSITION && gestureStateDx > 0;
  },
  _swipeFullSpeed: function _swipeFullSpeed(gestureState) {
    this.state.currentLeft.setValue(this._previousLeft + gestureState.dx);
  },
  _swipeSlowSpeed: function _swipeSlowSpeed(gestureState) {
    this.state.currentLeft.setValue(this._previousLeft + gestureState.dx / SLOW_SPEED_SWIPE_FACTOR);
  },
  _isSwipingExcessivelyRightFromClosedPosition: function _isSwipingExcessivelyRightFromClosedPosition(gestureState) {
    /**
     * We want to allow a BIT of right swipe, to allow users to know that
     * swiping is available, but swiping right does not do anything
     * functionally.
     */
    var gestureStateDx = isRTL() ? -gestureState.dx : gestureState.dx;
    return this._isSwipingRightFromClosed(gestureState) && gestureStateDx > RIGHT_SWIPE_THRESHOLD;
  },
  _onPanResponderTerminationRequest: function _onPanResponderTerminationRequest(event, gestureState) {
    return false;
  },
  _animateTo: function _animateTo(toValue, duration, callback) {
    var _this2 = this;

    if (duration === void 0) {
      duration = SWIPE_DURATION;
    }

    if (callback === void 0) {
      callback = emptyFunction;
    }

    Animated.timing(this.state.currentLeft, {
      duration: duration,
      toValue: toValue,
      useNativeDriver: true
    }).start(function () {
      _this2._previousLeft = toValue;
      callback();
    });
  },
  _animateToOpenPosition: function _animateToOpenPosition() {
    var maxSwipeDistance = isRTL() ? -this.props.maxSwipeDistance : this.props.maxSwipeDistance;

    this._animateTo(-maxSwipeDistance);
  },
  _animateToOpenPositionWith: function _animateToOpenPositionWith(speed, distMoved) {
    /**
     * Ensure the speed is at least the set speed threshold to prevent a slow
     * swiping animation
     */
    speed = speed > HORIZONTAL_FULL_SWIPE_SPEED_THRESHOLD ? speed : HORIZONTAL_FULL_SWIPE_SPEED_THRESHOLD;
    /**
     * Calculate the duration the row should take to swipe the remaining distance
     * at the same speed the user swiped (or the speed threshold)
     */

    var duration = Math.abs((this.props.maxSwipeDistance - Math.abs(distMoved)) / speed);
    var maxSwipeDistance = isRTL() ? -this.props.maxSwipeDistance : this.props.maxSwipeDistance;

    this._animateTo(-maxSwipeDistance, duration);
  },
  _animateToClosedPosition: function _animateToClosedPosition(duration) {
    if (duration === void 0) {
      duration = SWIPE_DURATION;
    }

    this._animateTo(CLOSED_LEFT_POSITION, duration);
  },
  _animateToClosedPositionDuringBounce: function _animateToClosedPositionDuringBounce() {
    this._animateToClosedPosition(RIGHT_SWIPE_BOUNCE_BACK_DURATION);
  },
  _animateBounceBack: function _animateBounceBack(duration) {
    /**
     * When swiping right, we want to bounce back past closed position on release
     * so users know they should swipe right to get content.
     */
    var swipeBounceBackDistance = isRTL() ? -RIGHT_SWIPE_BOUNCE_BACK_DISTANCE : RIGHT_SWIPE_BOUNCE_BACK_DISTANCE;

    this._animateTo(-swipeBounceBackDistance, duration, this._animateToClosedPositionDuringBounce);
  },
  // Ignore swipes due to user's finger moving slightly when tapping
  _isValidSwipe: function _isValidSwipe(gestureState) {
    if (this.props.preventSwipeRight && this._previousLeft === CLOSED_LEFT_POSITION && gestureState.dx > 0) {
      return false;
    }

    return Math.abs(gestureState.dx) > HORIZONTAL_SWIPE_DISTANCE_THRESHOLD;
  },
  _shouldAnimateRemainder: function _shouldAnimateRemainder(gestureState) {
    /**
     * If user has swiped past a certain distance, animate the rest of the way
     * if they let go
     */
    return Math.abs(gestureState.dx) > this.props.swipeThreshold || gestureState.vx > HORIZONTAL_FULL_SWIPE_SPEED_THRESHOLD;
  },
  _handlePanResponderEnd: function _handlePanResponderEnd(event, gestureState) {
    var horizontalDistance = isRTL() ? -gestureState.dx : gestureState.dx;

    if (this._isSwipingRightFromClosed(gestureState)) {
      this.props.onOpen();

      this._animateBounceBack(RIGHT_SWIPE_BOUNCE_BACK_DURATION);
    } else if (this._shouldAnimateRemainder(gestureState)) {
      if (horizontalDistance < 0) {
        // Swiped left
        this.props.onOpen();

        this._animateToOpenPositionWith(gestureState.vx, horizontalDistance);
      } else {
        // Swiped right
        this.props.onClose();

        this._animateToClosedPosition();
      }
    } else {
      if (this._previousLeft === CLOSED_LEFT_POSITION) {
        this._animateToClosedPosition();
      } else {
        this._animateToOpenPosition();
      }
    }

    this.props.onSwipeEnd();
  }
});
var styles = StyleSheet.create({
  slideOutContainer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  }
});
export default SwipeableRow;