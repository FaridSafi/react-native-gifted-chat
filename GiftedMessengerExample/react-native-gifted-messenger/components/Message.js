import React, { Component } from 'react';
import {
  Text,
  View,
  MapView,
  Linking,
  TouchableOpacity,
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
        marginLeft: 0,
        marginRight: 0,
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
          <View style={this.styles.day}>
            <Text style={this.styles.dayText}>
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
      if (this.props.renderTime) {
        return this.props.renderTime(this.props.time);
      }
      return (
        <View style={this.styles.time}>
          <Text style={this.styles.timeText}>
            {moment(this.props.time).format('LT')}
          </Text>
        </View>
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
        <TouchableOpacity onPress={() => {
          // TODO test android
          // TODO implement google map url
          const url = `http://maps.apple.com/?ll=${this.props.location.latitude},${this.props.location.longitude}`;
          Linking.canOpenURL(url).then(supported => {
            if (supported) {
              return Linking.openURL(url);
            }
          }).catch(err => console.error('An error occurred', err));
        }}>
          <MapView
            style={this.styles.mapView}
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
        </TouchableOpacity>
      );
    }
    return null;
  }

  renderText() {
    if (this.props.text) {
      if (this.props.renderText) {
        this.props.renderText(this.props.text);
      }
      return (
        <Text style={this.styles.bubbleText}>
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
  renderText: null,
};

export default Message;
