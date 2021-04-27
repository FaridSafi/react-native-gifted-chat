"use strict";

exports.__esModule = true;
exports.default = void 0;

var _propTypes = require("prop-types");

/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
var OverflowPropType = (0, _propTypes.oneOf)(['auto', 'hidden', 'scroll', 'visible']);
var hiddenOrVisible = (0, _propTypes.oneOf)(['hidden', 'visible']);
var numberOrString = (0, _propTypes.oneOfType)([_propTypes.number, _propTypes.string]);
var LayoutPropTypes = {
  alignContent: (0, _propTypes.oneOf)(['center', 'flex-end', 'flex-start', 'space-around', 'space-between', 'stretch']),
  alignItems: (0, _propTypes.oneOf)(['baseline', 'center', 'flex-end', 'flex-start', 'stretch']),
  alignSelf: (0, _propTypes.oneOf)(['auto', 'baseline', 'center', 'flex-end', 'flex-start', 'stretch']),
  backfaceVisibility: hiddenOrVisible,
  borderWidth: numberOrString,
  borderBottomWidth: numberOrString,
  borderEndWidth: numberOrString,
  borderLeftWidth: numberOrString,
  borderRightWidth: numberOrString,
  borderStartWidth: numberOrString,
  borderTopWidth: numberOrString,
  bottom: numberOrString,
  boxSizing: _propTypes.string,
  direction: (0, _propTypes.oneOf)(['inherit', 'ltr', 'rtl']),
  display: _propTypes.string,
  end: numberOrString,
  flex: _propTypes.number,
  flexBasis: numberOrString,
  flexDirection: (0, _propTypes.oneOf)(['column', 'column-reverse', 'row', 'row-reverse']),
  flexGrow: _propTypes.number,
  flexShrink: _propTypes.number,
  flexWrap: (0, _propTypes.oneOf)(['nowrap', 'wrap', 'wrap-reverse']),
  height: numberOrString,
  justifyContent: (0, _propTypes.oneOf)(['center', 'flex-end', 'flex-start', 'space-around', 'space-between', 'space-evenly']),
  left: numberOrString,
  margin: numberOrString,
  marginBottom: numberOrString,
  marginHorizontal: numberOrString,
  marginEnd: numberOrString,
  marginLeft: numberOrString,
  marginRight: numberOrString,
  marginStart: numberOrString,
  marginTop: numberOrString,
  marginVertical: numberOrString,
  maxHeight: numberOrString,
  maxWidth: numberOrString,
  minHeight: numberOrString,
  minWidth: numberOrString,
  order: _propTypes.number,
  overflow: OverflowPropType,
  overflowX: OverflowPropType,
  overflowY: OverflowPropType,
  padding: numberOrString,
  paddingBottom: numberOrString,
  paddingHorizontal: numberOrString,
  paddingEnd: numberOrString,
  paddingLeft: numberOrString,
  paddingRight: numberOrString,
  paddingStart: numberOrString,
  paddingTop: numberOrString,
  paddingVertical: numberOrString,
  position: (0, _propTypes.oneOf)(['absolute', 'fixed', 'relative', 'static', 'sticky']),
  right: numberOrString,
  start: numberOrString,
  top: numberOrString,
  visibility: hiddenOrVisible,
  width: numberOrString,
  zIndex: _propTypes.number,

  /**
   * @platform unsupported
   */
  aspectRatio: _propTypes.number,

  /**
   * @platform web
   */
  gridAutoColumns: _propTypes.string,
  gridAutoFlow: _propTypes.string,
  gridAutoRows: _propTypes.string,
  gridColumnEnd: _propTypes.string,
  gridColumnGap: _propTypes.string,
  gridColumnStart: _propTypes.string,
  gridRowEnd: _propTypes.string,
  gridRowGap: _propTypes.string,
  gridRowStart: _propTypes.string,
  gridTemplateColumns: _propTypes.string,
  gridTemplateRows: _propTypes.string,
  gridTemplateAreas: _propTypes.string
};
var _default = LayoutPropTypes;
exports.default = _default;
module.exports = exports.default;