import React, { Component } from 'react';
import {
  TextInput,
} from 'react-native';

class Composer extends Component {
  render() {
    return (
      <TextInput
        placeholder={'Type a message...'}
        multiline={true}
        onChange={this.props.onChange}
        style={[this.props.customStyles.Composer.textInput, {
          height: this.props.composerHeight,
          marginTop: (this.props.customStyles.minInputToolbarHeight - this.props.customStyles.minComposerHeight) / 2,
          marginBottom: (this.props.customStyles.minInputToolbarHeight - this.props.customStyles.minComposerHeight) / 2,
        }]}
        value={this.props.text}
        enablesReturnKeyAutomatically={true}
      />
    );
  }
}

export default Composer;
