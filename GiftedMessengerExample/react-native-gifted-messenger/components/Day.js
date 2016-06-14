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
        <View style={this.props.theme.Day.container}>
          <View style={this.props.theme.Day.wrapper}>
            <Text style={this.props.theme.Day.text}>
              {moment(this.props.time).locale(this.props.locale).format('LL')}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  }
}

export default Day;
