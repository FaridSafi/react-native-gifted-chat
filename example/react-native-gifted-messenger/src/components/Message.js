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
    // if (this.props.currentMessage.status !== nextProps.currentMessage.status) {
    //   return true;
    // }
    if (this.props.nextMessage._id !== nextProps.nextMessage._id) {
      return true;
    }
    if (this.props.previousMessage._id !== nextProps.previousMessage._id) {
      return true;
    }
    return false;
  }

  isSameDay(currentMessage = {}, diffMessage = {}) {
    let diff = 0;
    if (diffMessage.createdAt && currentMessage.createdAt) {
      diff = Math.abs(moment(diffMessage.createdAt).startOf('day').diff(moment(currentMessage.createdAt).startOf('day'), 'days'));
    } else {
      diff = 1;
    }
    if (diff === 0) {
      return true;
    }
    return false;
  }

  isSameUser(currentMessage = {}, diffMessage = {}) {
    if (diffMessage.user && currentMessage.user) {
      if (diffMessage.user._id === currentMessage.user._id) {
        return true;
      }
    }
    return false;
  }

  renderDay() {
    if (this.props.currentMessage.createdAt) {
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
    if (this.props.user._id !== this.props.currentMessage.user._id) {
      const avatarProps = {
        ...this.props,
        isSameUser: this.isSameUser,
        isSameDay: this.isSameDay,
      };
      return <Avatar {...avatarProps}/>;
    }
    return null;
  }

  render() {
    // console.log('render message', this.props.currentMessage.text);
    return (
      <View>
        {this.renderDay()}
        <View style={[this.props.customStyles.Message[this.props.position].container, {
          marginBottom: this.isSameUser(this.props.currentMessage, this.props.nextMessage) ? 2 : 10,
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
  currentMessage: {},
  nextMessage: {},
  previousMessage: {},
  user: {},
};

export default Message;
