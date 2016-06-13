import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

import moment from 'moment';

class Time extends Component {
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
