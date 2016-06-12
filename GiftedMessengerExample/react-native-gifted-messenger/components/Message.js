import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  MapView,
} from 'react-native';

import moment from 'moment';

class Message extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.status !== nextProps.status) {
      return true;
    }
    return false;
  }

  componentWillMount() {
  }

  renderDay() {
    let diff = 0;
    if (this.props.previousMessage) {
      diff = Math.abs(moment(this.props.previousMessage.time).startOf('day').diff(moment(this.props.time).startOf('day'), 'days'));
    } else {
      diff = 1;
    }

    if (diff > 0) {
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
    return null;
  }

  renderTime() {
    return (
      <View style={styles[this.props.position].time}>
        <Text style={styles[this.props.position].timeText}>
          {moment(this.props.time).format('LT')}
        </Text>
      </View>
    );
  }

  renderAvatar() {
    // TODO replace by image from props
    return (
      <View style={styles[this.props.position].avatar} />
    );
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

  renderBubble() {
    return (
      <View style={styles[this.props.position].bubble}>
        {this.renderLocation()}
        {this.renderText()}
        {this.renderTime()}
      </View>
    );
  }

  render() {
    return (
      <View>
        {this.renderDay()}
        <View style={styles[this.props.position].container}>
          {this.props.position === 'left' ? this.renderAvatar() : null}
          {this.renderBubble()}
          {this.props.position === 'right' ? this.renderAvatar() : null}
        </View>
      </View>
    );
  }
}

Message.defaultProps = {
  position: 'right',
};

const stylesCommon = {
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 5,
    marginTop: 5,
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'green',
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
};

const stylesRight = {
  container: {
    ...stylesCommon.container,
    justifyContent: 'flex-end',
    marginLeft: 0,
    marginRight: 5,
  },
};

const styles = {
  left: StyleSheet.create(Object.assign({}, stylesCommon, stylesLeft)),
  right: StyleSheet.create(Object.assign({}, stylesCommon, stylesRight)),
};

export default Message;
