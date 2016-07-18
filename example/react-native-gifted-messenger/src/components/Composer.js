import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
} from 'react-native';

export default class Composer extends Component {
  render() {
    return (
      <TextInput
        placeholder={this.props.placeholder}
        multiline={true}
        onChange={(e) => {
          this.props.onChange(e);
        }}
        style={[styles.textInput, this.props.textInputStyle, {
          height: this.props.composerHeight,
          marginTop: 10,
          marginBottom: 10,
        }]}
        value={this.props.text}
        enablesReturnKeyAutomatically={true}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 17,
  },
});

Composer.defaultProps = {
  textInputStyle: {},
  onChange: () => {},
  composerHeight: 35,
  text: '',
  placeholder: 'Type a message...',
};
