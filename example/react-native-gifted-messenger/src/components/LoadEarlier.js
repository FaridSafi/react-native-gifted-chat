import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default class LoadEarlier extends Component {
  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        onPress={this.props.onLoadEarlier}
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.text, this.props.textStyle]}>
            Load earlier messages
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  wrapper: {
    alignItems: 'center',
    backgroundColor: '#ccc',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  text: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 12,
  },
});

LoadEarlier.defaultProps = {
  containerStyle: {},
  wrapperStyle: {},
  textStyle: {},
  onLoadEarlier: () => {}, // should be set in GiftedMessenger root component
};
