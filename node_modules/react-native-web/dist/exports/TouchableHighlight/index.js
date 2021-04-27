function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import applyNativeMethods from '../../modules/applyNativeMethods';
import ColorPropType from '../ColorPropType';
import createReactClass from 'create-react-class';
import ensureComponentIsNative from '../../modules/ensureComponentIsNative';
import ensurePositiveDelayProps from '../Touchable/ensurePositiveDelayProps';
import React from 'react';
import StyleSheet from '../StyleSheet';
import TimerMixin from 'react-timer-mixin';
import Touchable from '../Touchable';
import TouchableWithoutFeedback from '../TouchableWithoutFeedback';
import View from '../View';
import ViewPropTypes from '../ViewPropTypes';
import { func, number } from 'prop-types';
var DEFAULT_PROPS = {
  activeOpacity: 0.85,
  underlayColor: 'black'
};
var PRESS_RETENTION_OFFSET = {
  top: 20,
  left: 20,
  right: 20,
  bottom: 30
};
/**
 * A wrapper for making views respond properly to touches.
 * On press down, the opacity of the wrapped view is decreased, which allows
 * the underlay color to show through, darkening or tinting the view.
 *
 * The underlay comes from wrapping the child in a new View, which can affect
 * layout, and sometimes cause unwanted visual artifacts if not used correctly,
 * for example if the backgroundColor of the wrapped view isn't explicitly set
 * to an opaque color.
 *
 * TouchableHighlight must have one child (not zero or more than one).
 * If you wish to have several child components, wrap them in a View.
 *
 * Example:
 *
 * ```
 * renderButton: function() {
 *   return (
 *     <TouchableHighlight onPress={this._onPressButton}>
 *       <Image
 *         style={styles.button}
 *         source={require('./myButton.png')}
 *       />
 *     </TouchableHighlight>
 *   );
 * },
 * ```
 */

/* eslint-disable react/prefer-es6-class */

var TouchableHighlight = createReactClass({
  displayName: 'TouchableHighlight',
  propTypes: _objectSpread({}, TouchableWithoutFeedback.propTypes, {
    /**
     * Determines what the opacity of the wrapped view should be when touch is
     * active.
     */
    activeOpacity: number,

    /**
     * Called immediately after the underlay is hidden
     */
    onHideUnderlay: func,

    /**
     * Called immediately after the underlay is shown
     */
    onShowUnderlay: func,
    style: ViewPropTypes.style,

    /**
     * The color of the underlay that will show through when the touch is
     * active.
     */
    underlayColor: ColorPropType
  }),
  mixins: [TimerMixin, Touchable.Mixin],
  getDefaultProps: function getDefaultProps() {
    return DEFAULT_PROPS;
  },
  // Performance optimization to avoid constantly re-generating these objects.
  _computeSyntheticState: function _computeSyntheticState(props) {
    return {
      activeProps: {
        style: {
          opacity: props.activeOpacity
        }
      },
      activeUnderlayProps: {
        style: {
          backgroundColor: props.underlayColor
        }
      },
      underlayStyle: [INACTIVE_UNDERLAY_PROPS.style, props.style]
    };
  },
  getInitialState: function getInitialState() {
    this._isMounted = false;
    return _objectSpread({}, this.touchableGetInitialState(), this._computeSyntheticState(this.props));
  },
  componentDidMount: function componentDidMount() {
    this._isMounted = true;
    ensurePositiveDelayProps(this.props);
    ensureComponentIsNative(this._childRef);
  },
  componentWillUnmount: function componentWillUnmount() {
    this._isMounted = false;
  },
  componentDidUpdate: function componentDidUpdate() {
    ensureComponentIsNative(this._childRef);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    ensurePositiveDelayProps(nextProps);

    if (nextProps.activeOpacity !== this.props.activeOpacity || nextProps.underlayColor !== this.props.underlayColor || nextProps.style !== this.props.style) {
      this.setState(this._computeSyntheticState(nextProps));
    }
  },

  /**
   * `Touchable.Mixin` self callbacks. The mixin will invoke these if they are
   * defined on your component.
   */
  touchableHandleActivePressIn: function touchableHandleActivePressIn(e) {
    this.clearTimeout(this._hideTimeout);
    this._hideTimeout = null;

    this._showUnderlay();

    this.props.onPressIn && this.props.onPressIn(e);
  },
  touchableHandleActivePressOut: function touchableHandleActivePressOut(e) {
    if (!this._hideTimeout) {
      this._hideUnderlay();
    }

    this.props.onPressOut && this.props.onPressOut(e);
  },
  touchableHandlePress: function touchableHandlePress(e) {
    this.clearTimeout(this._hideTimeout);

    this._showUnderlay();

    this._hideTimeout = this.setTimeout(this._hideUnderlay, this.props.delayPressOut || 100);
    this.props.onPress && this.props.onPress(e);
  },
  touchableHandleLongPress: function touchableHandleLongPress(e) {
    this.props.onLongPress && this.props.onLongPress(e);
  },
  touchableGetPressRectOffset: function touchableGetPressRectOffset() {
    return this.props.pressRetentionOffset || PRESS_RETENTION_OFFSET;
  },
  touchableGetHitSlop: function touchableGetHitSlop() {
    return this.props.hitSlop;
  },
  touchableGetHighlightDelayMS: function touchableGetHighlightDelayMS() {
    return this.props.delayPressIn;
  },
  touchableGetLongPressDelayMS: function touchableGetLongPressDelayMS() {
    return this.props.delayLongPress;
  },
  touchableGetPressOutDelayMS: function touchableGetPressOutDelayMS() {
    return this.props.delayPressOut;
  },
  _showUnderlay: function _showUnderlay() {
    if (!this._isMounted || !this._hasPressHandler()) {
      return;
    }

    this._underlayRef.setNativeProps(this.state.activeUnderlayProps);

    this._childRef.setNativeProps(this.state.activeProps);

    this.props.onShowUnderlay && this.props.onShowUnderlay();
  },
  _hideUnderlay: function _hideUnderlay() {
    this.clearTimeout(this._hideTimeout);
    this._hideTimeout = null;

    if (this._hasPressHandler() && this._underlayRef) {
      this._childRef.setNativeProps(INACTIVE_CHILD_PROPS);

      this._underlayRef.setNativeProps(_objectSpread({}, INACTIVE_UNDERLAY_PROPS, {
        style: this.state.underlayStyle
      }));

      this.props.onHideUnderlay && this.props.onHideUnderlay();
    }
  },
  _hasPressHandler: function _hasPressHandler() {
    return !!(this.props.onPress || this.props.onPressIn || this.props.onPressOut || this.props.onLongPress);
  },
  _setChildRef: function _setChildRef(node) {
    this._childRef = node;
  },
  _setUnderlayRef: function _setUnderlayRef(node) {
    this._underlayRef = node;
  },
  render: function render() {
    var _this$props = this.props,
        activeOpacity = _this$props.activeOpacity,
        onHideUnderlay = _this$props.onHideUnderlay,
        onShowUnderlay = _this$props.onShowUnderlay,
        underlayColor = _this$props.underlayColor,
        delayLongPress = _this$props.delayLongPress,
        delayPressIn = _this$props.delayPressIn,
        delayPressOut = _this$props.delayPressOut,
        onLongPress = _this$props.onLongPress,
        onPress = _this$props.onPress,
        onPressIn = _this$props.onPressIn,
        onPressOut = _this$props.onPressOut,
        pressRetentionOffset = _this$props.pressRetentionOffset,
        other = _objectWithoutPropertiesLoose(_this$props, ["activeOpacity", "onHideUnderlay", "onShowUnderlay", "underlayColor", "delayLongPress", "delayPressIn", "delayPressOut", "onLongPress", "onPress", "onPressIn", "onPressOut", "pressRetentionOffset"]);

    return React.createElement(View, _extends({}, other, {
      accessible: this.props.accessible !== false,
      onKeyDown: this.touchableHandleKeyEvent,
      onKeyUp: this.touchableHandleKeyEvent,
      onResponderGrant: this.touchableHandleResponderGrant,
      onResponderMove: this.touchableHandleResponderMove,
      onResponderRelease: this.touchableHandleResponderRelease,
      onResponderTerminate: this.touchableHandleResponderTerminate,
      onResponderTerminationRequest: this.touchableHandleResponderTerminationRequest,
      onStartShouldSetResponder: this.touchableHandleStartShouldSetResponder,
      ref: this._setUnderlayRef,
      style: [styles.root, !this.props.disabled && styles.actionable, this.state.underlayStyle]
    }), React.cloneElement(React.Children.only(this.props.children), {
      ref: this._setChildRef
    }), Touchable.renderDebugView({
      color: 'green',
      hitSlop: this.props.hitSlop
    }));
  }
});
var INACTIVE_CHILD_PROPS = {
  style: StyleSheet.create({
    x: {
      opacity: 1.0
    }
  }).x
};
var INACTIVE_UNDERLAY_PROPS = {
  style: StyleSheet.create({
    x: {
      backgroundColor: 'transparent'
    }
  }).x
};
var styles = StyleSheet.create({
  root: {
    userSelect: 'none'
  },
  actionable: {
    cursor: 'pointer',
    touchAction: 'manipulation'
  }
});
export default applyNativeMethods(TouchableHighlight);