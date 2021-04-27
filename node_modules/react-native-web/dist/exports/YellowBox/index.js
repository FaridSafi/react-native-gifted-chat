function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import React from 'react';
import UnimplementedView from '../../modules/UnimplementedView';

var YellowBox =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(YellowBox, _React$Component);

  function YellowBox() {
    return _React$Component.apply(this, arguments) || this;
  }

  YellowBox.ignoreWarnings = function ignoreWarnings() {};

  var _proto = YellowBox.prototype;

  _proto.render = function render() {
    return React.createElement(UnimplementedView, this.props);
  };

  return YellowBox;
}(React.Component);

export default YellowBox;