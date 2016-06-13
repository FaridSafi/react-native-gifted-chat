import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

import moment from 'moment';
import {setLocale} from '../Locale';

class Day extends Component {
  componentWillMount() {
    if (this.props.locale) {
      setLocale(this.props.locale);
    }
  }
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
