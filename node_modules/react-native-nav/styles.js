import { StyleSheet, Platform } from "react-native"

const IOS_NAV_BAR_HEIGHT = 44
const IOS_STATUS_BAR_HEIGHT = 20
const ANDROID_NAV_BAR_HEIGHT = 56
let ANDROID_STATUS_BAR_HEIGHT = 24
if (Platform.Version < 21) {
  ANDROID_STATUS_BAR_HEIGHT = 0
}

export default StyleSheet.create({
  navBarContainer: {},
  statusBarIOS: {
    height: IOS_STATUS_BAR_HEIGHT,
    backgroundColor: "#f5f5f5",
  },
  statusBarAndroid: {
    height: ANDROID_STATUS_BAR_HEIGHT,
    backgroundColor: "#f5f5f5",
  },
  navBar: {
    borderTopWidth: 0,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navBarIOS: {
    backgroundColor: "#f5f5f5",
    height: IOS_NAV_BAR_HEIGHT,
    paddingLeft: 8,
    paddingRight: 8,
  },
  navBarAndroid: {
    backgroundColor: "#f5f5f5",
    height: ANDROID_NAV_BAR_HEIGHT,
    padding: 16,
  },
  navBarButtonIOS: {
    marginLeft: 0,
  },
  navBarButtonAndroid: {
    marginLeft: 16,
  },
  navBarButtonText: {
    fontSize: 17,
    letterSpacing: 0.5,
    color: "#939393",
  },
  navBarTitleText: {
    fontSize: 17,
    letterSpacing: 0.5,
    color: "#626262",
    fontWeight: "500",
    textAlign: "center",
  },
  navGroup: {
    flexDirection: "row",
  },
})
