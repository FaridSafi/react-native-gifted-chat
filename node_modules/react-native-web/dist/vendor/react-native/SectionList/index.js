function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
import UnimplementedView from '../../../modules/UnimplementedView';
import Platform from '../../../exports/Platform';
import React from 'react';
import ScrollView from '../../../exports/ScrollView';
import VirtualizedSectionList from '../VirtualizedSectionList';

var defaultProps = _objectSpread({}, VirtualizedSectionList.defaultProps, {
  stickySectionHeadersEnabled: Platform.OS === 'ios'
});

/**
 * A performant interface for rendering sectioned lists, supporting the most handy features:
 *
 *  - Fully cross-platform.
 *  - Configurable viewability callbacks.
 *  - List header support.
 *  - List footer support.
 *  - Item separator support.
 *  - Section header support.
 *  - Section separator support.
 *  - Heterogeneous data and item rendering support.
 *  - Pull to Refresh.
 *  - Scroll loading.
 *
 * If you don't need section support and want a simpler interface, use
 * [`<FlatList>`](/react-native/docs/flatlist.html).
 *
 * Simple Examples:
 *
 *     <SectionList
 *       renderItem={({item}) => <ListItem title={item} />}
 *       renderSectionHeader={({section}) => <Header title={section.title} />}
 *       sections={[ // homogeneous rendering between sections
 *         {data: [...], title: ...},
 *         {data: [...], title: ...},
 *         {data: [...], title: ...},
 *       ]}
 *     />
 *
 *     <SectionList
 *       sections={[ // heterogeneous rendering between sections
 *         {data: [...], renderItem: ...},
 *         {data: [...], renderItem: ...},
 *         {data: [...], renderItem: ...},
 *       ]}
 *     />
 *
 * This is a convenience wrapper around [`<VirtualizedList>`](docs/virtualizedlist.html),
 * and thus inherits its props (as well as those of `ScrollView`) that aren't explicitly listed
 * here, along with the following caveats:
 *
 * - Internal state is not preserved when content scrolls out of the render window. Make sure all
 *   your data is captured in the item data or external stores like Flux, Redux, or Relay.
 * - This is a `PureComponent` which means that it will not re-render if `props` remain shallow-
 *   equal. Make sure that everything your `renderItem` function depends on is passed as a prop
 *   (e.g. `extraData`) that is not `===` after updates, otherwise your UI may not update on
 *   changes. This includes the `data` prop and parent component state.
 * - In order to constrain memory and enable smooth scrolling, content is rendered asynchronously
 *   offscreen. This means it's possible to scroll faster than the fill rate and momentarily see
 *   blank content. This is a tradeoff that can be adjusted to suit the needs of each application,
 *   and we are working on improving it behind the scenes.
 * - By default, the list looks for a `key` prop on each item and uses that for the React key.
 *   Alternatively, you can provide a custom `keyExtractor` prop.
 *
 */
var SectionList =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(SectionList, _React$PureComponent);

  function SectionList() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$PureComponent.call.apply(_React$PureComponent, [this].concat(args)) || this;

    _this._captureRef = function (ref) {
      /* $FlowFixMe(>=0.53.0 site=react_native_fb,react_native_oss) This comment
       * suppresses an error when upgrading Flow's support for React. To see the
       * error delete this comment and run Flow. */
      _this._wrapperListRef = ref;
    };

    return _this;
  }

  var _proto = SectionList.prototype;

  /**
   * Scrolls to the item at the specified `sectionIndex` and `itemIndex` (within the section)
   * positioned in the viewable area such that `viewPosition` 0 places it at the top (and may be
   * covered by a sticky header), 1 at the bottom, and 0.5 centered in the middle. `viewOffset` is a
   * fixed number of pixels to offset the final target position, e.g. to compensate for sticky
   * headers.
   *
   * Note: cannot scroll to locations outside the render window without specifying the
   * `getItemLayout` prop.
   */
  _proto.scrollToLocation = function scrollToLocation(params) {
    this._wrapperListRef.scrollToLocation(params);
  }
  /**
   * Tells the list an interaction has occurred, which should trigger viewability calculations, e.g.
   * if `waitForInteractions` is true and the user has not scrolled. This is typically called by
   * taps on items or by navigation actions.
   */
  ;

  _proto.recordInteraction = function recordInteraction() {
    var listRef = this._wrapperListRef && this._wrapperListRef.getListRef();

    listRef && listRef.recordInteraction();
  }
  /**
   * Displays the scroll indicators momentarily.
   *
   * @platform ios
   */
  ;

  _proto.flashScrollIndicators = function flashScrollIndicators() {
    var listRef = this._wrapperListRef && this._wrapperListRef.getListRef();

    listRef && listRef.flashScrollIndicators();
  }
  /**
   * Provides a handle to the underlying scroll responder.
   */
  ;

  _proto.getScrollResponder = function getScrollResponder() {
    var listRef = this._wrapperListRef && this._wrapperListRef.getListRef();

    if (listRef) {
      return listRef.getScrollResponder();
    }
  };

  _proto.getScrollableNode = function getScrollableNode() {
    var listRef = this._wrapperListRef && this._wrapperListRef.getListRef();

    if (listRef) {
      return listRef.getScrollableNode();
    }
  };

  _proto.setNativeProps = function setNativeProps(props) {
    var listRef = this._wrapperListRef && this._wrapperListRef.getListRef();

    if (listRef) {
      listRef.setNativeProps(props);
    }
  };

  _proto.render = function render() {
    var List = this.props.legacyImplementation ? UnimplementedView : VirtualizedSectionList;
    /* $FlowFixMe(>=0.66.0 site=react_native_fb) This comment suppresses an
     * error found when Flow v0.66 was deployed. To see the error delete this
     * comment and run Flow. */

    return React.createElement(List, _extends({}, this.props, {
      ref: this._captureRef
    }));
  };

  return SectionList;
}(React.PureComponent);

SectionList.defaultProps = defaultProps;
export default SectionList;