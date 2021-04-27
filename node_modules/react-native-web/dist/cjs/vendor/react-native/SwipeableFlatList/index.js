/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule SwipeableFlatList
 * 
 * @format
 */
'use strict';

exports.__esModule = true;
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _SwipeableRow = _interopRequireDefault(require("../SwipeableRow"));

var _FlatList = _interopRequireDefault(require("../FlatList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * A container component that renders multiple SwipeableRow's in a FlatList
 * implementation. This is designed to be a drop-in replacement for the
 * standard React Native `FlatList`, so use it as if it were a FlatList, but
 * with extra props, i.e.
 *
 * <SwipeableListView renderRow={..} renderQuickActions={..} {..FlatList props} />
 *
 * SwipeableRow can be used independently of this component, but the main
 * benefit of using this component is
 *
 * - It ensures that at most 1 row is swiped open (auto closes others)
 * - It can bounce the 1st row of the list so users know it's swipeable
 * - Increase performance on iOS by locking list swiping when row swiping is occurring
 * - More to come
 */
var SwipeableFlatList =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(SwipeableFlatList, _React$Component);

  function SwipeableFlatList(props, context) {
    var _this;

    _this = _React$Component.call(this, props, context) || this;
    _this._flatListRef = null;
    _this._shouldBounceFirstRowOnMount = false;

    _this._onScroll = function (e) {
      // Close any opens rows on ListView scroll
      if (_this.state.openRowKey) {
        _this.setState({
          openRowKey: null
        });
      }

      _this.props.onScroll && _this.props.onScroll(e);
    };

    _this._renderItem = function (info) {
      var slideoutView = _this.props.renderQuickActions(info);

      var key = _this.props.keyExtractor(info.item, info.index); // If renderQuickActions is unspecified or returns falsey, don't allow swipe


      if (!slideoutView) {
        return _this.props.renderItem(info);
      }

      var shouldBounceOnMount = false;

      if (_this._shouldBounceFirstRowOnMount) {
        _this._shouldBounceFirstRowOnMount = false;
        shouldBounceOnMount = true;
      }

      return _react.default.createElement(_SwipeableRow.default, {
        slideoutView: slideoutView,
        isOpen: key === _this.state.openRowKey,
        maxSwipeDistance: _this._getMaxSwipeDistance(info),
        onOpen: function onOpen() {
          return _this._onOpen(key);
        },
        onClose: function onClose() {
          return _this._onClose(key);
        },
        shouldBounceOnMount: shouldBounceOnMount,
        onSwipeEnd: _this._setListViewScrollable,
        onSwipeStart: _this._setListViewNotScrollable
      }, _this.props.renderItem(info));
    };

    _this._setListViewScrollable = function () {
      _this._setListViewScrollableTo(true);
    };

    _this._setListViewNotScrollable = function () {
      _this._setListViewScrollableTo(false);
    };

    _this.state = {
      openRowKey: null
    };
    _this._shouldBounceFirstRowOnMount = _this.props.bounceFirstRowOnMount;
    return _this;
  }

  var _proto = SwipeableFlatList.prototype;

  _proto.render = function render() {
    var _this2 = this;

    return _react.default.createElement(_FlatList.default, _extends({}, this.props, {
      ref: function ref(_ref) {
        _this2._flatListRef = _ref;
      },
      onScroll: this._onScroll,
      renderItem: this._renderItem
    }));
  };

  // This enables rows having variable width slideoutView.
  _proto._getMaxSwipeDistance = function _getMaxSwipeDistance(info) {
    if (typeof this.props.maxSwipeDistance === 'function') {
      return this.props.maxSwipeDistance(info);
    }

    return this.props.maxSwipeDistance;
  };

  _proto._setListViewScrollableTo = function _setListViewScrollableTo(value) {
    if (this._flatListRef) {
      this._flatListRef.setNativeProps({
        scrollEnabled: value
      });
    }
  };

  _proto._onOpen = function _onOpen(key) {
    this.setState({
      openRowKey: key
    });
  };

  _proto._onClose = function _onClose(key) {
    this.setState({
      openRowKey: null
    });
  };

  return SwipeableFlatList;
}(_react.default.Component);

SwipeableFlatList.defaultProps = _objectSpread({}, _FlatList.default.defaultProps, {
  bounceFirstRowOnMount: true,
  renderQuickActions: function renderQuickActions() {
    return null;
  }
});
SwipeableFlatList.propTypes = process.env.NODE_ENV !== "production" ? _objectSpread({}, _FlatList.default.propTypes, {
  /**
   * To alert the user that swiping is possible, the first row can bounce
   * on component mount.
   */
  bounceFirstRowOnMount: _propTypes.default.bool.isRequired,
  // Maximum distance to open to after a swipe
  maxSwipeDistance: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.func]).isRequired,
  // Callback method to render the view that will be unveiled on swipe
  renderQuickActions: _propTypes.default.func.isRequired
}) : {};
var _default = SwipeableFlatList;
exports.default = _default;
module.exports = exports.default;