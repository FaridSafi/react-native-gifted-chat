import React from "react"
import PropTypes from "prop-types"
import { View, ViewPropTypes } from "react-native"
import styles from "../styles"

function NavGroup({ style, children }) {
  return (
    <View style={[styles.navGroup, style]}>
      {children}
    </View>
  )
}

NavGroup.propTypes = {
  style: ViewPropTypes.style,
  children: PropTypes.node,
}

NavGroup.defaultProps = {
  style: {},
}

export { NavGroup }
