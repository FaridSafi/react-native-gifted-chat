import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
} from 'react-native';


class Avatar extends Component {

  componentWillMount() {
    const name = this.props.name.split(' ');
    if (name.length === 1) {
      this.avatarName = `${name[0].charAt(0)}`;
    } else if (name.length > 1) {
      this.avatarName = `${name[0].charAt(0)}${name[1].charAt(0)}`;
    } else {
      this.avatarName = '';
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    if (this.props.avatar) {
      return (
        <Image
          source={{uri: this.props.avatar}}
          style={styles.avatar}
        />
      );
    }

    return (
      <View
        style={[styles.avatar, {
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#731eb5',
        }]}
      >
        <Text style={{
          color: '#fff',
          fontSize: 16,
          backgroundColor: 'transparent',
        }}>
          {this.avatarName}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default Avatar;
