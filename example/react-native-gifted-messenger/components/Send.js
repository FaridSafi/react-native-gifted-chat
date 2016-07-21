import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

export default class Send extends Component {
  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        onPress={() => {
          this.props.onSend({text: this.props.text.trim()}, true);
        }}
        disabled={this.props.text.trim().length > 0 ? false : true}
      >
        <Text style={[styles.text, {
          opacity: (this.props.text.trim().length > 0 ? 1 : 0.5),
        }, this.props.textStyle]}>Send</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 12,
  },
  text: {
    color: '#0084ff',
    fontWeight: '600',
    fontSize: 17,
  },
});

Send.defaultProps = {
  containerStyle: {},
  textStyle: {},
  text: '',
  onSend: () => {},
};
