import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import moment from 'moment/min/moment-with-locales.min';

export default class Day extends Component {
  render() {
    if (!this.props.isSameDay(this.props.currentMessage, this.props.previousMessage)) {
      return (
        <View style={[styles.container, this.props.containerStyle]}>
          <View style={[styles.wrapper, this.props.wrapperStyle]}>
            <Text style={[styles.text, this.props.textStyle]}>
              {moment(this.props.currentMessage.createdAt).locale(this.props.locale).format('LL')}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  wrapper: {
    alignItems: 'center',
    backgroundColor: '#ccc',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  text: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 12,
  },
});

Day.defaultProps = {
  locale: 'en',
  containerStyle: {},
  wrapperStyle: {},
  textStyle: {},
  isSameDay: () => {},
  currentMessage: {
    // TODO test if crash when createdAt === null
    createdAt: null,
  },
  previousMessage: {},
};
