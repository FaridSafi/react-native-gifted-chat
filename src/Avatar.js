import React from "react";
import {Image, StyleSheet, View} from "react-native";
import GiftedAvatar from "./GiftedAvatar";
import {isSameUser, isSameDay, warnDeprecated} from "./utils";

export default class Avatar extends React.Component {
  renderAvatar() {
    if (this.props.renderAvatar) {
      const {renderAvatar, ...avatarProps} = this.props;
      return this.props.renderAvatar(avatarProps);
    }
    return (
      <GiftedAvatar
        avatarStyle={StyleSheet.flatten([styles[this.props.position].image, this.props.imageStyle[this.props.position]])}
        user={this.props.currentMessage.user}
      />
    );
  }

  render() {
    const renderAvatarOnTop = this.props.renderAvatarOnTop;
    const messageToCompare = renderAvatarOnTop ? this.props.previousMessage : this.props.nextMessage;
    const computedStyle = renderAvatarOnTop ? "onTop" : "onBottom"

    if (isSameUser(this.props.currentMessage, messageToCompare) && isSameDay(this.props.currentMessage, messageToCompare)) {
      return (
        <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
          <GiftedAvatar
            avatarStyle={StyleSheet.flatten([styles[this.props.position].image, this.props.imageStyle[this.props.position]])}
          />
        </View>
      );
    }
    return (
      <View
        style={[styles[this.props.position].container, styles[this.props.position][computedStyle], this.props.containerStyle[this.props.position]]}>
        {this.renderAvatar()}
      </View>
    );
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      marginRight: 8
    },
    onTop: {
      alignSelf: "flex-start"
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
      alignSelf: "flex-start"
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
  nextMessage: {},
  containerStyle: {},
  imageStyle: {},
  //TODO: remove in next major release
  isSameDay: warnDeprecated(isSameDay),
  isSameUser: warnDeprecated(isSameUser)
};

Avatar.propTypes = {
  renderAvatarOnTop: React.PropTypes.bool,
  position: React.PropTypes.oneOf(['left', 'right']),
  currentMessage: React.PropTypes.object,
  nextMessage: React.PropTypes.object,
  containerStyle: React.PropTypes.shape({
    left: View.propTypes.style,
    right: View.propTypes.style,
  }),
  imageStyle: React.PropTypes.shape({
    left: View.propTypes.style,
    right: View.propTypes.style,
  }),
  //TODO: remove in next major release
  isSameDay: React.PropTypes.func,
  isSameUser: React.PropTypes.func
};
