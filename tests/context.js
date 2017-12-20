/* eslint react/prop-types: 0,  padded-blocks: 0 */

import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import PropTypes from 'prop-types';

class Context extends React.Component {
  getChildContext() {
    return {
      actionSheet: () => {},
      getLocale: () => 'en',
    };
  }
  render() {
    return this.props.children;
  }
}

Context.propTypes = {
  children: PropTypes.element,
};

Context.childContextTypes = {
  actionSheet: PropTypes.func,
  getLocale: PropTypes.func,
  children: PropTypes.element,
};

export default function createComponentWithContext(children) {
  return renderer.create(<Context>{children}</Context>);
}
