import React, { Component } from 'react';
import {
  View,
} from 'react-native';

import GiftedAvatar from 'react-native-gifted-avatar';

class Avatar extends Component {
  renderAvatar() {
    if (this.props.renderAvatar) {
      return this.props.renderAvatar(this.props);
    }
    return (
      <GiftedAvatar
        avatarStyle={this.props.customStyles.Avatar.image}
        user={this.props.currentMessage.user}
      />
    );
  }

  render() {
    if (this.props.isSameUser(this.props.currentMessage, this.props.nextMessage) && this.props.isSameDay(this.props.currentMessage, this.props.nextMessage)) {
      return (
        <View style={this.props.customStyles.Avatar[this.props.position].container}>
          <GiftedAvatar
            avatarStyle={this.props.customStyles.Avatar.image}
            user={null}
          />
        </View>
      );
    }
    return (
      <View style={this.props.customStyles.Avatar[this.props.position].container}>
        {this.renderAvatar()}
      </View>
    );
  }
}

Avatar.defaultProps = {
  customStyles: {},
  isSameDay: () => {},
  isSameUser: () => {},
  position: null,
  currentMessage: {
    user: null,
  },
  nextMessage: {},
};

export default Avatar;
