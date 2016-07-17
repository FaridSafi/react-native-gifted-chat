import React, { Component, PropTypes } from 'react';
import {
  Linking,
  StyleSheet,
  View,
} from 'react-native';

import RNParsedText from 'react-native-parsed-text';
import Communications from 'react-native-communications';

export default class ParsedText extends Component {
  constructor(props) {
    super(props);
    this.onUrlPress = this.onUrlPress.bind(this);
    this.onPhonePress = this.onPhonePress.bind(this);
    this.onEmailPress = this.onEmailPress.bind(this);
  }

  onUrlPress(url) {
    Linking.openURL(url);
  }

  onPhonePress(phone) {
    const options = [
      'Text',
      'Call',
      'Cancel',
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions({
      options,
      cancelButtonIndex,
    },
    (buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          Communications.phonecall(phone, true);
          break;
        case 1:
          Communications.text(phone);
          break;
      }
    });
  }

  onEmailPress(email) {
    Communications.email(email, null, null, null, null);
  }

  render() {
    return (
      <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
        <RNParsedText
          style={[styles[this.props.position].text, this.props.textStyle[this.props.position]]}
          parse={[
            {type: 'url', style: StyleSheet.flatten([styles[this.props.position].link, this.props.linkStyle[this.props.position]]), onPress: this.onUrlPress},
            {type: 'phone', style: StyleSheet.flatten([styles[this.props.position].link, this.props.linkStyle[this.props.position]]), onPress: this.onPhonePress},
            {type: 'email', style: StyleSheet.flatten([styles[this.props.position].link, this.props.linkStyle[this.props.position]]), onPress: this.onEmailPress},
          ]}
        >
          {this.props.currentMessage.text}
        </RNParsedText>
      </View>
    );
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
    },
    text: {
      color: 'black',
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 10,
      marginRight: 10,
    },
    link: {
      color: 'black',
      textDecorationLine: 'underline',
    },
  }),
  right: StyleSheet.create({
    container: {
    },
    text: {
      color: 'white',
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 10,
      marginRight: 10,
    },
    link: {
      color: 'white',
      textDecorationLine: 'underline',
    },
  }),
};

// required by @exponent/react-native-action-sheet
ParsedText.contextTypes = {
  actionSheet: PropTypes.func,
};

ParsedText.defaultProps = {
  containerStyle: {},
  textStyle: {},
  linkStyle: {},
  currentMessage: {
    text: '',
  },
};
