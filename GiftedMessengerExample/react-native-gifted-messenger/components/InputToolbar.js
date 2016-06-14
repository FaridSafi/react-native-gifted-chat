import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';

import Send from './Send';
import Composer from './Composer';

class InputToolbar extends Component {

  renderActions() {
    if (this.props.renderActions) {
      return this.props.renderActions({
        onSend: this.props.onSend,
        theme: this.props.theme,
        locale: this.props.locale,
      });
    }
    return null;
  }

  renderSend() {
    const sendProps = {
      theme: this.props.theme,
      locale: this.props.locale,
      onSend: this.props.onSend,
      text: this.props.text,
    };
    if (this.props.renderSend) {
      return this.props.renderSend(sendProps);
    }

    return (
      <Send {...sendProps}/>
    );
  }

  renderComposer() {
    const composerProps = {
      theme: this.props.theme,
      locale: this.props.locale,
      onChange: this.props.onChangeText,
      composerHeight: this.props.composerHeight,
      heightMin: this.props.heightMin,
      composerHeightMin: this.props.composerHeightMin,
      text: this.props.text,
    };

    if (this.props.renderComposer) {
      return this.props.renderComposer(composerProps);
    }

    return (
      <Composer {...composerProps}/>
    );
  }

  render() {
    return (
      <View style={this.props.theme.InputToolbar.container}>
        {this.renderActions()}
        {this.renderComposer()}
        {this.renderSend()}
      </View>
    );
  }
}

InputToolbar.defaultProps = {
  theme: {},
};

export default InputToolbar;
