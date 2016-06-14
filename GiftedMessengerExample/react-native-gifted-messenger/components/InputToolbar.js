import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';

import Send from './Send';
import Composer from './Composer';

class InputToolbar extends Component {

  renderActions() {
    if (this.props.renderActions) {
      return this.props.renderActions(this.props);
    }
    return null;
  }

  renderSend() {
    if (this.props.renderSend) {
      return this.props.renderSend(this.props);
    }
    return <Send {...this.props}/>;
  }

  renderComposer() {
    if (this.props.renderComposer) {
      return this.props.renderComposer(this.props);
    }

    return <Composer {...this.props}/>;
  }

  render() {
    return (
      <View style={this.props.customStyles.InputToolbar.container}>
        {this.renderActions()}
        {this.renderComposer()}
        {this.renderSend()}
      </View>
    );
  }
}

InputToolbar.defaultProps = {
  customStyles: {},
};

export default InputToolbar;
