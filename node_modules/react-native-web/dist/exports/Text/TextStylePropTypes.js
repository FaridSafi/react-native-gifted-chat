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
import ColorPropType from '../ColorPropType';
import ViewStylePropTypes from '../View/ViewStylePropTypes';
import { array, number, oneOf, oneOfType, shape, string } from 'prop-types';
var numberOrString = oneOfType([number, string]);

var TextStylePropTypes = _objectSpread({}, ViewStylePropTypes, {
  color: ColorPropType,
  fontFamily: string,
  fontFeatureSettings: string,
  fontSize: numberOrString,
  fontStyle: string,
  fontWeight: string,
  fontVariant: array,
  letterSpacing: numberOrString,
  lineHeight: numberOrString,
  textAlign: oneOf(['center', 'end', 'inherit', 'justify', 'justify-all', 'left', 'right', 'start']),
  textAlignVertical: string,
  textDecorationColor: ColorPropType,
  textDecorationLine: string,
  textDecorationStyle: string,
  textShadowColor: ColorPropType,
  textShadowOffset: shape({
    width: number,
    height: number
  }),
  textShadowRadius: number,
  textTransform: oneOf(['capitalize', 'lowercase', 'none', 'uppercase']),
  writingDirection: oneOf(['auto', 'ltr', 'rtl']),

  /* @platform web */
  textIndent: numberOrString,
  textOverflow: string,
  textRendering: oneOf(['auto', 'geometricPrecision', 'optimizeLegibility', 'optimizeSpeed']),
  unicodeBidi: oneOf(['normal', 'bidi-override', 'embed', 'isolate', 'isolate-override', 'plaintext']),
  whiteSpace: string,
  wordBreak: oneOf(['normal', 'break-all', 'break-word', 'keep-all']),
  wordWrap: string,
  MozOsxFontSmoothing: string,
  WebkitFontSmoothing: string
});

export default TextStylePropTypes;