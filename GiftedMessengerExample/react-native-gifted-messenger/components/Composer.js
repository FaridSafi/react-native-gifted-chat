import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  PixelRatio,
  TouchableOpacity,
} from 'react-native';


class Message extends Component {
  constructor(props) {
    super(props);
  }

  renderSendButton() {
    return (
      <TouchableOpacity
        style={styles.sendButton}
        onPress={this.props.onSend}
      >
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    );
  }

  renderTextInput() {
    return (
      <TextInput
        placeholder={'Type a message...'}
        multiline={true}
        onChange={this.props.onType}
        style={[styles.textInput, {
          height: this.props.textInputHeight,
          marginTop: (this.props.heightMin - this.props.textInputHeightMin) / 2,
          marginBottom: (this.props.heightMin - this.props.textInputHeightMin) / 2,
        }]}
        value={this.props.text}
        enablesReturnKeyAutomatically={true}

        ref={(r) => {
          this._textInput = r;
        }}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderTextInput()}
        {this.renderSendButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: '#E6E6E6',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
  },
  textInput: {
    flex: 1,
    paddingLeft: 15,
    fontSize: 17,
  },
  sendButton: {
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  sendButtonText: {
    color: '#6699CC',
    fontWeight: '600',
    fontSize: 17,
  },
});

export default Message;
