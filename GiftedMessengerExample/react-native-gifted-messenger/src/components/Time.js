import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

import moment from 'moment/min/moment-with-locales.min';

class Time extends Component {
  render() {
    return (
      <View style={this.props.customStyles.Time.container}>
        <Text style={this.props.customStyles.Time.text}>
          {moment(this.props.time).locale(this.props.locale).format('LT')}
        </Text>
      </View>
    );
  }
}

Time.defaultProps = {
  'locale': 'en',
  'customStyles': {},
  'time': null,
};

export default Time;
