"use strict";

exports.__esModule = true;
exports.default = void 0;

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * A Utility class for calculating viewable items based on current metrics like scroll position and
 * layout.
 *
 * An item is said to be in a "viewable" state when any of the following
 * is true for longer than `minimumViewTime` milliseconds (after an interaction if `waitForInteraction`
 * is true):
 *
 * - Occupying >= `viewAreaCoveragePercentThreshold` of the view area XOR fraction of the item
 *   visible in the view area >= `itemVisiblePercentThreshold`.
 * - Entirely visible on screen
 */
var ViewabilityHelper =
/*#__PURE__*/
function () {
  /* $FlowFixMe(>=0.63.0 site=react_native_fb) This comment suppresses an error
   * found when Flow v0.63 was deployed. To see the error delete this comment
   * and run Flow. */
  function ViewabilityHelper(config) {
    if (config === void 0) {
      config = {
        viewAreaCoveragePercentThreshold: 0
      };
    }

    this._hasInteracted = false;
    this._timers = new Set();
    this._viewableIndices = [];
    this._viewableItems = new Map();
    this._config = config;
  }
  /**
   * Cleanup, e.g. on unmount. Clears any pending timers.
   */


  var _proto = ViewabilityHelper.prototype;

  _proto.dispose = function dispose() {
    this._timers.forEach(clearTimeout);
  }
  /**
   * Determines which items are viewable based on the current metrics and config.
   */
  ;

  _proto.computeViewableItems = function computeViewableItems(itemCount, scrollOffset, viewportHeight, getFrameMetrics, renderRange) {
    var _this$_config = this._config,
        itemVisiblePercentThreshold = _this$_config.itemVisiblePercentThreshold,
        viewAreaCoveragePercentThreshold = _this$_config.viewAreaCoveragePercentThreshold;
    var viewAreaMode = viewAreaCoveragePercentThreshold != null;
    var viewablePercentThreshold = viewAreaMode ? viewAreaCoveragePercentThreshold : itemVisiblePercentThreshold;
    (0, _invariant.default)(viewablePercentThreshold != null && itemVisiblePercentThreshold != null !== (viewAreaCoveragePercentThreshold != null), 'Must set exactly one of itemVisiblePercentThreshold or viewAreaCoveragePercentThreshold');
    var viewableIndices = [];

    if (itemCount === 0) {
      return viewableIndices;
    }

    var firstVisible = -1;

    var _ref = renderRange || {
      first: 0,
      last: itemCount - 1
    },
        first = _ref.first,
        last = _ref.last;

    (0, _invariant.default)(last < itemCount, 'Invalid render range ' + JSON.stringify({
      renderRange: renderRange,
      itemCount: itemCount
    }));

    for (var idx = first; idx <= last; idx++) {
      var metrics = getFrameMetrics(idx);

      if (!metrics) {
        continue;
      }

      var top = metrics.offset - scrollOffset;
      var bottom = top + metrics.length;

      if (top < viewportHeight && bottom > 0) {
        firstVisible = idx;

        if (_isViewable(viewAreaMode, viewablePercentThreshold, top, bottom, viewportHeight, metrics.length)) {
          viewableIndices.push(idx);
        }
      } else if (firstVisible >= 0) {
        break;
      }
    }

    return viewableIndices;
  }
  /**
   * Figures out which items are viewable and how that has changed from before and calls
   * `onViewableItemsChanged` as appropriate.
   */
  ;

  _proto.onUpdate = function onUpdate(itemCount, scrollOffset, viewportHeight, getFrameMetrics, createViewToken, onViewableItemsChanged, renderRange) {
    var _this = this;

    if (this._config.waitForInteraction && !this._hasInteracted || itemCount === 0 || !getFrameMetrics(0)) {
      return;
    }

    var viewableIndices = [];

    if (itemCount) {
      viewableIndices = this.computeViewableItems(itemCount, scrollOffset, viewportHeight, getFrameMetrics, renderRange);
    }

    if (this._viewableIndices.length === viewableIndices.length && this._viewableIndices.every(function (v, ii) {
      return v === viewableIndices[ii];
    })) {
      // We might get a lot of scroll events where visibility doesn't change and we don't want to do
      // extra work in those cases.
      return;
    }

    this._viewableIndices = viewableIndices;

    if (this._config.minimumViewTime) {
      var handle = setTimeout(function () {
        _this._timers.delete(handle);

        _this._onUpdateSync(viewableIndices, onViewableItemsChanged, createViewToken);
      }, this._config.minimumViewTime);

      this._timers.add(handle);
    } else {
      this._onUpdateSync(viewableIndices, onViewableItemsChanged, createViewToken);
    }
  }
  /**
   * clean-up cached _viewableIndices to evaluate changed items on next update
   */
  ;

  _proto.resetViewableIndices = function resetViewableIndices() {
    this._viewableIndices = [];
  }
  /**
   * Records that an interaction has happened even if there has been no scroll.
   */
  ;

  _proto.recordInteraction = function recordInteraction() {
    this._hasInteracted = true;
  };

  _proto._onUpdateSync = function _onUpdateSync(viewableIndicesToCheck, onViewableItemsChanged, createViewToken) {
    var _this2 = this;

    // Filter out indices that have gone out of view since this call was scheduled.
    viewableIndicesToCheck = viewableIndicesToCheck.filter(function (ii) {
      return _this2._viewableIndices.includes(ii);
    });
    var prevItems = this._viewableItems;
    var nextItems = new Map(viewableIndicesToCheck.map(function (ii) {
      var viewable = createViewToken(ii, true);
      return [viewable.key, viewable];
    }));
    var changed = [];

    for (var _iterator = nextItems, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref2 = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref2 = _i.value;
      }

      var _ref4 = _ref2,
          key = _ref4[0],
          viewable = _ref4[1];

      if (!prevItems.has(key)) {
        changed.push(viewable);
      }
    }

    for (var _iterator2 = prevItems, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref3 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref3 = _i2.value;
      }

      var _ref5 = _ref3,
          key = _ref5[0],
          viewable = _ref5[1];

      if (!nextItems.has(key)) {
        changed.push(_objectSpread({}, viewable, {
          isViewable: false
        }));
      }
    }

    if (changed.length > 0) {
      this._viewableItems = nextItems;
      onViewableItemsChanged({
        viewableItems: Array.from(nextItems.values()),
        changed: changed,
        viewabilityConfig: this._config
      });
    }
  };

  return ViewabilityHelper;
}();

function _isViewable(viewAreaMode, viewablePercentThreshold, top, bottom, viewportHeight, itemLength) {
  if (_isEntirelyVisible(top, bottom, viewportHeight)) {
    return true;
  } else {
    var pixels = _getPixelsVisible(top, bottom, viewportHeight);

    var percent = 100 * (viewAreaMode ? pixels / viewportHeight : pixels / itemLength);
    return percent >= viewablePercentThreshold;
  }
}

function _getPixelsVisible(top, bottom, viewportHeight) {
  var visibleHeight = Math.min(bottom, viewportHeight) - Math.max(top, 0);
  return Math.max(0, visibleHeight);
}

function _isEntirelyVisible(top, bottom, viewportHeight) {
  return top >= 0 && bottom <= viewportHeight && bottom > top;
}

var _default = ViewabilityHelper;
exports.default = _default;
module.exports = exports.default;