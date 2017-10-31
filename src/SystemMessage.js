import React from "react";
import { StyleSheet, Text, View, ViewPropTypes, Linking } from "react-native";
import PropTypes from "prop-types";
import ParsedText from 'react-native-parsed-text';

export default class SystemMessage extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    const { currentMessage } = this.props;
    //console.log('IN MY SM ', this.props)
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <ParsedText
            style={[styles.text, this.props.textStyle]}
            parse={[
              ...this.props.systemMessageParsePatterns(currentMessage),
            ]}
          >
            {currentMessage.text}
          </ParsedText>
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

