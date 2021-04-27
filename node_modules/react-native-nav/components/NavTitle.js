import React from "react"
import PropTypes from "prop-types"
import { Text } from "react-native"
import styles from "../styles"

function NavTitle({ style, children }) {
  return (
    <Text accessibilityTraits="header" style={[styles.navBarTitleText, style]}>
      {children}
    </Text>
  )
}

NavTitle.propTypes = {
  style: Text.propTypes.style,
  children: PropTypes.node,
}

NavTitle.defaultProps = {
  style: {},
}

export { NavTitle }
