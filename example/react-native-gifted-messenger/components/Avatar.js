import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import {Avatar as GiftedAvatar} from 'react-native-gifted-material';

export default class Avatar extends Component {
  renderAvatar() {
    if (this.props.renderAvatar) {
      return this.props.renderAvatar(this.props);
    }
    return (
      <GiftedAvatar
        avatarStyle={StyleSheet.flatten([styles[this.props.position].image, this.props.imageStyle[this.props.position]])}
        user={this.props.currentMessage.user}
      />
    );
  }
  render() {
    if (this.props.isSameUser(this.props.currentMessage, this.props.nextMessage) && this.props.isSameDay(this.props.currentMessage, this.props.nextMessage)) {
      return (
        <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
          <GiftedAvatar
            avatarStyle={StyleSheet.flatten([styles[this.props.position].image, this.props.imageStyle[this.props.position]])}
          />
        </View>
      );
    }
    return (
      <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
        {this.renderAvatar()}
      </View>
    );
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      marginRight: 5,
    },
    image: {
      height: 40,
      width: 40,
    },
  }),
  right: StyleSheet.create({
    container: {
      marginLeft: 5,
    },
    image: {
      height: 40,
      width: 40,
    },
  }),
};

Avatar.defaultProps = {
  containerStyle: {},
  imageStyle: {},
  isSameDay: () => {},
  isSameUser: () => {},
  position: null,
  currentMessage: {
    user: null,
  },
  nextMessage: {},
};
