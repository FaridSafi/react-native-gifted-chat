function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * Copyright (c) 2015-present, Nicolas Gallagher.
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
import { Component } from 'react';
import { bool, func } from 'prop-types';
/**
 * Renders static content efficiently by allowing React to short-circuit the
 * reconciliation process. This component should be used when you know that a
 * subtree of components will never need to be updated.
 *
 *   const someValue = ...; // We know for certain this value will never change.
 *   return (
 *     <StaticRenderer render={() => <MyComponent value={someValue} />} />
 *   );
 *
 * Typically, you will not need to use this component and should opt for normal
 * React reconciliation.
 */

var StaticRenderer =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(StaticRenderer, _Component);

  function StaticRenderer() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = StaticRenderer.prototype;

  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    return nextProps.shouldUpdate;
  };

  _proto.render = function render() {
    return this.props.render();
  };

  return StaticRenderer;
}(Component);

export { StaticRenderer as default };
StaticRenderer.propTypes = process.env.NODE_ENV !== "production" ? {
  render: func.isRequired,
  shouldUpdate: bool.isRequired
} : {};