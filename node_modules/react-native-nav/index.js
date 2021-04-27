import React from "react"
import PropTypes from "prop-types"
import { View, Platform } from "react-native"
import { StatusBarEnhanced } from "./components/StatusBarEnhanced"
export { NavGroup } from "./components/NavGroup"
export { NavButton } from "./components/NavButton"
export { NavButtonText } from "./components/NavButtonText"
export { NavTitle } from "./components/NavTitle"
import styles from "./styles"

function NavigationBar({ style, children, statusBar }) {
  let navBar = null
  if (Platform.OS === "ios") {
    navBar = (
      <View style={[styles.navBar, styles.navBarIOS, style.navBar]}>
        {children}
      </View>
    )
  } else if (Platform.OS === "android") {
    navBar = (
      <View style={[styles.navBar, styles.navBarAndroid, style.navBar]}>
        {children}
      </View>
    )
  }

  return (
    <View style={[styles.navBarContainer, style.navBarContainer]}>
      <StatusBarEnhanced style={style.statusBar} statusBar={statusBar} />
      {navBar}
    </View>
  )
}

NavigationBar.propTypes = {
  statusBar: PropTypes.object,
  style: PropTypes.object,
  children: PropTypes.node,
}

NavigationBar.defaultProps = {
  style: {},
  statusBar: {},
}

export default NavigationBar
