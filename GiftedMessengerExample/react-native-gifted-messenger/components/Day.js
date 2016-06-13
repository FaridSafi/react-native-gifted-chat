import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

import moment from 'moment';

class Day extends Component {
  render() {
    return (
      <View style={this.props.theme.Day.container}>
        <View style={this.props.theme.Day.wrapper}>
          <Text style={this.props.theme.Day.text}>
            {moment(this.props.time).calendar(null, {
              sameDay: '[Today]',
              nextDay: '[Tomorrow]',
              nextWeek: 'dddd',
              lastDay: '[Yesterday]',
              lastWeek: 'LL',
              sameElse: 'LL'
            })}
          </Text>
        </View>
      </View>
    );
  }
}

export default Day;
