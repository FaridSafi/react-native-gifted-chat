"use strict";

exports.__esModule = true;
exports.default = void 0;

var _createReactClass = _interopRequireDefault(require("create-react-class"));

var _EdgeInsetsPropType = _interopRequireDefault(require("../EdgeInsetsPropType"));

var _ensurePositiveDelayProps = _interopRequireDefault(require("../Touchable/ensurePositiveDelayProps"));

var _react = _interopRequireDefault(require("react"));

var _StyleSheet = _interopRequireDefault(require("../StyleSheet"));

var _reactTimerMixin = _interopRequireDefault(require("react-timer-mixin"));

var _Touchable = _interopRequireDefault(require("../Touchable"));

var _ViewPropTypes = _interopRequireDefault(require("../ViewPropTypes"));

var _warning = _interopRequireDefault(require("fbjs/lib/warning"));

var _propTypes = require("prop-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var PRESS_RETENTION_OFFSET = {
  top: 20,
  left: 20,
  right: 20,
  bottom: 30
};
/**
 * Do not use unless you have a very good reason. All elements that
 * respond to press should have a visual feedback when touched.
 *
 * TouchableWithoutFeedback supports only one child.
 * If you wish to have several child components, wrap them in a View.
 */

/* eslint-disable react/prefer-es6-class, react/prop-types */

var TouchableWithoutFeedback = (0, _createReactClass.default)({
  displayName: 'TouchableWithoutFeedback',
  mixins: [_reactTimerMixin.default, _Touchable.default.Mixin],
  propTypes: {
    accessibilityComponentType: _ViewPropTypes.default.accessibilityComponentType,
    accessibilityLabel: _propTypes.string,
    accessibilityRole: _ViewPropTypes.default.accessibilityRole,
    accessibilityTraits: _ViewPropTypes.default.accessibilityTraits,
    accessible: _propTypes.bool,
    children: _propTypes.any,

    /**
     * Delay in ms, from onPressIn, before onLongPress is called.
     */
    delayLongPress: _propTypes.number,

    /**
     * Delay in ms, from the start of the touch, before onPressIn is called.
     */
    delayPressIn: _propTypes.number,

    /**
     * Delay in ms, from the release of the touch, before onPressOut is called.
     */
    delayPressOut: _propTypes.number,

    /**
     * If true, disable all interactions for this component.
     */
    disabled: _propTypes.bool,

    /**
     * This defines how far your touch can start away from the button. This is
     * added to `pressRetentionOffset` when moving off of the button.
     */
    // $FlowFixMe(>=0.41.0)
    hitSlop: _EdgeInsetsPropType.default,

    /**
     * Invoked on mount and layout changes with
     *
     *   `{nativeEvent: {layout: {x, y, width, height}}}`
     */
    onLayout: _propTypes.func,
    onLongPress: _propTypes.func,

    /**
     * Called when the touch is released, but not if cancelled (e.g. by a scroll
     * that steals the responder lock).
     */
    onPress: _propTypes.func,
    onPressIn: _propTypes.func,
    onPressOut: _propTypes.func,

    /**
     * When the scroll view is disabled, this defines how far your touch may
     * move off of the button, before deactivating the button. Once deactivated,
     * try moving it back and you'll see that the button is once again
     * reactivated! Move it back and forth several times while the scroll view
     * is disabled. Ensure you pass in a constant to reduce memory allocations.
     */
    // $FlowFixMe
    pressRetentionOffset: _EdgeInsetsPropType.default,
    testID: _propTypes.string
  },
  getInitialState: function getInitialState() {
    return this.touchableGetInitialState();
  },
  componentDidMount: function componentDidMount() {
    (0, _ensurePositiveDelayProps.default)(this.props);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    (0, _ensurePositiveDelayProps.default)(nextProps);
  },

  /**
   * `Touchable.Mixin` self callbacks. The mixin will invoke these if they are
   * defined on your component.
   */
  touchableHandlePress: function touchableHandlePress(e) {
    this.props.onPress && this.props.onPress(e);
  },
  touchableHandleActivePressIn: function touchableHandleActivePressIn(e) {
    this.props.onPressIn && this.props.onPressIn(e);
  },
  touchableHandleActivePressOut: function touchableHandleActivePressOut(e) {
    this.props.onPressOut && this.props.onPressOut(e);
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
    return this.props.delayPressIn || 0;
  },
  touchableGetLongPressDelayMS: function touchableGetLongPressDelayMS() {
    return this.props.delayLongPress === 0 ? 0 : this.props.delayLongPress || 500;
  },
  touchableGetPressOutDelayMS: function touchableGetPressOutDelayMS() {
    return this.props.delayPressOut || 0;
  },
  render: function render() {
    var _this$props = this.props,
        delayLongPress = _this$props.delayLongPress,
        delayPressIn = _this$props.delayPressIn,
        delayPressOut = _this$props.delayPressOut,
        onLongPress = _this$props.onLongPress,
        onPress = _this$props.onPress,
        onPressIn = _this$props.onPressIn,
        onPressOut = _this$props.onPressOut,
        pressRetentionOffset = _this$props.pressRetentionOffset,
        other = _objectWithoutPropertiesLoose(_this$props, ["delayLongPress", "delayPressIn", "delayPressOut", "onLongPress", "onPress", "onPressIn", "onPressOut", "pressRetentionOffset"]); // Note(avik): remove dynamic typecast once Flow has been upgraded
    // $FlowFixMe


    var child = _react.default.Children.only(this.props.children);

    var children = child.props.children;
    (0, _warning.default)(!child.type || child.type.displayName !== 'Text', 'TouchableWithoutFeedback does not work well with Text children. Wrap children in a View instead. See ' + (child._owner && child._owner.getName && child._owner.getName() || '<unknown>'));

    if (process.env.NODE_ENV !== 'production' && _Touchable.default.TOUCH_TARGET_DEBUG && child.type && child.type.displayName === 'View') {
      children = _react.default.Children.toArray(children);
      children.push(_Touchable.default.renderDebugView({
        color: 'red',
        hitSlop: this.props.hitSlop
      }));
    }

    var style = _Touchable.default.TOUCH_TARGET_DEBUG && child.type && child.type.displayName === 'Text' ? [!this.props.disabled && styles.actionable, child.props.style, {
      color: 'red'
    }] : [!this.props.disabled && styles.actionable, child.props.style];
    return _react.default.cloneElement(child, _objectSpread({}, other, {
      accessible: this.props.accessible !== false,
      children: children,
      onKeyDown: this.touchableHandleKeyEvent,
      onKeyUp: this.touchableHandleKeyEvent,
      onResponderGrant: this.touchableHandleResponderGrant,
      onResponderMove: this.touchableHandleResponderMove,
      onResponderRelease: this.touchableHandleResponderRelease,
      onResponderTerminate: this.touchableHandleResponderTerminate,
      onResponderTerminationRequest: this.touchableHandleResponderTerminationRequest,
      onStartShouldSetResponder: this.touchableHandleStartShouldSetResponder,
      style: style
    }));
  }
});

var styles = _StyleSheet.default.create({
  actionable: {
    cursor: 'pointer',
    touchAction: 'manipulation'
  }
});

var _default = TouchableWithoutFeedback;
exports.default = _default;
module.exports = exports.default;