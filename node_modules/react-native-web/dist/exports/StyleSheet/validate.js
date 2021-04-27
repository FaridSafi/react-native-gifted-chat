/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
// import { STYLE_SHORT_FORM_EXPANSIONS } from './constants';
import ImageStylePropTypes from '../Image/ImageStylePropTypes';
import TextInputStylePropTypes from '../TextInput/TextInputStylePropTypes';
import TextStylePropTypes from '../Text/TextStylePropTypes';
import ViewStylePropTypes from '../View/ViewStylePropTypes';
import warning from 'fbjs/lib/warning';
var validProperties = [].concat(Object.keys(ImageStylePropTypes), Object.keys(TextInputStylePropTypes), Object.keys(TextStylePropTypes), Object.keys(ViewStylePropTypes), ['appearance', 'borderCollapse', 'borderSpacing', 'clear', 'cursor', 'fill', 'float', 'listStyle', 'objectFit', 'objectPosition', 'pointerEvents', 'placeholderTextColor', 'tableLayout']).sort().reduce(function (acc, curr) {
  acc[curr] = true;
  return acc;
}, {});
var invalidShortforms = {
  background: true,
  borderBottom: true,
  borderLeft: true,
  borderRight: true,
  borderTop: true,
  font: true,
  grid: true,
  outline: true,
  textDecoration: true
};
/*
const singleValueShortForms = Object.keys(STYLE_SHORT_FORM_EXPANSIONS).reduce((a, c) => {
  a[c] = true;
  return a;
}, {});
*/

function error(message) {
  warning(false, message);
}

export default function validate(key, styles) {
  var obj = styles[key];

  for (var k in obj) {
    var prop = k.trim();
    var value = obj[prop];
    var isInvalid = false;

    if (value === null) {
      continue;
    }

    if (validProperties[prop] == null) {
      var suggestion = '';

      if (prop === 'animation' || prop === 'animationName') {
        suggestion = 'Did you mean "animationKeyframes"?'; // } else if (prop === 'boxShadow') {
        //  suggestion = 'Did you mean "shadow{Color,Offset,Opacity,Radius}"?';
      } else if (prop === 'direction') {
        suggestion = 'Did you mean "writingDirection"?';
      } else if (prop === 'verticalAlign') {
        suggestion = 'Did you mean "textAlignVertical"?';
      } else if (invalidShortforms[prop]) {
        suggestion = 'Please use long-form properties.';
      }

      isInvalid = true;
      error("Invalid style property of \"" + prop + "\". " + suggestion);
    } // else if (singleValueShortForms[prop]) {
    //   TODO: fix check
    //   if (typeof value === 'string' && value.indexOf(' ') > -1) {
    //     error(
    //       `Invalid style declaration "${prop}:${value}". This property must only specify a single value.`
    //     );
    //     isInvalid = true;
    //   }
    // }
    else if (typeof value === 'string' && value.indexOf('!important') > -1) {
        error("Invalid style declaration \"" + prop + ":" + value + "\". Values cannot include \"!important\"");
        isInvalid = true;
      }

    if (isInvalid) {
      delete obj[k];
    }
  }
}