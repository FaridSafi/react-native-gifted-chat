import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

import moment from 'moment';
import GiftedAvatar from 'react-native-gifted-avatar';
import Day from './Day';
import Time from './Time';
import Location from './Location';
import BubbleText from './BubbleText';

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

  componentWillMount() {
    const stylesCommon = {
      container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        // marginBottom: 5,
        // marginTop: 5,
      },
      bubble: {
        marginLeft: 0,
        marginRight: 0,
        borderRadius: 10,
      },
    };

    this.applyStyles(stylesCommon, this.props.stylesCommon);

    const stylesLeft = {
      container: {
        justifyContent: 'flex-start',
        marginLeft: 5,
        marginRight: 0,
      },
      bubble: {
        backgroundColor: 'blue',
      },
      bubbleToNext: {
        borderBottomLeftRadius: 0,
      },
      bubbleToPrevious: {
        borderTopLeftRadius: 0,
      },
      avatarContainer: {
        marginRight: 5,
      },
    };

    this.applyStyles(stylesLeft, stylesCommon);

    const stylesRight = {
      container: {
        justifyContent: 'flex-end',
        marginLeft: 0,
        marginRight: 5,
      },
      bubble: {
        backgroundColor: 'purple',
      },
      bubbleToNext: {
        borderBottomRightRadius: 0,
      },
      bubbleToPrevious: {
        borderTopRightRadius: 0,
      },
      avatarContainer: {
        marginLeft: 5,
      },
    };

    this.applyStyles(stylesRight, stylesCommon);

    if (this.props.position === 'right') {
      this.styles = Object.assign({}, stylesCommon, stylesRight);
      this.applyStyles(this.styles, this.props.stylesRight);
    } else {
      this.styles = Object.assign({}, stylesCommon, stylesLeft);
      this.applyStyles(this.styles, this.props.stylesLeft);
    }
  }

  isNextMessageSameDay() {
    let diff = 0;
    if (this.props.nextMessage && this.props.nextMessage.time) {
      diff = Math.abs(moment(this.props.nextMessage.time).startOf('day').diff(moment(this.props.time).startOf('day'), 'days'));
    } else {
      diff = 1;
    }
    if (diff === 0) {
      return true;
    }
    return false;
  }

  isPreviousMessageSameDay() {
    let diff = 0;
    if (this.props.previousMessage && this.props.previousMessage.time) {
      diff = Math.abs(moment(this.props.previousMessage.time).startOf('day').diff(moment(this.props.time).startOf('day'), 'days'));
    } else {
      diff = 1;
    }
    if (diff === 0) {
      return true;
    }
    return false;
  }

  isNextMessageSameUser() {
    if ((this.props.nextMessage === null || this.props.nextMessage.user === null) && this.props.user === null) {
      return true;
    }

    if (this.props.nextMessage && this.props.nextMessage.user && this.props.user) {
      if (this.props.nextMessage.user.id === this.props.user.id) {
        return true;
      }
    }
    return false;
  }

  isPreviousMessageSameUser() {
    if ((this.props.previousMessage === null || this.props.previousMessage.user === null) && this.props.user === null) {
      return true;
    }

    if (this.props.previousMessage && this.props.previousMessage.user && this.props.user) {
      if (this.props.previousMessage.user.id === this.props.user.id) {
        return true;
      }
    }
    return false;
  }

  renderDay() {
    if (this.props.time) {
      if (!this.isPreviousMessageSameDay()) {
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

  handleBubbleCorners() {
    let cornerStyles = {};
    if (this.isNextMessageSameUser() && this.isNextMessageSameDay()) {
      cornerStyles = {
        ...cornerStyles,
        ...this.styles.bubbleToNext,
      };
    }
    if (this.isPreviousMessageSameUser() && this.isPreviousMessageSameDay()) {
      cornerStyles = {
        ...cornerStyles,
        ...this.styles.bubbleToPrevious,
      };
    }
    return cornerStyles;
  }

  renderBubble() {
    return (
      <View style={[this.styles.bubble, this.handleBubbleCorners()]}>
        {this.renderLocation()}
        {this.renderBubbleText()}
        {this.renderTime()}
      </View>
    );
  }

  renderBubbleText() {
    if (this.props.text) {
      if (this.props.renderBubbleText) {
        this.props.renderBubbleText(this.props.text);
      }
      return (
        <BubbleText
          text={this.props.text}
          theme={this.props.theme}
        />
      );
    }
    return null;
  }

  renderLocation() {
    if (this.props.location) {
      if (this.props.renderLocation) {
        this.props.renderLocation(this.props.location);
      }
      return (
        <Location
          location={this.props.location}
          theme={this.props.theme}
        />
      );
    }
    return null;
  }

  renderTime() {
    if (this.props.time) {
      if (this.props.renderTime) {
        return this.props.renderTime(this.props.time);
      }
      return (
        <Time
          time={this.props.time}
          theme={this.props.theme}
        />
      );
    }
    return null;
  }

  renderAvatar() {
    if (!this.props.user) {
      return null;
    }

    if (this.isNextMessageSameUser()) {
      // will display a placeholder (empty space)
      if (this.props.renderAvatar) {
        return (
          <View style={this.styles.avatarContainer}>
            {this.props.renderAvatar(null)}
          </View>
        );
      }
      return (
        <View style={this.styles.avatarContainer}>
          <GiftedAvatar/>
        </View>
      );
    }

    // will display the avatar
    if (this.props.renderAvatar) {
      return (
        <View style={this.styles.avatarContainer}>
          {this.props.renderAvatar(this.props.user)}
        </View>
      );
    }
    return (
      <View style={this.styles.avatarContainer}>
        <GiftedAvatar {...this.props.user}/>
      </View>
    );
  }

  render() {
    // console.log('render message');
    return (
      <View>
        {this.renderDay()}
        <View style={[this.styles.container, {
          marginBottom: this.isNextMessageSameUser() ? 2 : 10,
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
