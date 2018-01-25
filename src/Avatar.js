/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View, ViewPropTypes } from 'react-native';
import GiftedAvatar from './GiftedAvatar';
import { isSameUser, isSameDay, warnDeprecated } from './utils';

export default class Avatar extends React.Component {

  renderAvatar() {
    if (this.props.renderAvatar) {
      const { renderAvatar, ...avatarProps } = this.props;
      return this.props.renderAvatar(avatarProps);
    }
    return (
      <GiftedAvatar
        avatarStyle={StyleSheet.flatten([
          styles[this.props.position].image,
          this.props.imageStyle[this.props.position],
        ])}
        user={this.props.currentMessage.user}
        onPress={() => this.props.onPressAvatar && this.props.onPressAvatar(this.props.currentMessage.user)}
      />
    );
  }

  render() {
    const { renderAvatarOnTop } = this.props;
    const messageToCompare = renderAvatarOnTop ? this.props.previousMessage : this.props.nextMessage;
    const computedStyle = renderAvatarOnTop ? 'onTop' : 'onBottom';

    if (this.props.renderAvatar === null) {
      return null;
    }

    if (
      isSameUser(this.props.currentMessage, messageToCompare) &&
      isSameDay(this.props.currentMessage, messageToCompare)
    ) {
      return (
        <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
          <GiftedAvatar
            avatarStyle={StyleSheet.flatten([
              styles[this.props.position].image,
              this.props.imageStyle[this.props.position],
            ])}
          />
        </View>
      );
    }

    return (
      <View
        style={[
          styles[this.props.position].container,
          styles[this.props.position][computedStyle],
          this.props.containerStyle[this.props.position],
        ]}
      >
        {this.renderAvatar()}
      </View>
    );
  }

}

const styles = {
  left: StyleSheet.create({
    container: {
      marginRight: 8,
    },
    onTop: {
      alignSelf: 'flex-start',
    },
    onBottom: {},
    image: {
      height: 36,
      width: 36,
      borderRadius: 18,
    },
  }),
  right: StyleSheet.create({
    container: {
      marginLeft: 8,
    },
    onTop: {
      alignSelf: 'flex-start',
    },
    onBottom: {},
    image: {
      height: 36,
      width: 36,
      borderRadius: 18,
    },
  }),
};

Avatar.defaultProps = {
  renderAvatarOnTop: false,
  position: 'left',
  currentMessage: {
    user: null,
  },
  previousMessage: {},
  nextMessage: {},
  containerStyle: {},
  imageStyle: {},
  onPressAvatar: () => {},
  // TODO: remove in next major release
  isSameDay: warnDeprecated(isSameDay),
  isSameUser: warnDeprecated(isSameUser),
};

Avatar.propTypes = {
  renderAvatarOnTop: PropTypes.bool,
  position: PropTypes.oneOf(['left', 'right']),
  currentMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  onPressAvatar: PropTypes.func,
  renderAvatar: PropTypes.func,
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  imageStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  // TODO: remove in next major release
  isSameDay: PropTypes.func,
  isSameUser: PropTypes.func,
};
