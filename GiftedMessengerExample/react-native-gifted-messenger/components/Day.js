import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

import moment from 'moment/min/moment-with-locales.min';

class Day extends Component {
  render() {
    if (!this.props.isSameDay(this.props, this.props.previousMessage)) {
      return (
        <View style={this.props.customStyles.Day.container}>
          <View style={this.props.customStyles.Day.wrapper}>
            <Text style={this.props.customStyles.Day.text}>
              {moment(this.props.time).locale(this.props.locale).format('LL')}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  }
}

Day.defaultProps = {
  'locale': 'en',
  'customStyles': {},
  'isSameDay': () => {},
  // TODO test if it crash if time = null
  time: null,
  'previousMessage': null,
};

export default Day;
