import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';

import moment from 'moment';

class Message extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // return true;
    return false;
  }

  componentWillMount() {
  }

  renderTime() {
    return (
      <View style={styles[this.props.position].time}>
        <Text>
          {moment(this.props.time).calendar()}
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
        <Text style={styles[this.props.position].bubbleText}>
          {this.props.location.latitude}, {this.props.location.longitude}
        </Text>
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
      </View>
    );
  }

  render() {
    console.log('render message');
    return (
      <View>
        {this.renderTime()}
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
  time: {
    alignItems: 'center',
  },
  timeText: {
  },
  bubble: {
    backgroundColor: 'blue',
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
  },
  bubbleText: {
    color: 'white',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'green',
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
