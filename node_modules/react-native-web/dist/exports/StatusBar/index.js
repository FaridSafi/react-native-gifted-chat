function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import { Component } from 'react';

var StatusBar =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(StatusBar, _Component);

  function StatusBar() {
    return _Component.apply(this, arguments) || this;
  }

  StatusBar.setBackgroundColor = function setBackgroundColor() {};

  StatusBar.setBarStyle = function setBarStyle() {};

  StatusBar.setHidden = function setHidden() {};

  StatusBar.setNetworkActivityIndicatorVisible = function setNetworkActivityIndicatorVisible() {};

  StatusBar.setTranslucent = function setTranslucent() {};

  var _proto = StatusBar.prototype;

  _proto.render = function render() {
    return null;
  };

  return StatusBar;
}(Component);

export { StatusBar as default };