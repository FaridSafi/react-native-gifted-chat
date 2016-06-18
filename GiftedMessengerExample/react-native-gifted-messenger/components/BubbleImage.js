import React, { Component } from 'react';
import {
  Image,
  View,
} from 'react-native';

class BubbleImage extends Component {
  render() {
    return (
      <View style={this.props.customStyles.BubbleImage.container}>
        <Image
          style={this.props.customStyles.BubbleImage.image}
          source={{uri: this.props.image}}
        />
      </View>
    );
  }
}

BubbleImage.defaultProps = {
  'customStyles': {},
  'image': null,
};

export default BubbleImage;
