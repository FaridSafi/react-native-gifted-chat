import React from "react";
import { StyleSheet, Text, View, ViewPropTypes } from "react-native";
import PropTypes from "prop-types";

export default class SystemMessage extends React.Component {
  render() {
    const { currentMessage } = this.props;
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.text, this.props.textStyle]}>
            {currentMessage.text}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginTop: 5,
    marginBottom: 10,
  },
  text: {
    backgroundColor: "transparent",
    color: "#b2b2b2",
    fontSize: 12,
    fontWeight: "300"
  }
});

SystemMessage.defaultProps = {
  currentMessage: {
    system: false,
  },
  containerStyle: {},
  wrapperStyle: {},
  textStyle: {},
};

SystemMessage.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  wrapperStyle: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
};

