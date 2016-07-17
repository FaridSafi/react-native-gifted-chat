import React, { Component, PropTypes } from 'react';
import {
  Image,
  TouchableOpacity,
} from 'react-native';

class Actions extends Component {
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
        style={this.props.customStyles.Actions.icon}
        resizeMode={'contain'}
        source={require('../../assets/paperclip.png')}
      />
    );
  }

  render() {
    return (
      <TouchableOpacity
        style={this.props.customStyles.Actions.container}
        onPress={this.onActionsPress}
      >
        {this.renderIcon()}
      </TouchableOpacity>
    );
  }
}

// required by @exponent/react-native-action-sheet
Actions.contextTypes = {
  actionSheet: PropTypes.func,
};

Actions.defaultProps = {
  onSend: () => {},
  customStyles: {},
  options: {},
  icon: null,
};

export default Actions;
