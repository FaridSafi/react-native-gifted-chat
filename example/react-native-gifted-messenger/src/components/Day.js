import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

import moment from 'moment/min/moment-with-locales.min';

class Day extends Component {
  render() {
    if (!this.props.isSameDay(this.props.currentMessage, this.props.previousMessage)) {
      return (
        <View style={this.props.customStyles.Day.container}>
          <View style={this.props.customStyles.Day.wrapper}>
            <Text style={this.props.customStyles.Day.text}>
              {moment(this.props.currentMessage.createdAt).locale(this.props.locale).format('LL')}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  }
}

Day.defaultProps = {
  locale: 'en',
  customStyles: {},
  isSameDay: () => {},
  currentMessage: {
    // TODO test if crash when createdAt === null
    createdAt: null,
  },
  previousMessage: {},
};

export default Day;
