import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';

import moment from 'moment';

import Avatar from './Avatar';
import Bubble from './Bubble';
import Day from './Day';

class Message extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    // not implemented yet
    // if (this.props.status !== nextProps.status) {
    //   return true;
    // }
    if (this.props.nextMessage !== nextProps.nextMessage) {
      return true;
    }
    if (this.props.previousMessage !== nextProps.previousMessage) {
      return true;
    }
    return false;
  }

  isSameDay(currentMessage = {}, diffMessage = null) {
    let diff = 0;
    if (diffMessage && diffMessage.time && currentMessage && currentMessage.time) {
      diff = Math.abs(moment(diffMessage.time).startOf('day').diff(moment(currentMessage.time).startOf('day'), 'days'));
    } else {
      diff = 1;
    }
    if (diff === 0) {
      return true;
    }
    return false;
  }

  isSameUser(currentMessage = {}, diffMessage = null) {
    if ((diffMessage === null || diffMessage.user === null) && currentMessage.user === null) {
      return true;
    }
    if (diffMessage && diffMessage.user && currentMessage.user) {
      if (diffMessage.user.id === currentMessage.user.id) {
        return true;
      }
    }
    return false;
  }

  renderDay() {
    if (this.props.time) {
      const dayProps = {
        ...this.props,
        isSameUser: this.isSameUser,
        isSameDay: this.isSameDay,
      };
      if (this.props.renderDay) {
        return this.props.renderDay(dayProps);
      }
      return <Day {...dayProps}/>;
    }
    return null;
  }

  renderBubble() {
    const bubbleProps = {
      ...this.props,
      isSameUser: this.isSameUser,
      isSameDay: this.isSameDay,
    };
    if (this.props.renderBubble) {
      return this.props.renderBubble(bubbleProps);
    }
    return <Bubble {...bubbleProps}/>;
  }

  renderAvatar() {
    if (this.props.user) {
      const avatarProps = {
        ...this.props,
        isSameUser: this.isSameUser,
        isSameDay: this.isSameDay,
      };
      if (this.props.renderAvatar) {
        return this.props.renderAvatar(avatarProps);
      }
      return <Avatar {...avatarProps}/>;
    }
    return null;
  }

  render() {
    // console.log('render message', this.props.text);
    return (
      <View>
        {this.renderDay()}
        <View style={[this.props.customStyles.Message[this.props.position].container, {
          marginBottom: this.isSameUser(this.props, this.props.nextMessage) ? 2 : 10,
        }]}>
          {this.props.position === 'left' ? this.renderAvatar() : null}
          {this.renderBubble()}
          {this.props.position === 'right' ? this.renderAvatar() : null}
        </View>
      </View>
    );
  }
}

Message.defaultProps = {
  customStyles: {},
  renderAvatar: null,
  renderBubble: null,
  renderDay: null,
  position: 'left',
  time: null,
  user: null,
  nextMessage: null,
  previousMessage: null,
};

export default Message;
