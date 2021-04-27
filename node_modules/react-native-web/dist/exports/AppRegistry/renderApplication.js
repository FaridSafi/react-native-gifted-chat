function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import AppContainer from './AppContainer';
import invariant from 'fbjs/lib/invariant';
import hydrate from '../../modules/hydrate';
import render from '../render';
import styleResolver from '../StyleSheet/styleResolver';
import React from 'react';
var renderFn = process.env.NODE_ENV !== 'production' ? render : hydrate;
export default function renderApplication(RootComponent, initialProps, rootTag, WrapperComponent, callback) {
  invariant(rootTag, 'Expect to have a valid rootTag, instead got ', rootTag);
  renderFn(React.createElement(AppContainer, {
    WrapperComponent: WrapperComponent,
    rootTag: rootTag
  }, React.createElement(RootComponent, initialProps)), rootTag, callback);
}
export function getApplication(RootComponent, initialProps, WrapperComponent) {
  var element = React.createElement(AppContainer, {
    WrapperComponent: WrapperComponent,
    rootTag: {}
  }, React.createElement(RootComponent, initialProps)); // Don't escape CSS text

  var getStyleElement = function getStyleElement(props) {
    var sheet = styleResolver.getStyleSheet();
    return React.createElement("style", _extends({}, props, {
      dangerouslySetInnerHTML: {
        __html: sheet.textContent
      },
      id: sheet.id
    }));
  };

  return {
    element: element,
    getStyleElement: getStyleElement
  };
}