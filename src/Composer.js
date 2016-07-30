import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
} from 'react-native';

export default class Composer extends Component {
  render() {
    return (
      <TextInput
        placeholder={this.props.placeholder}
        placeholderTextColor={this.props.placeholderTextColor}
        multiline={true}
        onChange={(e) => {
          this.props.onChange(e);
        }}
        style={[styles.textInput, this.props.textInputStyle, {
          height: this.props.composerHeight,
        }]}
        value={this.props.text}
        enablesReturnKeyAutomatically={true}
        underlineColorAndroid="transparent"
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
    marginTop: Platform.select({
      ios: 6,
      android: 0,
    }),
    marginBottom: Platform.select({
      ios: 5,
      android: 3,
    }),
  },
});

Composer.defaultProps = {
  textInputStyle: {},
  onChange: () => {},
  composerHeight: Platform.select({
    ios: 33,
    android: 41,
  }), // TODO SHARE with GiftedChat.js and tests
  text: '',
  placeholder: 'Type a message...',
  placeholderTextColor: '#b2b2b2',
  textInputProps: null,
};
