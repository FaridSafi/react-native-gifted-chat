/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule SwipeableListView
 * 
 */
'use strict';

exports.__esModule = true;
exports.default = void 0;

var _ListView = _interopRequireDefault(require("../ListView"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _SwipeableListViewDataSource = _interopRequireDefault(require("./SwipeableListViewDataSource"));

var _SwipeableRow = _interopRequireDefault(require("../SwipeableRow"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * A container component that renders multiple SwipeableRow's in a ListView
 * implementation. This is designed to be a drop-in replacement for the
 * standard React Native `ListView`, so use it as if it were a ListView, but
 * with extra props, i.e.
 *
 * let ds = SwipeableListView.getNewDataSource();
 * ds.cloneWithRowsAndSections(dataBlob, ?sectionIDs, ?rowIDs);
 * // ..
 * <SwipeableListView renderRow={..} renderQuickActions={..} {..ListView props} />
 *
 * SwipeableRow can be used independently of this component, but the main
 * benefit of using this component is
 *
 * - It ensures that at most 1 row is swiped open (auto closes others)
 * - It can bounce the 1st row of the list so users know it's swipeable
 * - More to come
 */
var SwipeableListView =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(SwipeableListView, _React$Component);

  SwipeableListView.getNewDataSource = function getNewDataSource() {
    return new _SwipeableListViewDataSource.default({
      getRowData: function getRowData(data, sectionID, rowID) {
        return data[sectionID][rowID];
      },
      getSectionHeaderData: function getSectionHeaderData(data, sectionID) {
        return data[sectionID];
      },
      rowHasChanged: function rowHasChanged(row1, row2) {
        return row1 !== row2;
      },
      sectionHeaderHasChanged: function sectionHeaderHasChanged(s1, s2) {
        return s1 !== s2;
      }
    });
  };

  function SwipeableListView(props, context) {
    var _this;

    _this = _React$Component.call(this, props, context) || this;
    _this._listViewRef = null;
    _this._shouldBounceFirstRowOnMount = false;

    _this._onScroll = function (e) {
      // Close any opens rows on ListView scroll
      if (_this.props.dataSource.getOpenRowID()) {
        _this.setState({
          dataSource: _this.state.dataSource.setOpenRowID(null)
        });
      }

      _this.props.onScroll && _this.props.onScroll(e);
    };

    _this._renderRow = function (rowData, sectionID, rowID) {
      var slideoutView = _this.props.renderQuickActions(rowData, sectionID, rowID); // If renderQuickActions is unspecified or returns falsey, don't allow swipe


      if (!slideoutView) {
        return _this.props.renderRow(rowData, sectionID, rowID);
      }

      var shouldBounceOnMount = false;

      if (_this._shouldBounceFirstRowOnMount) {
        _this._shouldBounceFirstRowOnMount = false;
        shouldBounceOnMount = rowID === _this.props.dataSource.getFirstRowID();
      }

      return _react.default.createElement(_SwipeableRow.default, {
        slideoutView: slideoutView,
        isOpen: rowData.id === _this.props.dataSource.getOpenRowID(),
        maxSwipeDistance: _this._getMaxSwipeDistance(rowData, sectionID, rowID),
        key: rowID,
        onOpen: function onOpen() {
          return _this._onOpen(rowData.id);
        },
        onClose: function onClose() {
          return _this._onClose(rowData.id);
        },
        onSwipeEnd: function onSwipeEnd() {
          return _this._setListViewScrollable(true);
        },
        onSwipeStart: function onSwipeStart() {
          return _this._setListViewScrollable(false);
        },
        shouldBounceOnMount: shouldBounceOnMount
      }, _this.props.renderRow(rowData, sectionID, rowID));
    };

    _this._shouldBounceFirstRowOnMount = _this.props.bounceFirstRowOnMount;
    _this.state = {
      dataSource: _this.props.dataSource
    };
    return _this;
  }

  var _proto = SwipeableListView.prototype;

  _proto.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.dataSource.getDataSource() !== nextProps.dataSource.getDataSource()) {
      this.setState({
        dataSource: nextProps.dataSource
      });
    }
  };

  _proto.render = function render() {
    var _this2 = this;

    return _react.default.createElement(_ListView.default, _extends({}, this.props, {
      ref: function ref(_ref) {
        _this2._listViewRef = _ref;
      },
      dataSource: this.state.dataSource.getDataSource(),
      onScroll: this._onScroll,
      renderRow: this._renderRow
    }));
  };

  /**
   * This is a work-around to lock vertical `ListView` scrolling on iOS and
   * mimic Android behaviour. Locking vertical scrolling when horizontal
   * scrolling is active allows us to significantly improve framerates
   * (from high 20s to almost consistently 60 fps)
   */
  _proto._setListViewScrollable = function _setListViewScrollable(value) {
    if (this._listViewRef && typeof this._listViewRef.setNativeProps === 'function') {
      this._listViewRef.setNativeProps({
        scrollEnabled: value
      });
    }
  } // Passing through ListView's getScrollResponder() function
  ;

  _proto.getScrollResponder = function getScrollResponder() {
    if (this._listViewRef && typeof this._listViewRef.getScrollResponder === 'function') {
      return this._listViewRef.getScrollResponder();
    }
  } // This enables rows having variable width slideoutView.
  ;

  _proto._getMaxSwipeDistance = function _getMaxSwipeDistance(rowData, sectionID, rowID) {
    if (typeof this.props.maxSwipeDistance === 'function') {
      return this.props.maxSwipeDistance(rowData, sectionID, rowID);
    }

    return this.props.maxSwipeDistance;
  };

  _proto._onOpen = function _onOpen(rowID) {
    this.setState({
      dataSource: this.state.dataSource.setOpenRowID(rowID)
    });
  };

  _proto._onClose = function _onClose(rowID) {
    this.setState({
      dataSource: this.state.dataSource.setOpenRowID(null)
    });
  };

  return SwipeableListView;
}(_react.default.Component);

SwipeableListView.defaultProps = {
  bounceFirstRowOnMount: false,
  renderQuickActions: function renderQuickActions() {
    return null;
  }
};
SwipeableListView.propTypes = process.env.NODE_ENV !== "production" ? {
  /**
   * To alert the user that swiping is possible, the first row can bounce
   * on component mount.
   */
  bounceFirstRowOnMount: _propTypes.default.bool.isRequired,

  /**
   * Use `SwipeableListView.getNewDataSource()` to get a data source to use,
   * then use it just like you would a normal ListView data source
   */
  dataSource: _propTypes.default.instanceOf(_SwipeableListViewDataSource.default).isRequired,
  // Maximum distance to open to after a swipe
  maxSwipeDistance: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.func]).isRequired,
  // Callback method to render the swipeable view
  renderRow: _propTypes.default.func.isRequired,
  // Callback method to render the view that will be unveiled on swipe
  renderQuickActions: _propTypes.default.func.isRequired
} : {};
var _default = SwipeableListView;
exports.default = _default;
module.exports = exports.default;