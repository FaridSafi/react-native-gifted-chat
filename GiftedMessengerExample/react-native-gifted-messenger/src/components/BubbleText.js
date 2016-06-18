import React, { Component, PropTypes } from 'react';
import {
  Linking,
  View,
} from 'react-native';

import ParsedText from 'react-native-parsed-text';
import Communications from 'react-native-communications';

class BubbleText extends Component {

  // required by @exponent/react-native-action-sheet
  static contextTypes = {
    actionSheet: PropTypes.func,
  };

  handleUrlPress(url) {
    Linking.openURL(url);
  }

  handlePhonePress(phone) {
    let options = [
      'Text message',
      'Call',
      'Cancel',
    ];
    let cancelButtonIndex = options.length - 1;
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

  handleEmailPress(email) {
    Communications.email(email, null, null, null, null);
  }

  render() {
    return (
      <View style={this.props.customStyles.BubbleText.container}>
        <ParsedText
          style={this.props.customStyles.BubbleText.text}
          parse={[
            {type: 'url', style: this.props.customStyles.BubbleText.link, onPress: this.handleUrlPress.bind(this)},
            {type: 'phone', style: this.props.customStyles.BubbleText.link, onPress: this.handlePhonePress.bind(this)},
            {type: 'email', style: this.props.customStyles.BubbleText.link, onPress: this.handleEmailPress.bind(this)},
          ]}
        >
          {this.props.text}
        </ParsedText>
      </View>
    );
  }
}

BubbleText.defaultProps = {
  'customStyles': {},
  'text': null,
};

export default BubbleText;
