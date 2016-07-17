import React, { Component, PropTypes } from 'react';
import {
  PixelRatio,
  StyleSheet,
  View,
} from 'react-native';

import Composer from './Composer';
import Send from './Send';

export default class InputToolbar extends Component {
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

    return (
      <Composer
        {...this.props}
      />
    );
  }

  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        {this.renderActions()}
        {this.renderComposer()}
        {this.renderSend()}
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
    alignItems: 'flex-end',
  },
});

InputToolbar.defaultProps = {
  containerStyle: {},
  renderActions: null,
  renderSend: null,
  renderComposer: null,
};
