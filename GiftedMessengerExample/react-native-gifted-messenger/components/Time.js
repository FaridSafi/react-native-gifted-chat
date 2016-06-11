import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';

import moment from 'moment';

class Time extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>
          {moment(this.props.time).calendar()}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default Time;
