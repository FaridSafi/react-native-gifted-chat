import React, { Component } from 'react';
import {
  View,
} from 'react-native';

import moment from 'moment';

import GiftedAvatar from 'react-native-gifted-avatar';
import Day from './Day';
import Bubble from './Bubble';

class Message extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.status !== nextProps.status) {
      return true;
    }
    if (this.props.nextMessage !== nextProps.nextMessage) {
      return true;
    }
    if (this.props.previousMessage !== nextProps.previousMessage) {
      return true;
    }
    return false;
  }

  applyStyles(defaultStyles, customStyles) {
    for (let key in defaultStyles) {
      if (defaultStyles.hasOwnProperty(key)) {
        Object.assign(defaultStyles[key], customStyles[key]);
      }
    }
  }

  isSameDay(currentMessage, diffMessage) {
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

  isSameUser(currentMessage, diffMessage) {
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
      if (!this.isSameDay(this.props, this.props.previousMessage)) {
        if (this.props.renderDay) {
          return this.props.renderDay(this.props.time);
        }
        return (
          <Day
            time={this.props.time}
            theme={this.props.theme}
          />
        );
      }
    }
    return null;
  }

  renderBubble() {
    if (this.props.renderBubble) {
      return this.props.renderBubble({
        ...this.props,
        isSameUser: this.isSameUser,
        isSameDay: this.isSameDay,
      });
    }
    return (
      <Bubble
        {...this.props}
        isSameUser={this.isSameUser}
        isSameDay={this.isSameDay}
      />
    );
  }

  renderAvatar() {
    if (!this.props.user) {
      return null;
    }

    if (this.isSameUser(this.props, this.props.nextMessage)) {
      // will display a placeholder (empty space)
      if (this.props.renderAvatar) {
        return (
          <View style={this.props.theme.Avatar[this.props.position].container}>
            {this.props.renderAvatar(null)}
          </View>
        );
      }
      return (
        <View style={this.props.theme.Avatar[this.props.position].container}>
          <GiftedAvatar/>
        </View>
      );
    }

    // will display the avatar
    if (this.props.renderAvatar) {
      return (
        <View style={this.props.theme.Avatar[this.props.position].container}>
          {this.props.renderAvatar(this.props.user)}
        </View>
      );
    }
    return (
      <View style={this.props.theme.Avatar[this.props.position].container}>
        <GiftedAvatar {...this.props.user}/>
      </View>
    );
  }

  render() {
    // console.log('render message');
    return (
      <View>
        {this.renderDay()}
        <View style={[this.props.theme.Message[this.props.position].container, {
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
  position: 'left',
  user: null,
  time: null,
  stylesCommon: {},
  stylesLeft: {},
  stylesRight: {},

  previousMessage: null,
  nextMessage: null,

  renderAvatar: null,

  renderDay: null,
  renderTime: null,
  renderLocation: null,
  renderBubbleText: null,
};

export default Message;
