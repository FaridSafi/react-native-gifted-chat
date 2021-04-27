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
import { any, bool } from 'prop-types';
import { Children, Component } from 'react';
/**
 * Renders static content efficiently by allowing React to short-circuit the
 * reconciliation process. This component should be used when you know that a
 * subtree of components will never need to be updated.
 *
 *   const someValue = ...; // We know for certain this value will never change.
 *   return (
 *     <StaticContainer>
 *       <MyComponent value={someValue} />
 *     </StaticContainer>
 *   );
 *
 * Typically, you will not need to use this component and should opt for normal
 * React reconciliation.
 */

var StaticContainer =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(StaticContainer, _Component);

  function StaticContainer() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = StaticContainer.prototype;

  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    return nextProps.shouldUpdate;
  };

  _proto.render = function render() {
    var child = this.props.children;
    return child === null || child === false ? null : Children.only(child);
  };

  return StaticContainer;
}(Component);

export { StaticContainer as default };
StaticContainer.propTypes = process.env.NODE_ENV !== "production" ? {
  children: any.isRequired,
  shouldUpdate: bool.isRequired
} : {};