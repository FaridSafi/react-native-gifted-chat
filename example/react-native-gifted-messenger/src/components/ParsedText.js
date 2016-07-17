import React, { Component, PropTypes } from 'react';
import {
  Linking,
  View,
} from 'react-native';

import RNParsedText from 'react-native-parsed-text';
import Communications from 'react-native-communications';

class ParsedText extends Component {
  constructor(props) {
    super(props);
    this.onUrlPress = this.onUrlPress.bind(this);
    this.onPhonePress = this.onPhonePress.bind(this);
    this.onEmailPress = this.onEmailPress.bind(this);
  }
  // required by @exponent/react-native-action-sheet
  static contextTypes = {
    actionSheet: PropTypes.func,
  };

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
      <View style={this.props.customStyles.ParsedText[this.props.position].container}>
        <RNParsedText
          style={this.props.customStyles.ParsedText[this.props.position].text}
          parse={[
            {type: 'url', style: this.props.customStyles.ParsedText[this.props.position].link, onPress: this.onUrlPress},
            {type: 'phone', style: this.props.customStyles.ParsedText[this.props.position].link, onPress: this.onPhonePress},
            {type: 'email', style: this.props.customStyles.ParsedText[this.props.position].link, onPress: this.onEmailPress},
          ]}
        >
          {this.props.currentMessage.text}
        </RNParsedText>
      </View>
    );
  }
}

ParsedText.defaultProps = {
  customStyles: {},
  currentMessage: {
    text: '',
  },
};

export default ParsedText;
