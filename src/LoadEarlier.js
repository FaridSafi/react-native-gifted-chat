import React, { Component, PropTypes } from 'react';
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
        onPress={() => {
          if (this.props.onLoadEarlier) {
            this.props.onLoadEarlier();
          }
        }}
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
    marginTop: 5,
    marginBottom: 10,
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#b2b2b2',
    borderRadius: 15,
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
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
  onLoadEarlier: () => {},
};
