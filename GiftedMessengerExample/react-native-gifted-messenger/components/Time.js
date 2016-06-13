import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

import moment from 'moment';
import {setLocale} from '../Locale';

class Time extends Component {
  componentWillMount() {
    if (this.props.locale) {
      setLocale(this.props.locale);
    }
  }
  render() {
    return (
      <View style={this.props.theme.Time.container}>
        <Text style={this.props.theme.Time.text}>
          {moment(this.props.time).format('LT')}
        </Text>
      </View>
    );
  }
}

export default Time;
