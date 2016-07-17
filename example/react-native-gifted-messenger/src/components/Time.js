import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import moment from 'moment/min/moment-with-locales.min';

export default class Time extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <Text style={[styles.text, this.props.textStyle]}>
          {moment(this.props.currentMessage.createdAt).locale(this.props.locale).format('LT')}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
});

Time.defaultProps = {
  locale: 'en',
  containerStyle: {},
  textStyle: {},
  currentMessage: {
    createdAt: null,
  },
};
