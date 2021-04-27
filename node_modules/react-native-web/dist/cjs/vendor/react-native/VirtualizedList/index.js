"use strict";

exports.__esModule = true;
exports.default = void 0;

var _Batchinator = _interopRequireDefault(require("../Batchinator"));

var _FillRateHelper = _interopRequireDefault(require("../FillRateHelper"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _RefreshControl = _interopRequireDefault(require("../../../exports/RefreshControl"));

var _ScrollView = _interopRequireDefault(require("../../../exports/ScrollView"));

var _StyleSheet = _interopRequireDefault(require("../../../exports/StyleSheet"));

var _UIManager = _interopRequireDefault(require("../../../exports/UIManager"));

var _View = _interopRequireDefault(require("../../../exports/View"));

var _ViewabilityHelper = _interopRequireDefault(require("../ViewabilityHelper"));

var _VirtualizeUtils = require("../VirtualizeUtils");

var _findNodeHandle = _interopRequireDefault(require("../../../exports/findNodeHandle"));

var _infoLog = _interopRequireDefault(require("../infoLog"));

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

var _warning = _interopRequireDefault(require("fbjs/lib/warning"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var flattenStyle = _StyleSheet.default.flatten;

var __DEV__ = process.env.NODE_ENV !== 'production';

var _usedIndexForKey = false;

/**
 * Base implementation for the more convenient [`<FlatList>`](/react-native/docs/flatlist.html)
 * and [`<SectionList>`](/react-native/docs/sectionlist.html) components, which are also better
 * documented. In general, this should only really be used if you need more flexibility than
 * `FlatList` provides, e.g. for use with immutable data instead of plain arrays.
 *
 * Virtualization massively improves memory consumption and performance of large lists by
 * maintaining a finite render window of active items and replacing all items outside of the render
 * window with appropriately sized blank space. The window adapts to scrolling behavior, and items
 * are rendered incrementally with low-pri (after any running interactions) if they are far from the
 * visible area, or with hi-pri otherwise to minimize the potential of seeing blank space.
 *
 * Some caveats:
 *
 * - Internal state is not preserved when content scrolls out of the render window. Make sure all
 *   your data is captured in the item data or external stores like Flux, Redux, or Relay.
 * - This is a `PureComponent` which means that it will not re-render if `props` remain shallow-
 *   equal. Make sure that everything your `renderItem` function depends on is passed as a prop
 *   (e.g. `extraData`) that is not `===` after updates, otherwise your UI may not update on
 *   changes. This includes the `data` prop and parent component state.
 * - In order to constrain memory and enable smooth scrolling, content is rendered asynchronously
 *   offscreen. This means it's possible to scroll faster than the fill rate ands momentarily see
 *   blank content. This is a tradeoff that can be adjusted to suit the needs of each application,
 *   and we are working on improving it behind the scenes.
 * - By default, the list looks for a `key` prop on each item and uses that for the React key.
 *   Alternatively, you can provide a custom `keyExtractor` prop.
 *
 */
var VirtualizedList =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(VirtualizedList, _React$PureComponent);

  var _proto = VirtualizedList.prototype;

  // scrollToEnd may be janky without getItemLayout prop
  _proto.scrollToEnd = function scrollToEnd(params) {
    var animated = params ? params.animated : true;
    var veryLast = this.props.getItemCount(this.props.data) - 1;

    var frame = this._getFrameMetricsApprox(veryLast);

    var offset = Math.max(0, frame.offset + frame.length + this._footerLength - this._scrollMetrics.visibleLength);
    /* $FlowFixMe(>=0.53.0 site=react_native_fb,react_native_oss) This comment
     * suppresses an error when upgrading Flow's support for React. To see the
     * error delete this comment and run Flow. */

    this._scrollRef.scrollTo(
    /* $FlowFixMe(>=0.53.0 site=react_native_fb,react_native_oss) This
     * comment suppresses an error when upgrading Flow's support for React.
     * To see the error delete this comment and run Flow. */
    this.props.horizontal ? {
      x: offset,
      animated: animated
    } : {
      y: offset,
      animated: animated
    });
  } // scrollToIndex may be janky without getItemLayout prop
  ;

  _proto.scrollToIndex = function scrollToIndex(params) {
    var _this$props = this.props,
        data = _this$props.data,
        horizontal = _this$props.horizontal,
        getItemCount = _this$props.getItemCount,
        getItemLayout = _this$props.getItemLayout,
        onScrollToIndexFailed = _this$props.onScrollToIndexFailed;
    var animated = params.animated,
        index = params.index,
        viewOffset = params.viewOffset,
        viewPosition = params.viewPosition;
    (0, _invariant.default)(index >= 0 && index < getItemCount(data), "scrollToIndex out of range: " + index + " vs " + (getItemCount(data) - 1));

    if (!getItemLayout && index > this._highestMeasuredFrameIndex) {
      (0, _invariant.default)(!!onScrollToIndexFailed, 'scrollToIndex should be used in conjunction with getItemLayout or onScrollToIndexFailed, ' + 'otherwise there is no way to know the location of offscreen indices or handle failures.');
      onScrollToIndexFailed({
        averageItemLength: this._averageCellLength,
        highestMeasuredFrameIndex: this._highestMeasuredFrameIndex,
        index: index
      });
      return;
    }

    var frame = this._getFrameMetricsApprox(index);

    var offset = Math.max(0, frame.offset - (viewPosition || 0) * (this._scrollMetrics.visibleLength - frame.length)) - (viewOffset || 0);
    /* $FlowFixMe(>=0.53.0 site=react_native_fb,react_native_oss) This comment
     * suppresses an error when upgrading Flow's support for React. To see the
     * error delete this comment and run Flow. */

    this._scrollRef.scrollTo(
    /* $FlowFixMe(>=0.53.0 site=react_native_fb,react_native_oss) This
     * comment suppresses an error when upgrading Flow's support for React.
     * To see the error delete this comment and run Flow. */
    horizontal ? {
      x: offset,
      animated: animated
    } : {
      y: offset,
      animated: animated
    });
  } // scrollToItem may be janky without getItemLayout prop. Required linear scan through items -
  // use scrollToIndex instead if possible.
  ;

  _proto.scrollToItem = function scrollToItem(params) {
    var item = params.item;
    var _this$props2 = this.props,
        data = _this$props2.data,
        getItem = _this$props2.getItem,
        getItemCount = _this$props2.getItemCount;
    var itemCount = getItemCount(data);

    for (var _index = 0; _index < itemCount; _index++) {
      if (getItem(data, _index) === item) {
        this.scrollToIndex(_objectSpread({}, params, {
          index: _index
        }));
        break;
      }
    }
  }
  /**
   * Scroll to a specific content pixel offset in the list.
   *
   * Param `offset` expects the offset to scroll to.
   * In case of `horizontal` is true, the offset is the x-value,
   * in any other case the offset is the y-value.
   *
   * Param `animated` (`true` by default) defines whether the list
   * should do an animation while scrolling.
   */
  ;

  _proto.scrollToOffset = function scrollToOffset(params) {
    var animated = params.animated,
        offset = params.offset;
    /* $FlowFixMe(>=0.53.0 site=react_native_fb,react_native_oss) This comment
     * suppresses an error when upgrading Flow's support for React. To see the
     * error delete this comment and run Flow. */

    this._scrollRef.scrollTo(
    /* $FlowFixMe(>=0.53.0 site=react_native_fb,react_native_oss) This
     * comment suppresses an error when upgrading Flow's support for React.
     * To see the error delete this comment and run Flow. */
    this.props.horizontal ? {
      x: offset,
      animated: animated
    } : {
      y: offset,
      animated: animated
    });
  };

  _proto.recordInteraction = function recordInteraction() {
    this._nestedChildLists.forEach(function (childList) {
      childList.ref && childList.ref.recordInteraction();
    });

    this._viewabilityTuples.forEach(function (t) {
      t.viewabilityHelper.recordInteraction();
    });

    this._updateViewableItems(this.props.data);
  };

  _proto.flashScrollIndicators = function flashScrollIndicators() {
    /* $FlowFixMe(>=0.53.0 site=react_native_fb,react_native_oss) This comment
     * suppresses an error when upgrading Flow's support for React. To see the
     * error delete this comment and run Flow. */
    this._scrollRef.flashScrollIndicators();
  }
  /**
   * Provides a handle to the underlying scroll responder.
   * Note that `this._scrollRef` might not be a `ScrollView`, so we
   * need to check that it responds to `getScrollResponder` before calling it.
   */
  ;

  _proto.getScrollResponder = function getScrollResponder() {
    if (this._scrollRef && this._scrollRef.getScrollResponder) {
      return this._scrollRef.getScrollResponder();
    }
  };

  _proto.getScrollableNode = function getScrollableNode() {
    if (this._scrollRef && this._scrollRef.getScrollableNode) {
      return this._scrollRef.getScrollableNode();
    } else {
      return (0, _findNodeHandle.default)(this._scrollRef);
    }
  };

  _proto.setNativeProps = function setNativeProps(props) {
    if (this._scrollRef) {
      this._scrollRef.setNativeProps(props);
    }
  };

  _proto.getChildContext = function getChildContext() {
    return {
      virtualizedList: {
        getScrollMetrics: this._getScrollMetrics,
        horizontal: this.props.horizontal,
        getOutermostParentListRef: this._getOutermostParentListRef,
        getNestedChildState: this._getNestedChildState,
        registerAsNestedChild: this._registerAsNestedChild,
        unregisterAsNestedChild: this._unregisterAsNestedChild
      }
    };
  };

  _proto._getCellKey = function _getCellKey() {
    return this.context.virtualizedCell && this.context.virtualizedCell.cellKey || 'rootList';
  };

  _proto.hasMore = function hasMore() {
    return this._hasMore;
  };

  function VirtualizedList(_props, context) {
    var _this;

    _this = _React$PureComponent.call(this, _props, context) || this;

    _this._getScrollMetrics = function () {
      return _this._scrollMetrics;
    };

    _this._getOutermostParentListRef = function () {
      if (_this._isNestedWithSameOrientation()) {
        return _this.context.virtualizedList.getOutermostParentListRef();
      } else {
        return _assertThisInitialized(_assertThisInitialized(_this));
      }
    };

    _this._getNestedChildState = function (key) {
      var existingChildData = _this._nestedChildLists.get(key);

      return existingChildData && existingChildData.state;
    };

    _this._registerAsNestedChild = function (childList) {
      // Register the mapping between this child key and the cellKey for its cell
      var childListsInCell = _this._cellKeysToChildListKeys.get(childList.cellKey) || new Set();
      childListsInCell.add(childList.key);

      _this._cellKeysToChildListKeys.set(childList.cellKey, childListsInCell);

      var existingChildData = _this._nestedChildLists.get(childList.key);

      (0, _invariant.default)(!(existingChildData && existingChildData.ref !== null), 'A VirtualizedList contains a cell which itself contains ' + 'more than one VirtualizedList of the same orientation as the parent ' + 'list. You must pass a unique listKey prop to each sibling list.');

      _this._nestedChildLists.set(childList.key, {
        ref: childList.ref,
        state: null
      });

      if (_this._hasInteracted) {
        childList.ref.recordInteraction();
      }
    };

    _this._unregisterAsNestedChild = function (childList) {
      _this._nestedChildLists.set(childList.key, {
        ref: null,
        state: childList.state
      });
    };

    _this._onUpdateSeparators = function (keys, newProps) {
      keys.forEach(function (key) {
        var ref = key != null && _this._cellRefs[key];
        ref && ref.updateSeparatorProps(newProps);
      });
    };

    _this._averageCellLength = 0;
    _this._cellKeysToChildListKeys = new Map();
    _this._cellRefs = {};
    _this._frames = {};
    _this._footerLength = 0;
    _this._hasDataChangedSinceEndReached = true;
    _this._hasInteracted = false;
    _this._hasMore = false;
    _this._hasWarned = {};
    _this._highestMeasuredFrameIndex = 0;
    _this._headerLength = 0;
    _this._indicesToKeys = new Map();
    _this._hasDoneInitialScroll = false;
    _this._nestedChildLists = new Map();
    _this._offsetFromParentVirtualizedList = 0;
    _this._prevParentOffset = 0;
    _this._scrollMetrics = {
      contentLength: 0,
      dOffset: 0,
      dt: 10,
      offset: 0,
      timestamp: 0,
      velocity: 0,
      visibleLength: 0
    };
    _this._scrollRef = null;
    _this._sentEndForContentLength = 0;
    _this._totalCellLength = 0;
    _this._totalCellsMeasured = 0;
    _this._viewabilityTuples = [];

    _this._captureScrollRef = function (ref) {
      _this._scrollRef = ref;
    };

    _this._defaultRenderScrollComponent = function (props) {
      if (_this._isNestedWithSameOrientation()) {
        return _react.default.createElement(_View.default, props);
      } else if (props.onRefresh) {
        (0, _invariant.default)(typeof props.refreshing === 'boolean', '`refreshing` prop must be set as a boolean in order to use `onRefresh`, but got `' + JSON.stringify(props.refreshing) + '`');
        return _react.default.createElement(_ScrollView.default, _extends({}, props, {
          refreshControl:
          /* $FlowFixMe(>=0.53.0 site=react_native_fb,react_native_oss) This
           * comment suppresses an error when upgrading Flow's support for
           * React. To see the error delete this comment and run Flow. */
          _react.default.createElement(_RefreshControl.default, {
            refreshing: props.refreshing,
            onRefresh: props.onRefresh,
            progressViewOffset: props.progressViewOffset
          })
        }));
      } else {
        return _react.default.createElement(_ScrollView.default, props);
      }
    };

    _this._onCellUnmount = function (cellKey) {
      var curr = _this._frames[cellKey];

      if (curr) {
        _this._frames[cellKey] = _objectSpread({}, curr, {
          inLayout: false
        });
      }
    };

    _this._onLayout = function (e) {
      if (_this._isNestedWithSameOrientation()) {
        // Need to adjust our scroll metrics to be relative to our containing
        // VirtualizedList before we can make claims about list item viewability
        _this._measureLayoutRelativeToContainingList();
      } else {
        _this._scrollMetrics.visibleLength = _this._selectLength(e.nativeEvent.layout);
      }

      _this.props.onLayout && _this.props.onLayout(e);

      _this._scheduleCellsToRenderUpdate();

      _this._maybeCallOnEndReached();
    };

    _this._onLayoutEmpty = function (e) {
      _this.props.onLayout && _this.props.onLayout(e);
    };

    _this._onLayoutFooter = function (e) {
      _this._footerLength = _this._selectLength(e.nativeEvent.layout);
    };

    _this._onLayoutHeader = function (e) {
      _this._headerLength = _this._selectLength(e.nativeEvent.layout);
    };

    _this._onContentSizeChange = function (width, height) {
      if (width > 0 && height > 0 && _this.props.initialScrollIndex != null && _this.props.initialScrollIndex > 0 && !_this._hasDoneInitialScroll) {
        _this.scrollToIndex({
          animated: false,
          index: _this.props.initialScrollIndex
        });

        _this._hasDoneInitialScroll = true;
      }

      if (_this.props.onContentSizeChange) {
        _this.props.onContentSizeChange(width, height);
      }

      _this._scrollMetrics.contentLength = _this._selectLength({
        height: height,
        width: width
      });

      _this._scheduleCellsToRenderUpdate();

      _this._maybeCallOnEndReached();
    };

    _this._convertParentScrollMetrics = function (metrics) {
      // Offset of the top of the nested list relative to the top of its parent's viewport
      var offset = metrics.offset - _this._offsetFromParentVirtualizedList; // Child's visible length is the same as its parent's

      var visibleLength = metrics.visibleLength;
      var dOffset = offset - _this._scrollMetrics.offset;
      var contentLength = _this._scrollMetrics.contentLength;
      return {
        visibleLength: visibleLength,
        contentLength: contentLength,
        offset: offset,
        dOffset: dOffset
      };
    };

    _this._onScroll = function (e) {
      _this._nestedChildLists.forEach(function (childList) {
        childList.ref && childList.ref._onScroll(e);
      });

      if (_this.props.onScroll) {
        _this.props.onScroll(e);
      }

      var timestamp = e.timeStamp;

      var visibleLength = _this._selectLength(e.nativeEvent.layoutMeasurement);

      var contentLength = _this._selectLength(e.nativeEvent.contentSize);

      var offset = _this._selectOffset(e.nativeEvent.contentOffset);

      var dOffset = offset - _this._scrollMetrics.offset;

      if (_this._isNestedWithSameOrientation()) {
        if (_this._scrollMetrics.contentLength === 0) {
          // Ignore scroll events until onLayout has been called and we
          // know our offset from our offset from our parent
          return;
        }

        var _this$_convertParentS = _this._convertParentScrollMetrics({
          visibleLength: visibleLength,
          offset: offset
        });

        visibleLength = _this$_convertParentS.visibleLength;
        contentLength = _this$_convertParentS.contentLength;
        offset = _this$_convertParentS.offset;
        dOffset = _this$_convertParentS.dOffset;
      }

      var dt = _this._scrollMetrics.timestamp ? Math.max(1, timestamp - _this._scrollMetrics.timestamp) : 1;
      var velocity = dOffset / dt;

      if (dt > 500 && _this._scrollMetrics.dt > 500 && contentLength > 5 * visibleLength && !_this._hasWarned.perf) {
        (0, _infoLog.default)('VirtualizedList: You have a large list that is slow to update - make sure your ' + 'renderItem function renders components that follow React performance best practices ' + 'like PureComponent, shouldComponentUpdate, etc.', {
          dt: dt,
          prevDt: _this._scrollMetrics.dt,
          contentLength: contentLength
        });
        _this._hasWarned.perf = true;
      }

      _this._scrollMetrics = {
        contentLength: contentLength,
        dt: dt,
        dOffset: dOffset,
        offset: offset,
        timestamp: timestamp,
        velocity: velocity,
        visibleLength: visibleLength
      };

      _this._updateViewableItems(_this.props.data);

      if (!_this.props) {
        return;
      }

      _this._maybeCallOnEndReached();

      if (velocity !== 0) {
        _this._fillRateHelper.activate();
      }

      _this._computeBlankness();

      _this._scheduleCellsToRenderUpdate();
    };

    _this._onScrollBeginDrag = function (e) {
      _this._nestedChildLists.forEach(function (childList) {
        childList.ref && childList.ref._onScrollBeginDrag(e);
      });

      _this._viewabilityTuples.forEach(function (tuple) {
        tuple.viewabilityHelper.recordInteraction();
      });

      _this._hasInteracted = true;
      _this.props.onScrollBeginDrag && _this.props.onScrollBeginDrag(e);
    };

    _this._onScrollEndDrag = function (e) {
      var velocity = e.nativeEvent.velocity;

      if (velocity) {
        _this._scrollMetrics.velocity = _this._selectOffset(velocity);
      }

      _this._computeBlankness();

      _this.props.onScrollEndDrag && _this.props.onScrollEndDrag(e);
    };

    _this._onMomentumScrollEnd = function (e) {
      _this._scrollMetrics.velocity = 0;

      _this._computeBlankness();

      _this.props.onMomentumScrollEnd && _this.props.onMomentumScrollEnd(e);
    };

    _this._updateCellsToRender = function () {
      var _this$props3 = _this.props,
          data = _this$props3.data,
          getItemCount = _this$props3.getItemCount,
          onEndReachedThreshold = _this$props3.onEndReachedThreshold;

      var isVirtualizationDisabled = _this._isVirtualizationDisabled();

      _this._updateViewableItems(data);

      if (!data) {
        return;
      }

      _this.setState(function (state) {
        var newState;

        if (!isVirtualizationDisabled) {
          // If we run this with bogus data, we'll force-render window {first: 0, last: 0},
          // and wipe out the initialNumToRender rendered elements.
          // So let's wait until the scroll view metrics have been set up. And until then,
          // we will trust the initialNumToRender suggestion
          if (_this._scrollMetrics.visibleLength) {
            // If we have a non-zero initialScrollIndex and run this before we've scrolled,
            // we'll wipe out the initialNumToRender rendered elements starting at initialScrollIndex.
            // So let's wait until we've scrolled the view to the right place. And until then,
            // we will trust the initialScrollIndex suggestion.
            if (!_this.props.initialScrollIndex || _this._scrollMetrics.offset) {
              newState = (0, _VirtualizeUtils.computeWindowedRenderLimits)(_this.props, state, _this._getFrameMetricsApprox, _this._scrollMetrics);
            }
          }
        } else {
          var _this$_scrollMetrics = _this._scrollMetrics,
              contentLength = _this$_scrollMetrics.contentLength,
              offset = _this$_scrollMetrics.offset,
              visibleLength = _this$_scrollMetrics.visibleLength;
          var distanceFromEnd = contentLength - visibleLength - offset;
          var renderAhead =
          /* $FlowFixMe(>=0.63.0 site=react_native_fb) This comment suppresses
           * an error found when Flow v0.63 was deployed. To see the error
           * delete this comment and run Flow. */
          distanceFromEnd < onEndReachedThreshold * visibleLength ? _this.props.maxToRenderPerBatch : 0;
          newState = {
            first: 0,
            last: Math.min(state.last + renderAhead, getItemCount(data) - 1)
          };
        }

        if (newState && _this._nestedChildLists.size > 0) {
          var newFirst = newState.first;
          var newLast = newState.last; // If some cell in the new state has a child list in it, we should only render
          // up through that item, so that we give that list a chance to render.
          // Otherwise there's churn from multiple child lists mounting and un-mounting
          // their items.

          for (var ii = newFirst; ii <= newLast; ii++) {
            var cellKeyForIndex = _this._indicesToKeys.get(ii);

            var childListKeys = cellKeyForIndex && _this._cellKeysToChildListKeys.get(cellKeyForIndex);

            if (!childListKeys) {
              continue;
            }

            var someChildHasMore = false; // For each cell, need to check whether any child list in it has more elements to render

            for (var _iterator = childListKeys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
              var _ref;

              if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
              } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
              }

              var childKey = _ref;

              var childList = _this._nestedChildLists.get(childKey);

              if (childList && childList.ref && childList.ref.hasMore()) {
                someChildHasMore = true;
                break;
              }
            }

            if (someChildHasMore) {
              newState.last = ii;
              break;
            }
          }
        }

        return newState;
      });
    };

    _this._createViewToken = function (index, isViewable) {
      var _this$props4 = _this.props,
          data = _this$props4.data,
          getItem = _this$props4.getItem,
          keyExtractor = _this$props4.keyExtractor;
      var item = getItem(data, index);
      return {
        index: index,
        item: item,
        key: keyExtractor(item, index),
        isViewable: isViewable
      };
    };

    _this._getFrameMetricsApprox = function (index) {
      var frame = _this._getFrameMetrics(index);

      if (frame && frame.index === index) {
        // check for invalid frames due to row re-ordering
        return frame;
      } else {
        var getItemLayout = _this.props.getItemLayout;
        (0, _invariant.default)(!getItemLayout, 'Should not have to estimate frames when a measurement metrics function is provided');
        return {
          length: _this._averageCellLength,
          offset: _this._averageCellLength * index
        };
      }
    };

    _this._getFrameMetrics = function (index) {
      var _this$props5 = _this.props,
          data = _this$props5.data,
          getItem = _this$props5.getItem,
          getItemCount = _this$props5.getItemCount,
          getItemLayout = _this$props5.getItemLayout,
          keyExtractor = _this$props5.keyExtractor;
      (0, _invariant.default)(getItemCount(data) > index, 'Tried to get frame for out of range index ' + index);
      var item = getItem(data, index);

      var frame = item && _this._frames[keyExtractor(item, index)];

      if (!frame || frame.index !== index) {
        if (getItemLayout) {
          frame = getItemLayout(data, index);

          if (__DEV__) {
            var frameType = _propTypes.default.shape({
              length: _propTypes.default.number.isRequired,
              offset: _propTypes.default.number.isRequired,
              index: _propTypes.default.number.isRequired
            }).isRequired;

            _propTypes.default.checkPropTypes({
              frame: frameType
            }, {
              frame: frame
            }, 'frame', 'VirtualizedList.getItemLayout');
          }
        }
      }
      /* $FlowFixMe(>=0.63.0 site=react_native_fb) This comment suppresses an
       * error found when Flow v0.63 was deployed. To see the error delete this
       * comment and run Flow. */


      return frame;
    };

    (0, _invariant.default)(!_props.onScroll || !_props.onScroll.__isNative, 'Components based on VirtualizedList must be wrapped with Animated.createAnimatedComponent ' + 'to support native onScroll events with useNativeDriver');
    (0, _invariant.default)(_props.windowSize > 0, 'VirtualizedList: The windowSize prop must be present and set to a value greater than 0.');
    _this._fillRateHelper = new _FillRateHelper.default(_this._getFrameMetrics);
    _this._updateCellsToRenderBatcher = new _Batchinator.default(_this._updateCellsToRender, _this.props.updateCellsBatchingPeriod);

    if (_this.props.viewabilityConfigCallbackPairs) {
      _this._viewabilityTuples = _this.props.viewabilityConfigCallbackPairs.map(function (pair) {
        return {
          viewabilityHelper: new _ViewabilityHelper.default(pair.viewabilityConfig),
          onViewableItemsChanged: pair.onViewableItemsChanged
        };
      });
    } else if (_this.props.onViewableItemsChanged) {
      _this._viewabilityTuples.push({
        viewabilityHelper: new _ViewabilityHelper.default(_this.props.viewabilityConfig),
        onViewableItemsChanged: _this.props.onViewableItemsChanged
      });
    }

    var initialState = {
      first: _this.props.initialScrollIndex || 0,
      last: Math.min(_this.props.getItemCount(_this.props.data), (_this.props.initialScrollIndex || 0) + _this.props.initialNumToRender) - 1
    };

    if (_this._isNestedWithSameOrientation()) {
      var storedState = _this.context.virtualizedList.getNestedChildState(_this.props.listKey || _this._getCellKey());

      if (storedState) {
        initialState = storedState;
        _this.state = storedState;
        _this._frames = storedState.frames;
      }
    }

    _this.state = initialState;
    return _this;
  }

  _proto.componentDidMount = function componentDidMount() {
    if (this._isNestedWithSameOrientation()) {
      this.context.virtualizedList.registerAsNestedChild({
        cellKey: this._getCellKey(),
        key: this.props.listKey || this._getCellKey(),
        ref: this
      });
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this._isNestedWithSameOrientation()) {
      this.context.virtualizedList.unregisterAsNestedChild({
        key: this.props.listKey || this._getCellKey(),
        state: {
          first: this.state.first,
          last: this.state.last,
          frames: this._frames
        }
      });
    }

    this._updateViewableItems(null);

    this._updateCellsToRenderBatcher.dispose({
      abort: true
    });

    this._viewabilityTuples.forEach(function (tuple) {
      tuple.viewabilityHelper.dispose();
    });

    this._fillRateHelper.deactivateAndFlush();
  };

  VirtualizedList.getDerivedStateFromProps = function getDerivedStateFromProps(newProps, prevState) {
    var data = newProps.data,
        extraData = newProps.extraData,
        getItemCount = newProps.getItemCount,
        maxToRenderPerBatch = newProps.maxToRenderPerBatch; // first and last could be stale (e.g. if a new, shorter items props is passed in), so we make
    // sure we're rendering a reasonable range here.

    return {
      first: Math.max(0, Math.min(prevState.first, getItemCount(data) - 1 - maxToRenderPerBatch)),
      last: Math.max(0, Math.min(prevState.last, getItemCount(data) - 1))
    };
  };

  _proto._pushCells = function _pushCells(cells, stickyHeaderIndices, stickyIndicesFromProps, first, last, inversionStyle) {
    var _this2 = this;

    var _this$props6 = this.props,
        CellRendererComponent = _this$props6.CellRendererComponent,
        ItemSeparatorComponent = _this$props6.ItemSeparatorComponent,
        data = _this$props6.data,
        getItem = _this$props6.getItem,
        getItemCount = _this$props6.getItemCount,
        horizontal = _this$props6.horizontal,
        keyExtractor = _this$props6.keyExtractor;
    var stickyOffset = this.props.ListHeaderComponent ? 1 : 0;
    var end = getItemCount(data) - 1;
    var prevCellKey;
    last = Math.min(end, last);

    var _loop = function _loop(ii) {
      var item = getItem(data, ii);
      var key = keyExtractor(item, ii);

      _this2._indicesToKeys.set(ii, key);

      if (stickyIndicesFromProps.has(ii + stickyOffset)) {
        stickyHeaderIndices.push(cells.length);
      }

      cells.push(_react.default.createElement(CellRenderer, {
        CellRendererComponent: CellRendererComponent,
        ItemSeparatorComponent: ii < end ? ItemSeparatorComponent : undefined,
        cellKey: key,
        fillRateHelper: _this2._fillRateHelper,
        horizontal: horizontal,
        index: ii,
        inversionStyle: inversionStyle,
        item: item,
        key: key,
        prevCellKey: prevCellKey,
        onUpdateSeparators: _this2._onUpdateSeparators,
        onLayout: function onLayout(e) {
          return _this2._onCellLayout(e, key, ii);
        },
        onUnmount: _this2._onCellUnmount,
        parentProps: _this2.props,
        ref: function ref(_ref2) {
          _this2._cellRefs[key] = _ref2;
        }
      }));
      prevCellKey = key;
    };

    for (var ii = first; ii <= last; ii++) {
      _loop(ii);
    }
  };

  _proto._isVirtualizationDisabled = function _isVirtualizationDisabled() {
    return this.props.disableVirtualization;
  };

  _proto._isNestedWithSameOrientation = function _isNestedWithSameOrientation() {
    var nestedContext = this.context.virtualizedList;
    return !!(nestedContext && !!nestedContext.horizontal === !!this.props.horizontal);
  };

  _proto.render = function render() {
    if (__DEV__) {
      var flatStyles = flattenStyle(this.props.contentContainerStyle);
      (0, _warning.default)(flatStyles == null || flatStyles.flexWrap !== 'wrap', '`flexWrap: `wrap`` is not supported with the `VirtualizedList` components.' + 'Consider using `numColumns` with `FlatList` instead.');
    }

    var _this$props7 = this.props,
        ListEmptyComponent = _this$props7.ListEmptyComponent,
        ListFooterComponent = _this$props7.ListFooterComponent,
        ListHeaderComponent = _this$props7.ListHeaderComponent;
    var _this$props8 = this.props,
        data = _this$props8.data,
        horizontal = _this$props8.horizontal;

    var isVirtualizationDisabled = this._isVirtualizationDisabled();

    var inversionStyle = this.props.inverted ? this.props.horizontal ? styles.horizontallyInverted : styles.verticallyInverted : null;
    var cells = [];
    var stickyIndicesFromProps = new Set(this.props.stickyHeaderIndices);
    var stickyHeaderIndices = [];

    if (ListHeaderComponent) {
      if (stickyIndicesFromProps.has(0)) {
        stickyHeaderIndices.push(0);
      }

      var element = _react.default.isValidElement(ListHeaderComponent) ? ListHeaderComponent : // $FlowFixMe
      _react.default.createElement(ListHeaderComponent, null);
      cells.push(_react.default.createElement(VirtualizedCellWrapper, {
        cellKey: this._getCellKey() + '-header',
        key: "$header"
      }, _react.default.createElement(_View.default, {
        onLayout: this._onLayoutHeader,
        style: inversionStyle
      }, element)));
    }

    var itemCount = this.props.getItemCount(data);

    if (itemCount > 0) {
      _usedIndexForKey = false;
      var spacerKey = !horizontal ? 'height' : 'width';
      var lastInitialIndex = this.props.initialScrollIndex ? -1 : this.props.initialNumToRender - 1;
      var _this$state = this.state,
          first = _this$state.first,
          last = _this$state.last;

      this._pushCells(cells, stickyHeaderIndices, stickyIndicesFromProps, 0, lastInitialIndex, inversionStyle);

      var firstAfterInitial = Math.max(lastInitialIndex + 1, first);

      if (!isVirtualizationDisabled && first > lastInitialIndex + 1) {
        var insertedStickySpacer = false;

        if (stickyIndicesFromProps.size > 0) {
          var stickyOffset = ListHeaderComponent ? 1 : 0; // See if there are any sticky headers in the virtualized space that we need to render.

          for (var ii = firstAfterInitial - 1; ii > lastInitialIndex; ii--) {
            if (stickyIndicesFromProps.has(ii + stickyOffset)) {
              var _ref3, _ref4;

              var initBlock = this._getFrameMetricsApprox(lastInitialIndex);

              var stickyBlock = this._getFrameMetricsApprox(ii);

              var leadSpace = stickyBlock.offset - (initBlock.offset + initBlock.length);
              cells.push(_react.default.createElement(_View.default, {
                key: "$sticky_lead",
                style: (_ref3 = {}, _ref3[spacerKey] = leadSpace, _ref3)
              }));

              this._pushCells(cells, stickyHeaderIndices, stickyIndicesFromProps, ii, ii, inversionStyle);

              var trailSpace = this._getFrameMetricsApprox(first).offset - (stickyBlock.offset + stickyBlock.length);
              cells.push(_react.default.createElement(_View.default, {
                key: "$sticky_trail",
                style: (_ref4 = {}, _ref4[spacerKey] = trailSpace, _ref4)
              }));
              insertedStickySpacer = true;
              break;
            }
          }
        }

        if (!insertedStickySpacer) {
          var _ref5;

          var _initBlock = this._getFrameMetricsApprox(lastInitialIndex);

          var firstSpace = this._getFrameMetricsApprox(first).offset - (_initBlock.offset + _initBlock.length);

          cells.push(_react.default.createElement(_View.default, {
            key: "$lead_spacer",
            style: (_ref5 = {}, _ref5[spacerKey] = firstSpace, _ref5)
          }));
        }
      }

      this._pushCells(cells, stickyHeaderIndices, stickyIndicesFromProps, firstAfterInitial, last, inversionStyle);

      if (!this._hasWarned.keys && _usedIndexForKey) {
        console.warn('VirtualizedList: missing keys for items, make sure to specify a key property on each ' + 'item or provide a custom keyExtractor.');
        this._hasWarned.keys = true;
      }

      if (!isVirtualizationDisabled && last < itemCount - 1) {
        var _ref6;

        var lastFrame = this._getFrameMetricsApprox(last); // Without getItemLayout, we limit our tail spacer to the _highestMeasuredFrameIndex to
        // prevent the user for hyperscrolling into un-measured area because otherwise content will
        // likely jump around as it renders in above the viewport.


        var end = this.props.getItemLayout ? itemCount - 1 : Math.min(itemCount - 1, this._highestMeasuredFrameIndex);

        var endFrame = this._getFrameMetricsApprox(end);

        var tailSpacerLength = endFrame.offset + endFrame.length - (lastFrame.offset + lastFrame.length);
        cells.push(_react.default.createElement(_View.default, {
          key: "$tail_spacer",
          style: (_ref6 = {}, _ref6[spacerKey] = tailSpacerLength, _ref6)
        }));
      }
    } else if (ListEmptyComponent) {
      var _element = _react.default.isValidElement(ListEmptyComponent) ? ListEmptyComponent : // $FlowFixMe
      _react.default.createElement(ListEmptyComponent, null);

      cells.push(_react.default.createElement(_View.default, {
        key: "$empty",
        onLayout: this._onLayoutEmpty,
        style: inversionStyle
      }, _element));
    }

    if (ListFooterComponent) {
      var _element2 = _react.default.isValidElement(ListFooterComponent) ? ListFooterComponent : // $FlowFixMe
      _react.default.createElement(ListFooterComponent, null);

      cells.push(_react.default.createElement(VirtualizedCellWrapper, {
        cellKey: this._getCellKey() + '-footer',
        key: "$footer"
      }, _react.default.createElement(_View.default, {
        onLayout: this._onLayoutFooter,
        style: inversionStyle
      }, _element2)));
    }

    var scrollProps = _objectSpread({}, this.props, {
      onContentSizeChange: this._onContentSizeChange,
      onLayout: this._onLayout,
      onScroll: this._onScroll,
      onScrollBeginDrag: this._onScrollBeginDrag,
      onScrollEndDrag: this._onScrollEndDrag,
      onMomentumScrollEnd: this._onMomentumScrollEnd,
      scrollEventThrottle: this.props.scrollEventThrottle,
      // TODO: Android support
      invertStickyHeaders: this.props.invertStickyHeaders !== undefined ? this.props.invertStickyHeaders : this.props.inverted,
      stickyHeaderIndices: stickyHeaderIndices
    });

    if (inversionStyle) {
      scrollProps.style = [inversionStyle, this.props.style];
    }

    this._hasMore = this.state.last < this.props.getItemCount(this.props.data) - 1;

    var ret = _react.default.cloneElement((this.props.renderScrollComponent || this._defaultRenderScrollComponent)(scrollProps), {
      ref: this._captureScrollRef
    }, cells);

    if (this.props.debug) {
      return _react.default.createElement(_View.default, {
        style: {
          flex: 1
        }
      }, ret, this._renderDebugOverlay());
    } else {
      return ret;
    }
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var _this$props9 = this.props,
        data = _this$props9.data,
        extraData = _this$props9.extraData;

    if (data !== prevProps.data || extraData !== prevProps.extraData) {
      this._hasDataChangedSinceEndReached = true; // clear the viewableIndices cache to also trigger
      // the onViewableItemsChanged callback with the new data

      this._viewabilityTuples.forEach(function (tuple) {
        tuple.viewabilityHelper.resetViewableIndices();
      });
    }

    this._scheduleCellsToRenderUpdate();
  };

  _proto._computeBlankness = function _computeBlankness() {
    this._fillRateHelper.computeBlankness(this.props, this.state, this._scrollMetrics);
  };

  _proto._onCellLayout = function _onCellLayout(e, cellKey, index) {
    var layout = e.nativeEvent.layout;
    var next = {
      offset: this._selectOffset(layout),
      length: this._selectLength(layout),
      index: index,
      inLayout: true
    };
    var curr = this._frames[cellKey];

    if (!curr || next.offset !== curr.offset || next.length !== curr.length || index !== curr.index) {
      this._totalCellLength += next.length - (curr ? curr.length : 0);
      this._totalCellsMeasured += curr ? 0 : 1;
      this._averageCellLength = this._totalCellLength / this._totalCellsMeasured;
      this._frames[cellKey] = next;
      this._highestMeasuredFrameIndex = Math.max(this._highestMeasuredFrameIndex, index);

      this._scheduleCellsToRenderUpdate();
    } else {
      this._frames[cellKey].inLayout = true;
    }

    this._computeBlankness();
  };

  _proto._measureLayoutRelativeToContainingList = function _measureLayoutRelativeToContainingList() {
    var _this3 = this;

    _UIManager.default.measureLayout((0, _findNodeHandle.default)(this), (0, _findNodeHandle.default)(this.context.virtualizedList.getOutermostParentListRef()), function (error) {
      console.warn("VirtualizedList: Encountered an error while measuring a list's" + ' offset from its containing VirtualizedList.');
    }, function (x, y, width, height) {
      _this3._offsetFromParentVirtualizedList = _this3._selectOffset({
        x: x,
        y: y
      });
      _this3._scrollMetrics.contentLength = _this3._selectLength({
        width: width,
        height: height
      });

      var scrollMetrics = _this3._convertParentScrollMetrics(_this3.context.virtualizedList.getScrollMetrics());

      _this3._scrollMetrics.visibleLength = scrollMetrics.visibleLength;
      _this3._scrollMetrics.offset = scrollMetrics.offset;
    });
  };

  _proto._renderDebugOverlay = function _renderDebugOverlay() {
    var normalize = this._scrollMetrics.visibleLength / this._scrollMetrics.contentLength;
    var framesInLayout = [];
    var itemCount = this.props.getItemCount(this.props.data);

    for (var ii = 0; ii < itemCount; ii++) {
      var frame = this._getFrameMetricsApprox(ii);

      if (frame.inLayout) {
        framesInLayout.push(frame);
      }
    }

    var windowTop = this._getFrameMetricsApprox(this.state.first).offset;

    var frameLast = this._getFrameMetricsApprox(this.state.last);

    var windowLen = frameLast.offset + frameLast.length - windowTop;
    var visTop = this._scrollMetrics.offset;
    var visLen = this._scrollMetrics.visibleLength;
    var baseStyle = {
      position: 'absolute',
      top: 0,
      right: 0
    };
    return _react.default.createElement(_View.default, {
      style: _objectSpread({}, baseStyle, {
        bottom: 0,
        width: 20,
        borderColor: 'blue',
        borderWidth: 1
      })
    }, framesInLayout.map(function (f, ii) {
      return _react.default.createElement(_View.default, {
        key: 'f' + ii,
        style: _objectSpread({}, baseStyle, {
          left: 0,
          top: f.offset * normalize,
          height: f.length * normalize,
          backgroundColor: 'orange'
        })
      });
    }), _react.default.createElement(_View.default, {
      style: _objectSpread({}, baseStyle, {
        left: 0,
        top: windowTop * normalize,
        height: windowLen * normalize,
        borderColor: 'green',
        borderWidth: 2
      })
    }), _react.default.createElement(_View.default, {
      style: _objectSpread({}, baseStyle, {
        left: 0,
        top: visTop * normalize,
        height: visLen * normalize,
        borderColor: 'red',
        borderWidth: 2
      })
    }));
  };

  _proto._selectLength = function _selectLength(metrics) {
    return !this.props.horizontal ? metrics.height : metrics.width;
  };

  _proto._selectOffset = function _selectOffset(metrics) {
    return !this.props.horizontal ? metrics.y : metrics.x;
  };

  _proto._maybeCallOnEndReached = function _maybeCallOnEndReached() {
    var _this$props10 = this.props,
        data = _this$props10.data,
        getItemCount = _this$props10.getItemCount,
        onEndReached = _this$props10.onEndReached,
        onEndReachedThreshold = _this$props10.onEndReachedThreshold;
    var _this$_scrollMetrics2 = this._scrollMetrics,
        contentLength = _this$_scrollMetrics2.contentLength,
        visibleLength = _this$_scrollMetrics2.visibleLength,
        offset = _this$_scrollMetrics2.offset;
    var distanceFromEnd = contentLength - visibleLength - offset;

    if (onEndReached && this.state.last === getItemCount(data) - 1 &&
    /* $FlowFixMe(>=0.63.0 site=react_native_fb) This comment suppresses an
     * error found when Flow v0.63 was deployed. To see the error delete this
     * comment and run Flow. */
    distanceFromEnd < onEndReachedThreshold * visibleLength && (this._hasDataChangedSinceEndReached || this._scrollMetrics.contentLength !== this._sentEndForContentLength)) {
      // Only call onEndReached once for a given dataset + content length.
      this._hasDataChangedSinceEndReached = false;
      this._sentEndForContentLength = this._scrollMetrics.contentLength;
      onEndReached({
        distanceFromEnd: distanceFromEnd
      });
    }
  };

  _proto._scheduleCellsToRenderUpdate = function _scheduleCellsToRenderUpdate() {
    var _this$state2 = this.state,
        first = _this$state2.first,
        last = _this$state2.last;
    var _this$_scrollMetrics3 = this._scrollMetrics,
        offset = _this$_scrollMetrics3.offset,
        visibleLength = _this$_scrollMetrics3.visibleLength,
        velocity = _this$_scrollMetrics3.velocity;
    var itemCount = this.props.getItemCount(this.props.data);
    var hiPri = false;

    if (first > 0 || last < itemCount - 1) {
      var distTop = offset - this._getFrameMetricsApprox(first).offset;

      var distBottom = this._getFrameMetricsApprox(last).offset - (offset + visibleLength);
      var scrollingThreshold =
      /* $FlowFixMe(>=0.63.0 site=react_native_fb) This comment suppresses an
       * error found when Flow v0.63 was deployed. To see the error delete
       * this comment and run Flow. */
      this.props.onEndReachedThreshold * visibleLength / 2;
      hiPri = Math.min(distTop, distBottom) < 0 || velocity < -2 && distTop < scrollingThreshold || velocity > 2 && distBottom < scrollingThreshold;
    } // Only trigger high-priority updates if we've actually rendered cells,
    // and with that size estimate, accurately compute how many cells we should render.
    // Otherwise, it would just render as many cells as it can (of zero dimension),
    // each time through attempting to render more (limited by maxToRenderPerBatch),
    // starving the renderer from actually laying out the objects and computing _averageCellLength.


    if (hiPri && this._averageCellLength) {
      // Don't worry about interactions when scrolling quickly; focus on filling content as fast
      // as possible.
      this._updateCellsToRenderBatcher.dispose({
        abort: true
      });

      this._updateCellsToRender();

      return;
    } else {
      this._updateCellsToRenderBatcher.schedule();
    }
  };

  _proto._updateViewableItems = function _updateViewableItems(data) {
    var _this4 = this;

    var getItemCount = this.props.getItemCount;

    this._viewabilityTuples.forEach(function (tuple) {
      tuple.viewabilityHelper.onUpdate(getItemCount(data), _this4._scrollMetrics.offset, _this4._scrollMetrics.visibleLength, _this4._getFrameMetrics, _this4._createViewToken, tuple.onViewableItemsChanged, _this4.state);
    });
  };

  return VirtualizedList;
}(_react.default.PureComponent);

VirtualizedList.defaultProps = {
  disableVirtualization: process.env.NODE_ENV === 'test',
  horizontal: false,
  initialNumToRender: 10,
  keyExtractor: function keyExtractor(item, index) {
    if (item.key != null) {
      return item.key;
    }

    _usedIndexForKey = true;
    return String(index);
  },
  maxToRenderPerBatch: 10,
  onEndReachedThreshold: 2,
  // multiples of length
  scrollEventThrottle: 50,
  updateCellsBatchingPeriod: 50,
  windowSize: 21 // multiples of length

};
VirtualizedList.contextTypes = {
  virtualizedCell: _propTypes.default.shape({
    cellKey: _propTypes.default.string
  }),
  virtualizedList: _propTypes.default.shape({
    getScrollMetrics: _propTypes.default.func,
    horizontal: _propTypes.default.bool,
    getOutermostParentListRef: _propTypes.default.func,
    getNestedChildState: _propTypes.default.func,
    registerAsNestedChild: _propTypes.default.func,
    unregisterAsNestedChild: _propTypes.default.func
  })
};
VirtualizedList.childContextTypes = {
  virtualizedList: _propTypes.default.shape({
    getScrollMetrics: _propTypes.default.func,
    horizontal: _propTypes.default.bool,
    getOutermostParentListRef: _propTypes.default.func,
    getNestedChildState: _propTypes.default.func,
    registerAsNestedChild: _propTypes.default.func,
    unregisterAsNestedChild: _propTypes.default.func
  })
};

var CellRenderer =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(CellRenderer, _React$Component);

  function CellRenderer() {
    var _this5;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this5 = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this5.state = {
      separatorProps: {
        highlighted: false,
        leadingItem: _this5.props.item
      }
    };
    _this5._separators = {
      highlight: function highlight() {
        var _this5$props = _this5.props,
            cellKey = _this5$props.cellKey,
            prevCellKey = _this5$props.prevCellKey;

        _this5.props.onUpdateSeparators([cellKey, prevCellKey], {
          highlighted: true
        });
      },
      unhighlight: function unhighlight() {
        var _this5$props2 = _this5.props,
            cellKey = _this5$props2.cellKey,
            prevCellKey = _this5$props2.prevCellKey;

        _this5.props.onUpdateSeparators([cellKey, prevCellKey], {
          highlighted: false
        });
      },
      updateProps: function updateProps(select, newProps) {
        var _this5$props3 = _this5.props,
            cellKey = _this5$props3.cellKey,
            prevCellKey = _this5$props3.prevCellKey;

        _this5.props.onUpdateSeparators([select === 'leading' ? prevCellKey : cellKey], newProps);
      }
    };
    return _this5;
  }

  var _proto2 = CellRenderer.prototype;

  _proto2.getChildContext = function getChildContext() {
    return {
      virtualizedCell: {
        cellKey: this.props.cellKey
      }
    };
  } // TODO: consider factoring separator stuff out of VirtualizedList into FlatList since it's not
  // reused by SectionList and we can keep VirtualizedList simpler.
  ;

  _proto2.updateSeparatorProps = function updateSeparatorProps(newProps) {
    this.setState(function (state) {
      return {
        separatorProps: _objectSpread({}, state.separatorProps, newProps)
      };
    });
  };

  _proto2.componentWillUnmount = function componentWillUnmount() {
    this.props.onUnmount(this.props.cellKey);
  };

  _proto2.render = function render() {
    var _this$props11 = this.props,
        CellRendererComponent = _this$props11.CellRendererComponent,
        ItemSeparatorComponent = _this$props11.ItemSeparatorComponent,
        fillRateHelper = _this$props11.fillRateHelper,
        horizontal = _this$props11.horizontal,
        item = _this$props11.item,
        index = _this$props11.index,
        inversionStyle = _this$props11.inversionStyle,
        parentProps = _this$props11.parentProps;
    var renderItem = parentProps.renderItem,
        getItemLayout = parentProps.getItemLayout;
    (0, _invariant.default)(renderItem, 'no renderItem!');
    var element = renderItem({
      item: item,
      index: index,
      separators: this._separators
    });
    var onLayout = getItemLayout && !parentProps.debug && !fillRateHelper.enabled() ? undefined : this.props.onLayout; // NOTE: that when this is a sticky header, `onLayout` will get automatically extracted and
    // called explicitly by `ScrollViewStickyHeader`.

    var itemSeparator = ItemSeparatorComponent && _react.default.createElement(ItemSeparatorComponent, this.state.separatorProps);

    var cellStyle = inversionStyle ? horizontal ? [styles.rowReverse, inversionStyle] : [styles.columnReverse, inversionStyle] : horizontal ? [styles.row, inversionStyle] : inversionStyle;

    if (!CellRendererComponent) {
      return _react.default.createElement(_View.default, {
        style: cellStyle,
        onLayout: onLayout
      }, element, itemSeparator);
    }

    return _react.default.createElement(CellRendererComponent, _extends({}, this.props, {
      style: cellStyle,
      onLayout: onLayout
    }), element, itemSeparator);
  };

  return CellRenderer;
}(_react.default.Component);

CellRenderer.childContextTypes = {
  virtualizedCell: _propTypes.default.shape({
    cellKey: _propTypes.default.string
  })
};

var VirtualizedCellWrapper =
/*#__PURE__*/
function (_React$Component2) {
  _inheritsLoose(VirtualizedCellWrapper, _React$Component2);

  function VirtualizedCellWrapper() {
    return _React$Component2.apply(this, arguments) || this;
  }

  var _proto3 = VirtualizedCellWrapper.prototype;

  _proto3.getChildContext = function getChildContext() {
    return {
      virtualizedCell: {
        cellKey: this.props.cellKey
      }
    };
  };

  _proto3.render = function render() {
    return this.props.children;
  };

  return VirtualizedCellWrapper;
}(_react.default.Component);

VirtualizedCellWrapper.childContextTypes = {
  virtualizedCell: _propTypes.default.shape({
    cellKey: _propTypes.default.string
  })
};

var styles = _StyleSheet.default.create({
  verticallyInverted: {
    transform: [{
      scaleY: -1
    }]
  },
  horizontallyInverted: {
    transform: [{
      scaleX: -1
    }]
  },
  row: {
    flexDirection: 'row'
  },
  rowReverse: {
    flexDirection: 'row-reverse'
  },
  columnReverse: {
    flexDirection: 'column-reverse'
  }
});

var _default = VirtualizedList;
exports.default = _default;
module.exports = exports.default;