"use strict";

exports.__esModule = true;
exports.default = void 0;

var _debounce = _interopRequireDefault(require("debounce"));

var _StyleSheet = _interopRequireDefault(require("../StyleSheet"));

var _View = _interopRequireDefault(require("../View"));

var _ViewPropTypes = _interopRequireDefault(require("../ViewPropTypes"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = require("prop-types");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var normalizeScrollEvent = function normalizeScrollEvent(e) {
  return {
    nativeEvent: {
      contentOffset: {
        get x() {
          return e.target.scrollLeft;
        },

        get y() {
          return e.target.scrollTop;
        }

      },
      contentSize: {
        get height() {
          return e.target.scrollHeight;
        },

        get width() {
          return e.target.scrollWidth;
        }

      },
      layoutMeasurement: {
        get height() {
          return e.target.offsetHeight;
        },

        get width() {
          return e.target.offsetWidth;
        }

      }
    },
    timeStamp: Date.now()
  };
};
/**
 * Encapsulates the Web-specific scroll throttling and disabling logic
 */


var ScrollViewBase =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(ScrollViewBase, _Component);

  function ScrollViewBase() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this._debouncedOnScrollEnd = (0, _debounce.default)(_this._handleScrollEnd, 100);
    _this._state = {
      isScrolling: false,
      scrollLastTick: 0
    };

    _this._createPreventableScrollHandler = function (handler) {
      return function (e) {
        if (_this.props.scrollEnabled) {
          if (handler) {
            handler(e);
          }
        } else {
          // To disable scrolling in all browsers except Chrome
          e.preventDefault();
        }
      };
    };

    _this._handleScroll = function (e) {
      e.persist();
      e.stopPropagation();
      var scrollEventThrottle = _this.props.scrollEventThrottle; // A scroll happened, so the scroll bumps the debounce.

      _this._debouncedOnScrollEnd(e);

      if (_this._state.isScrolling) {
        // Scroll last tick may have changed, check if we need to notify
        if (_this._shouldEmitScrollEvent(_this._state.scrollLastTick, scrollEventThrottle)) {
          _this._handleScrollTick(e);
        }
      } else {
        // Weren't scrolling, so we must have just started
        _this._handleScrollStart(e);
      }
    };

    _this._setViewRef = function (element) {
      _this._viewRef = element;
    };

    return _this;
  }

  var _proto = ScrollViewBase.prototype;

  _proto.setNativeProps = function setNativeProps(props) {
    if (this._viewRef) {
      this._viewRef.setNativeProps(props);
    }
  };

  _proto.render = function render() {
    var _this$props = this.props,
        scrollEnabled = _this$props.scrollEnabled,
        style = _this$props.style,
        alwaysBounceHorizontal = _this$props.alwaysBounceHorizontal,
        alwaysBounceVertical = _this$props.alwaysBounceVertical,
        automaticallyAdjustContentInsets = _this$props.automaticallyAdjustContentInsets,
        bounces = _this$props.bounces,
        bouncesZoom = _this$props.bouncesZoom,
        canCancelContentTouches = _this$props.canCancelContentTouches,
        centerContent = _this$props.centerContent,
        contentInset = _this$props.contentInset,
        contentInsetAdjustmentBehavior = _this$props.contentInsetAdjustmentBehavior,
        contentOffset = _this$props.contentOffset,
        decelerationRate = _this$props.decelerationRate,
        directionalLockEnabled = _this$props.directionalLockEnabled,
        endFillColor = _this$props.endFillColor,
        indicatorStyle = _this$props.indicatorStyle,
        keyboardShouldPersistTaps = _this$props.keyboardShouldPersistTaps,
        maximumZoomScale = _this$props.maximumZoomScale,
        minimumZoomScale = _this$props.minimumZoomScale,
        onMomentumScrollBegin = _this$props.onMomentumScrollBegin,
        onMomentumScrollEnd = _this$props.onMomentumScrollEnd,
        onScrollBeginDrag = _this$props.onScrollBeginDrag,
        onScrollEndDrag = _this$props.onScrollEndDrag,
        overScrollMode = _this$props.overScrollMode,
        pinchGestureEnabled = _this$props.pinchGestureEnabled,
        removeClippedSubviews = _this$props.removeClippedSubviews,
        scrollEventThrottle = _this$props.scrollEventThrottle,
        scrollIndicatorInsets = _this$props.scrollIndicatorInsets,
        scrollPerfTag = _this$props.scrollPerfTag,
        scrollsToTop = _this$props.scrollsToTop,
        showsHorizontalScrollIndicator = _this$props.showsHorizontalScrollIndicator,
        showsVerticalScrollIndicator = _this$props.showsVerticalScrollIndicator,
        snapToInterval = _this$props.snapToInterval,
        snapToAlignment = _this$props.snapToAlignment,
        zoomScale = _this$props.zoomScale,
        other = _objectWithoutPropertiesLoose(_this$props, ["scrollEnabled", "style", "alwaysBounceHorizontal", "alwaysBounceVertical", "automaticallyAdjustContentInsets", "bounces", "bouncesZoom", "canCancelContentTouches", "centerContent", "contentInset", "contentInsetAdjustmentBehavior", "contentOffset", "decelerationRate", "directionalLockEnabled", "endFillColor", "indicatorStyle", "keyboardShouldPersistTaps", "maximumZoomScale", "minimumZoomScale", "onMomentumScrollBegin", "onMomentumScrollEnd", "onScrollBeginDrag", "onScrollEndDrag", "overScrollMode", "pinchGestureEnabled", "removeClippedSubviews", "scrollEventThrottle", "scrollIndicatorInsets", "scrollPerfTag", "scrollsToTop", "showsHorizontalScrollIndicator", "showsVerticalScrollIndicator", "snapToInterval", "snapToAlignment", "zoomScale"]);

    var hideScrollbar = showsHorizontalScrollIndicator === false || showsVerticalScrollIndicator === false;
    return _react.default.createElement(_View.default, _extends({}, other, {
      onScroll: this._handleScroll,
      onTouchMove: this._createPreventableScrollHandler(this.props.onTouchMove),
      onWheel: this._createPreventableScrollHandler(this.props.onWheel),
      ref: this._setViewRef,
      style: [style, !scrollEnabled && styles.scrollDisabled, hideScrollbar && styles.hideScrollbar]
    }));
  };

  _proto._handleScrollStart = function _handleScrollStart(e) {
    this._state.isScrolling = true;
    this._state.scrollLastTick = Date.now();
  };

  _proto._handleScrollTick = function _handleScrollTick(e) {
    var onScroll = this.props.onScroll;
    this._state.scrollLastTick = Date.now();

    if (onScroll) {
      onScroll(normalizeScrollEvent(e));
    }
  };

  _proto._handleScrollEnd = function _handleScrollEnd(e) {
    var onScroll = this.props.onScroll;
    this._state.isScrolling = false;

    if (onScroll) {
      onScroll(normalizeScrollEvent(e));
    }
  };

  _proto._shouldEmitScrollEvent = function _shouldEmitScrollEvent(lastTick, eventThrottle) {
    var timeSinceLastTick = Date.now() - lastTick;
    return eventThrottle > 0 && timeSinceLastTick >= eventThrottle;
  };

  return ScrollViewBase;
}(_react.Component); // Chrome doesn't support e.preventDefault in this case; touch-action must be
// used to disable scrolling.
// https://developers.google.com/web/updates/2017/01/scrolling-intervention


exports.default = ScrollViewBase;
ScrollViewBase.defaultProps = {
  scrollEnabled: true,
  scrollEventThrottle: 0
};
ScrollViewBase.propTypes = process.env.NODE_ENV !== "production" ? _objectSpread({}, _ViewPropTypes.default, {
  onMomentumScrollBegin: _propTypes.func,
  onMomentumScrollEnd: _propTypes.func,
  onScroll: _propTypes.func,
  onScrollBeginDrag: _propTypes.func,
  onScrollEndDrag: _propTypes.func,
  onTouchMove: _propTypes.func,
  onWheel: _propTypes.func,
  removeClippedSubviews: _propTypes.bool,
  scrollEnabled: _propTypes.bool,
  scrollEventThrottle: _propTypes.number,
  showsHorizontalScrollIndicator: _propTypes.bool,
  showsVerticalScrollIndicator: _propTypes.bool
}) : {};

var styles = _StyleSheet.default.create({
  scrollDisabled: {
    touchAction: 'none'
  },
  hideScrollbar: {
    scrollbarWidth: 'none'
  }
});

module.exports = exports.default;