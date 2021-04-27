"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _View = _interopRequireDefault(require("../../../exports/View"));

var _VirtualizedList = _interopRequireDefault(require("../VirtualizedList"));

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

/**
 * Right now this just flattens everything into one list and uses VirtualizedList under the
 * hood. The only operation that might not scale well is concatting the data arrays of all the
 * sections when new props are received, which should be plenty fast for up to ~10,000 items.
 */
var VirtualizedSectionList =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(VirtualizedSectionList, _React$PureComponent);

  var _proto = VirtualizedSectionList.prototype;

  _proto.scrollToLocation = function scrollToLocation(params) {
    var index = params.itemIndex + 1;

    for (var ii = 0; ii < params.sectionIndex; ii++) {
      index += this.props.sections[ii].data.length + 2;
    }

    var toIndexParams = _objectSpread({}, params, {
      index: index
    });

    this._listRef.scrollToIndex(toIndexParams);
  };

  _proto.getListRef = function getListRef() {
    return this._listRef;
  };

  _proto._subExtractor = function _subExtractor(index) {
    var itemIndex = index;
    var defaultKeyExtractor = this.props.keyExtractor;

    for (var ii = 0; ii < this.props.sections.length; ii++) {
      var section = this.props.sections[ii];
      var key = section.key || String(ii);
      itemIndex -= 1; // The section adds an item for the header

      if (itemIndex >= section.data.length + 1) {
        itemIndex -= section.data.length + 1; // The section adds an item for the footer.
      } else if (itemIndex === -1) {
        return {
          section: section,
          key: key + ':header',
          index: null,
          header: true,
          trailingSection: this.props.sections[ii + 1]
        };
      } else if (itemIndex === section.data.length) {
        return {
          section: section,
          key: key + ':footer',
          index: null,
          header: false,
          trailingSection: this.props.sections[ii + 1]
        };
      } else {
        var keyExtractor = section.keyExtractor || defaultKeyExtractor;
        return {
          section: section,
          key: key + ':' + keyExtractor(section.data[itemIndex], itemIndex),
          index: itemIndex,
          leadingItem: section.data[itemIndex - 1],
          leadingSection: this.props.sections[ii - 1],
          trailingItem: section.data[itemIndex + 1],
          trailingSection: this.props.sections[ii + 1]
        };
      }
    }
  };

  _proto._getSeparatorComponent = function _getSeparatorComponent(index, info) {
    info = info || this._subExtractor(index);

    if (!info) {
      return null;
    }

    var ItemSeparatorComponent = info.section.ItemSeparatorComponent || this.props.ItemSeparatorComponent;
    var SectionSeparatorComponent = this.props.SectionSeparatorComponent;
    var isLastItemInList = index === this.state.childProps.getItemCount() - 1;
    var isLastItemInSection = info.index === info.section.data.length - 1;

    if (SectionSeparatorComponent && isLastItemInSection) {
      return SectionSeparatorComponent;
    }

    if (ItemSeparatorComponent && !isLastItemInSection && !isLastItemInList) {
      return ItemSeparatorComponent;
    }

    return null;
  };

  _proto._computeState = function _computeState(props) {
    var offset = props.ListHeaderComponent ? 1 : 0;
    var stickyHeaderIndices = [];
    var itemCount = props.sections.reduce(function (v, section) {
      stickyHeaderIndices.push(v + offset);
      return v + section.data.length + 2; // Add two for the section header and footer.
    }, 0);
    return {
      childProps: _objectSpread({}, props, {
        renderItem: this._renderItem,
        ItemSeparatorComponent: undefined,
        // Rendered with renderItem
        data: props.sections,
        getItemCount: function getItemCount() {
          return itemCount;
        },
        getItem: getItem,
        keyExtractor: this._keyExtractor,
        onViewableItemsChanged: props.onViewableItemsChanged ? this._onViewableItemsChanged : undefined,
        stickyHeaderIndices: props.stickySectionHeadersEnabled ? stickyHeaderIndices : undefined
      })
    };
  };

  function VirtualizedSectionList(props, context) {
    var _this;

    _this = _React$PureComponent.call(this, props, context) || this;

    _this._keyExtractor = function (item, index) {
      var info = _this._subExtractor(index);

      return info && info.key || String(index);
    };

    _this._convertViewable = function (viewable) {
      (0, _invariant.default)(viewable.index != null, 'Received a broken ViewToken');

      var info = _this._subExtractor(viewable.index);

      if (!info) {
        return null;
      }

      var keyExtractor = info.section.keyExtractor || _this.props.keyExtractor;
      return _objectSpread({}, viewable, {
        index: info.index,

        /* $FlowFixMe(>=0.63.0 site=react_native_fb) This comment suppresses an
         * error found when Flow v0.63 was deployed. To see the error delete this
         * comment and run Flow. */
        key: keyExtractor(viewable.item, info.index),
        section: info.section
      });
    };

    _this._onViewableItemsChanged = function (_ref) {
      var viewableItems = _ref.viewableItems,
          changed = _ref.changed;

      if (_this.props.onViewableItemsChanged) {
        _this.props.onViewableItemsChanged({
          viewableItems: viewableItems.map(_this._convertViewable, _assertThisInitialized(_assertThisInitialized(_this))).filter(Boolean),
          changed: changed.map(_this._convertViewable, _assertThisInitialized(_assertThisInitialized(_this))).filter(Boolean)
        });
      }
    };

    _this._renderItem = function (_ref2) {
      var item = _ref2.item,
          index = _ref2.index;

      var info = _this._subExtractor(index);

      if (!info) {
        return null;
      }

      var infoIndex = info.index;

      if (infoIndex == null) {
        var section = info.section;

        if (info.header === true) {
          var renderSectionHeader = _this.props.renderSectionHeader;
          return renderSectionHeader ? renderSectionHeader({
            section: section
          }) : null;
        } else {
          var renderSectionFooter = _this.props.renderSectionFooter;
          return renderSectionFooter ? renderSectionFooter({
            section: section
          }) : null;
        }
      } else {
        var renderItem = info.section.renderItem || _this.props.renderItem;

        var SeparatorComponent = _this._getSeparatorComponent(index, info);

        (0, _invariant.default)(renderItem, 'no renderItem!');
        return _react.default.createElement(ItemWithSeparator, {
          SeparatorComponent: SeparatorComponent,
          LeadingSeparatorComponent: infoIndex === 0 ? _this.props.SectionSeparatorComponent : undefined,
          cellKey: info.key,
          index: infoIndex,
          item: item,
          leadingItem: info.leadingItem,
          leadingSection: info.leadingSection,
          onUpdateSeparator: _this._onUpdateSeparator,
          prevCellKey: (_this._subExtractor(index - 1) || {}).key,
          ref: function ref(_ref3) {
            _this._cellRefs[info.key] = _ref3;
          },
          renderItem: renderItem,
          section: info.section,
          trailingItem: info.trailingItem,
          trailingSection: info.trailingSection
        });
      }
    };

    _this._onUpdateSeparator = function (key, newProps) {
      var ref = _this._cellRefs[key];
      ref && ref.updateSeparatorProps(newProps);
    };

    _this._cellRefs = {};

    _this._captureRef = function (ref) {
      /* $FlowFixMe(>=0.53.0 site=react_native_fb,react_native_oss) This comment
       * suppresses an error when upgrading Flow's support for React. To see the
       * error delete this comment and run Flow. */
      _this._listRef = ref;
    };

    _this.state = _this._computeState(props);
    return _this;
  }

  _proto.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(this._computeState(nextProps));
  };

  _proto.render = function render() {
    return _react.default.createElement(_VirtualizedList.default, _extends({}, this.state.childProps, {
      ref: this._captureRef
    }));
  };

  return VirtualizedSectionList;
}(_react.default.PureComponent);

VirtualizedSectionList.defaultProps = _objectSpread({}, _VirtualizedList.default.defaultProps, {
  data: []
});

var ItemWithSeparator =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(ItemWithSeparator, _React$Component);

  function ItemWithSeparator() {
    var _this2;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this2 = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this2.state = {
      separatorProps: {
        highlighted: false,
        leadingItem: _this2.props.item,
        leadingSection: _this2.props.leadingSection,
        section: _this2.props.section,
        trailingItem: _this2.props.trailingItem,
        trailingSection: _this2.props.trailingSection
      },
      leadingSeparatorProps: {
        highlighted: false,
        leadingItem: _this2.props.leadingItem,
        leadingSection: _this2.props.leadingSection,
        section: _this2.props.section,
        trailingItem: _this2.props.item,
        trailingSection: _this2.props.trailingSection
      }
    };
    _this2._separators = {
      highlight: function highlight() {
        ['leading', 'trailing'].forEach(function (s) {
          return _this2._separators.updateProps(s, {
            highlighted: true
          });
        });
      },
      unhighlight: function unhighlight() {
        ['leading', 'trailing'].forEach(function (s) {
          return _this2._separators.updateProps(s, {
            highlighted: false
          });
        });
      },
      updateProps: function updateProps(select, newProps) {
        var _this2$props = _this2.props,
            LeadingSeparatorComponent = _this2$props.LeadingSeparatorComponent,
            cellKey = _this2$props.cellKey,
            prevCellKey = _this2$props.prevCellKey;

        if (select === 'leading' && LeadingSeparatorComponent) {
          _this2.setState(function (state) {
            return {
              leadingSeparatorProps: _objectSpread({}, state.leadingSeparatorProps, newProps)
            };
          });
        } else {
          _this2.props.onUpdateSeparator(select === 'leading' && prevCellKey || cellKey, newProps);
        }
      }
    };
    return _this2;
  }

  var _proto2 = ItemWithSeparator.prototype;

  _proto2.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(props) {
    var _this3 = this;

    this.setState(function (state) {
      return {
        separatorProps: _objectSpread({}, _this3.state.separatorProps, {
          leadingItem: props.item,
          leadingSection: props.leadingSection,
          section: props.section,
          trailingItem: props.trailingItem,
          trailingSection: props.trailingSection
        }),
        leadingSeparatorProps: _objectSpread({}, _this3.state.leadingSeparatorProps, {
          leadingItem: props.leadingItem,
          leadingSection: props.leadingSection,
          section: props.section,
          trailingItem: props.item,
          trailingSection: props.trailingSection
        })
      };
    });
  };

  _proto2.updateSeparatorProps = function updateSeparatorProps(newProps) {
    this.setState(function (state) {
      return {
        separatorProps: _objectSpread({}, state.separatorProps, newProps)
      };
    });
  };

  _proto2.render = function render() {
    var _this$props = this.props,
        LeadingSeparatorComponent = _this$props.LeadingSeparatorComponent,
        SeparatorComponent = _this$props.SeparatorComponent,
        item = _this$props.item,
        index = _this$props.index,
        section = _this$props.section;
    var element = this.props.renderItem({
      item: item,
      index: index,
      section: section,
      separators: this._separators
    });

    var leadingSeparator = LeadingSeparatorComponent && _react.default.createElement(LeadingSeparatorComponent, this.state.leadingSeparatorProps);

    var separator = SeparatorComponent && _react.default.createElement(SeparatorComponent, this.state.separatorProps);

    return leadingSeparator || separator ? _react.default.createElement(_View.default, null, leadingSeparator, element, separator) : element;
  };

  return ItemWithSeparator;
}(_react.default.Component);

function getItem(sections, index) {
  if (!sections) {
    return null;
  }

  var itemIdx = index - 1;

  for (var ii = 0; ii < sections.length; ii++) {
    if (itemIdx === -1 || itemIdx === sections[ii].data.length) {
      // We intend for there to be overflow by one on both ends of the list.
      // This will be for headers and footers. When returning a header or footer
      // item the section itself is the item.
      return sections[ii];
    } else if (itemIdx < sections[ii].data.length) {
      // If we are in the bounds of the list's data then return the item.
      return sections[ii].data[itemIdx];
    } else {
      itemIdx -= sections[ii].data.length + 2; // Add two for the header and footer
    }
  }

  return null;
}

var _default = VirtualizedSectionList;
exports.default = _default;
module.exports = exports.default;