import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';


class Message extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {this.props.text}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'blue',
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  text: {
    color: 'white',
  },
});

export default Message;
