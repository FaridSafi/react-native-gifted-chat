import React from "react"
import PropTypes from "prop-types"
import { Text } from "react-native"
import styles from "../styles"

function NavButtonText({ style, children }) {
  return (
    <Text style={[styles.navBarButtonText, style]} {...this.props}>
      {children}
    </Text>
  )
}

NavButtonText.propTypes = {
  ...Text.PropTypes,
  style: Text.propTypes.style,
  children: PropTypes.node,
}

NavButtonText.defaultProps = {
  style: {},
}

export { NavButtonText }
