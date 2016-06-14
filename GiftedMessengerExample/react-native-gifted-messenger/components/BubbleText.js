import React, { Component } from 'react';
import {
  Text,
} from 'react-native';

class BubbleText extends Component {
  render() {
    return (
      <Text style={this.props.customStyles.BubbleText.text}>
        {this.props.text}
      </Text>
    );
  }
}

BubbleText.defaultProps = {
  'customStyles': {},
  'text': null,
};

export default BubbleText;
