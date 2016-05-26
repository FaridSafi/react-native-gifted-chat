import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
} from 'react-native';

class Composer extends Component {
  render() {
    return (
      <View
        style={styles.container}
      >
        <TextInput style={styles.textInput}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
  },
  textInput: {
    backgroundColor: '#fff',
    flex: 1,
    margin: 3,
  }
});

export default Composer;
