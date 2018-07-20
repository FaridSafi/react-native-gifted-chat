/* eslint no-use-before-define: ["error", { "variables": false }] */

// Added prop (alwaysShow) to always show Send btn

import PropTypes from "prop-types";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes
} from "react-native";
import Color from "./Color";

export default function Send({
  text,
  containerStyle,
  onSend,
  children,
  textStyle,
  label,
  alwaysShow
}) {
  if (alwaysShow || text.trim().length > 0) {
    return (
      <TouchableOpacity
        style={[styles.container, containerStyle]}
        onPress={() => {
          onSend({ text: text.trim() }, true);
        }}
        accessibilityTraits="button"
      >
        <View>
          {children || <Text style={[styles.text, textStyle]}>{label}</Text>}
        </View>
      </TouchableOpacity>
    );
  }
  return <View />;
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    justifyContent: "flex-end"
  },
  text: {
    color: Color.defaultBlue,
    fontWeight: "600",
    fontSize: 17,
    backgroundColor: Color.backgroundTransparent,
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10
  }
});

Send.defaultProps = {
  text: "",
  onSend: () => {},
  label: "Send",
  containerStyle: {},
  textStyle: {},
  children: null,
  alwaysShow: false
};

Send.propTypes = {
  text: PropTypes.string,
  onSend: PropTypes.func,
  label: PropTypes.string,
  containerStyle: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
  children: PropTypes.element,
  alwaysShow: PropTypes.bool
};
