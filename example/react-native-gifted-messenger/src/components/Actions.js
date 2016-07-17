import React, { Component, PropTypes } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default class Actions extends Component {
  constructor(props) {
    super(props);
    this.onActionsPress = this.onActionsPress.bind(this);
  }

  onActionsPress() {
    const options = Object.keys(this.props.options);
    const cancelButtonIndex = Object.keys(this.props.options).length - 1;
    this.context.actionSheet().showActionSheetWithOptions({
      options,
      cancelButtonIndex,
    },
    (buttonIndex) => {
      let i = 0;
      for (let key in this.props.options) {
        if (this.props.options.hasOwnProperty(key)) {
          if (buttonIndex === i) {
            this.props.options[key](this.props);
            return;
          }
          i++;
        }
      }
    });
  }

  renderIcon() {
    if (this.props.icon) {
      return this.props.icon();
    }
    return (
      <Image
        style={[styles.icon, this.props.iconStyle]}
        resizeMode={'contain'}
        source={require('../../assets/paperclip.png')}
      />
    );
  }

  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        onPress={this.onActionsPress}
      >
        {this.renderIcon()}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 27,
    marginLeft: 10,
    marginBottom: 12,
  },
  icon: {
    width: 27,
    height: 30,
    tintColor: '#ccc',
  },
});

// required by @exponent/react-native-action-sheet
Actions.contextTypes = {
  actionSheet: PropTypes.func,
};

Actions.defaultProps = {
  onSend: () => {},
  containerStyle: {},
  iconStyle: {},
  options: {},
  icon: null,
};
