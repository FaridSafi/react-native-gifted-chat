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
      <View style={[styles.container, this.props.containerStyle]}>
        <Text style={[styles.text, this.props.textStyle]}>
          {moment(this.props.currentMessage.createdAt).locale(this.context.getLocale()).format('LT')}
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

Time.contextTypes = {
  getLocale: PropTypes.func,
};

Time.defaultProps = {
  containerStyle: {},
  textStyle: {},
  currentMessage: {
    createdAt: null,
  },
};
