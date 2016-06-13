import React, { Component } from 'react';
import {
  Text,
} from 'react-native';

class BubbleText extends Component {
  render() {
    return (
      <Text style={this.props.theme.BubbleText.text}>
        {this.props.text}
      </Text>
    );
  }
}

export default BubbleText;
