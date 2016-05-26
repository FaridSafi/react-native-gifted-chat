import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native'

class Message extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00cccc',
    height: 50,
  }
});

export default Message;
