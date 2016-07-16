import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

class LoadEarlier extends Component {
  render() {
    return (
      <TouchableOpacity
        style={this.props.customStyles.LoadEarlier.container}
        onPress={this.props.onLoadEarlier}
      >
        <View style={this.props.customStyles.LoadEarlier.wrapper}>
          <Text style={this.props.customStyles.LoadEarlier.text}>
            Load earlier messages
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

LoadEarlier.defaultProps = {
  customStyles: {},
  // should be set in GiftedMessenger root component :
  onLoadEarlier: () => {},
};

export default LoadEarlier;
