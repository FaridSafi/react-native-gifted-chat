import React from 'react';
import {
  View,
  StyleSheet
} from 'react-native';

import Avatar from './Avatar';
import Bubble from './Bubble';
import Day from './Day';

import { isSameUser, isSameDay, warnDeprecated } from './utils';

export default class Message extends React.Component {

  renderDay() {
    if (this.props.currentMessage.createdAt) {
      const {containerStyle, ...dayProps} = this.props;
      if (this.props.renderDay) {
        return this.props.renderDay({
          ...dayProps,
          //TODO: remove in next major release
          isSameUser: warnDeprecated(isSameUser),
          isSameDay: warnDeprecated(isSameDay)
        });
      }
      return <Day {...dayProps}/>;
    }
    return null;
  }

  renderBubble() {
    const {containerStyle, ...bubbleProps} = this.props;
    if (this.props.renderBubble) {
      return this.props.renderBubble({
        ...bubbleProps,
        //TODO: remove in next major release
        isSameUser: warnDeprecated(isSameUser),
        isSameDay: warnDeprecated(isSameDay)
      });
    }
    return <Bubble {...bubbleProps}/>;
  }

  renderAvatar() {

    if (this.props.user._id === this.props.currentMessage.user._id) {
      return null;
    }

    const {containerStyle, ...other} = this.props;
    const avatarProps = {
      ...other,
      //TODO: remove in next major release
      isSameUser: warnDeprecated(isSameUser),
      isSameDay: warnDeprecated(isSameDay)
    };
    return <Avatar {...avatarProps}/>;

  }

  render() {
    return (
      <View>
        {this.renderDay()}
        <View style={[styles[this.props.position].container, {
          marginBottom: isSameUser(this.props.currentMessage, this.props.nextMessage) ? 2 : 10,
        }, this.props.containerStyle[this.props.position]]}>
          {this.props.position === 'left' ? this.renderAvatar() : null}
          {this.renderBubble()}
          {this.props.position === 'right' ? this.renderAvatar() : null}
        </View>
      </View>
    );
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginLeft: 8,
      marginRight: 0,
    },
  }),
  right: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      marginLeft: 0,
      marginRight: 8,
    },
  }),
};

Message.defaultProps = {
  renderAvatar: null,
  renderBubble: null,
  renderDay: null,
  position: 'left',
  currentMessage: {},
  nextMessage: {},
  previousMessage: {},
  user: {},
  containerStyle: {},
};

Message.propTypes = {
  renderAvatar: React.PropTypes.func,
  renderBubble: React.PropTypes.func,
  renderDay: React.PropTypes.func,
  position: React.PropTypes.oneOf(['left', 'right']),
  currentMessage: React.PropTypes.object,
  nextMessage: React.PropTypes.object,
  previousMessage: React.PropTypes.object,
  user: React.PropTypes.object,
  containerStyle: React.PropTypes.shape({
    left: View.propTypes.style,
    right: View.propTypes.style,
  }),
};
