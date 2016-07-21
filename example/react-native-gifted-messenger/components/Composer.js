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
        placeholderTextColor={'#ddd'}
        multiline={true}
        onChange={(e) => {
          this.props.onChange(e);
        }}
        style={[styles.textInput, this.props.textInputStyle, {
          height: this.props.composerHeight,
        }]}
        value={this.props.text}
        enablesReturnKeyAutomatically={true}
        {...this.props.textInputProps}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    lineHeight: 16,
    marginTop: 6,
    marginBottom: 5,
  },
});

Composer.defaultProps = {
  textInputStyle: {},
  onChange: () => {},
  composerHeight: 33,
  text: '',
  placeholder: 'Type a message...',
  textInputProps: null,
};
