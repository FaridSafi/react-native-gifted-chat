import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import moment from 'moment/min/moment-with-locales.min';

export default class Time extends Component {
  render() {
    return (
      <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
        <Text style={[styles[this.props.position].text, this.props.textStyle[this.props.position]]}>
          {moment(this.props.currentMessage.createdAt).locale(this.context.getLocale()).format('LT')}
        </Text>
      </View>
    );
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 5,
    },
    text: {
      fontSize: 11,
      color: '#aaa',
      backgroundColor: 'transparent',
      textAlign: 'right',
    },
  }),
  right: StyleSheet.create({
    container: {
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 5,
    },
    text: {
      fontSize: 11,
      color: '#fff',
      backgroundColor: 'transparent',
      textAlign: 'right',
    },
  }),
};

Time.contextTypes = {
  getLocale: PropTypes.func,
};

Time.defaultProps = {
  position: 'left',
  containerStyle: {},
  textStyle: {},
  currentMessage: {
    createdAt: null,
  },
};
