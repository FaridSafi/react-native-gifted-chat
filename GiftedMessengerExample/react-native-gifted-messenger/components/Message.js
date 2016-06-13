import React, { Component } from 'react';
import {
  Text,
  View,
  MapView,
} from 'react-native';

import moment from 'moment';
import GiftedAvatar from 'react-native-gifted-avatar';

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

  componentWillMount() {
  }

  renderDay() {
    if (this.props.time) {
      if (!this.isPreviousMessageSameDay()) {
        return (
          <View style={styles[this.props.position].day}>
            <Text style={styles[this.props.position].dayText}>
              {moment(this.props.time).calendar(null, {
                sameDay: '[Today]',
                nextDay: '[Tomorrow]',
                nextWeek: 'dddd',
                lastDay: '[Yesterday]',
                lastWeek: 'LL',
                sameElse: 'LL'
              })}
            </Text>
          </View>
        );
      }
    }
    return null;
  }

  renderTime() {
    if (this.props.time) {
      return (
        <View style={styles[this.props.position].time}>
          <Text style={styles[this.props.position].timeText}>
            {moment(this.props.time).format('LT')}
          </Text>
        </View>
      );
    }
    return null;
  }

  renderLocation() {
    if (this.props.location) {
      return (
        <MapView
          style={styles[this.props.position].mapView}
          region={{
            latitude: this.props.location.latitude,
            longitude: this.props.location.longitude,
          }}
          annotations={[{
            latitude: this.props.location.latitude,
            longitude: this.props.location.longitude,
          }]}
          scrollEnabled={false}
          zoomEnabled={false}
        />
      );
    }
    return null;
  }

  renderText() {
    if (this.props.text) {
      return (
        <Text style={styles[this.props.position].bubbleText}>
          {this.props.text}
        </Text>
      );
    }
    return null;
  }

  handleBubbleCorners() {
    let cornerStyles = {};
    if (this.isNextMessageSameUser() && this.isNextMessageSameDay()) {
      cornerStyles = {
        ...cornerStyles,
        ...styles[this.props.position].bubbleToNext,
      };
    }
    if (this.isPreviousMessageSameUser() && this.isPreviousMessageSameDay()) {
      cornerStyles = {
        ...cornerStyles,
        ...styles[this.props.position].bubbleToPrevious,
      };
    }
    return cornerStyles;
  }

  renderBubble() {
    return (
      <View style={[styles[this.props.position].bubble, this.handleBubbleCorners()]}>
        {this.renderLocation()}
        {this.renderText()}
        {this.renderTime()}
      </View>
    );
  }

  renderAvatar() {
    if (!this.props.user) {
      return null;
    }

    if (this.isNextMessageSameUser()) {
      // will display a placeholder (empty space)
      if (this.props.renderAvatar) {
        return this.props.renderAvatar(null);
      }
      return (
        <GiftedAvatar/>
      );
    } else {
      const avatarProps = {
        user: this.props.user,
        onPress: this.props.onPressAvatar,
      };

      // will display the avatar
      if (this.props.renderAvatar) {
        return this.props.renderAvatar(avatarProps);
      }
      return (
        <GiftedAvatar {...avatarProps}/>
      );
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
    if (this.props.nextMessage && this.props.nextMessage.user && this.props.user) {
      if (this.props.nextMessage.user.id === this.props.user.id) {
        return true;
      }
    }
    return false;
  }

  isPreviousMessageSameUser() {
    if (this.props.previousMessage && this.props.previousMessage.user && this.props.user) {
      if (this.props.previousMessage.user.id === this.props.user.id) {
        return true;
      }
    }
    return false;
  }

  render() {
    console.log('render message');
    return (
      <View>
        {this.renderDay()}
        <View style={[styles[this.props.position].container, {
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
};

const stylesCommon = {
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    // marginBottom: 5,
    // marginTop: 5,
  },
  day: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  dayText: {
    fontSize: 12,
  },
  time: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
  },
  timeText: {
    fontSize: 11,
    color: '#fff',
    backgroundColor: 'transparent',
    textAlign: 'right',
  },
  bubble: {
    backgroundColor: 'blue',
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
  },
  bubbleText: {
    color: 'white',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 8,
    margin: 3,
  },
};

const stylesLeft = {
  container: {
    ...stylesCommon.container,
    justifyContent: 'flex-start',
    marginLeft: 5,
    marginRight: 0,
  },
  bubbleToNext: {
    ...stylesCommon.bubbleToNext,
    borderBottomLeftRadius: 0,
  },
  bubbleToPrevious: {
    ...stylesCommon.bubbleToPrevious,
    borderTopLeftRadius: 0,
  },
};

const stylesRight = {
  container: {
    ...stylesCommon.container,
    justifyContent: 'flex-end',
    marginLeft: 0,
    marginRight: 5,
  },
  bubbleToNext: {
    ...stylesCommon.bubbleToNext,
    borderBottomRightRadius: 0,
  },
  bubbleToPrevious: {
    ...stylesCommon.bubbleToPrevious,
    borderTopRightRadius: 0,
  },
};

const styles = {
  left: Object.assign({}, stylesCommon, stylesLeft),
  right: Object.assign({}, stylesCommon, stylesRight),
};

export default Message;
