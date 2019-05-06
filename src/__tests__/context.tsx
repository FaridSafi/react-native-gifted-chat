import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import PropTypes from 'prop-types'

class Context extends React.Component {
  static propTypes = {
    children: PropTypes.element,
  }

  static childContextTypes = {
    actionSheet: PropTypes.func,
    getLocale: PropTypes.func,
    children: PropTypes.element,
  }
  getChildContext() {
    return {
      actionSheet: () => {},
      getLocale: () => 'en',
    }
  }
  render() {
    return this.props.children
  }
}

export default function createComponentWithContext(children: any) {
  return renderer.create(<Context>{children}</Context>)
}
