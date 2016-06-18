import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

class BubbleText extends Component {
  render() {
    return (
      <View style={this.props.customStyles.BubbleText.container}>
        <Text style={this.props.customStyles.BubbleText.text}>
          {this.props.text}
        </Text>
      </View>
    );
  }
}

BubbleText.defaultProps = {
  'customStyles': {},
  'text': null,
};

export default BubbleText;
