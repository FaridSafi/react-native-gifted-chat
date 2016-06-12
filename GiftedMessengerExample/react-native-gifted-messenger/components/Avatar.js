import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
} from 'react-native';

class Avatar extends Component {

  componentWillMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  setAvatarColor() {
    const userName = this.props.user.name || '';
    const name = userName.toUpperCase().split(' ');
    if (name.length === 1) {
      this.avatarName = `${name[0].charAt(0)}`;
    } else if (name.length > 1) {
      this.avatarName = `${name[0].charAt(0)}${name[1].charAt(0)}`;
    } else {
      this.avatarName = '';
    }

    let sumChars = 0;
    for(let i = 0; i < userName.length; i++) {
      sumChars += userName.charCodeAt(i);
    }

    // inspired by https://github.com/wbinnssmith/react-user-avatar
    const colors = [
      '#27ae60', // nephritis
      '#3498db', // peter river
      '#8e44ad', // wisteria
      '#e67e22', // carrot
      '#e74c3c', // alizarin
      '#1abc9c', // turquoise
      '#2c3e50', // midnight blue
    ];

    this.avatarColor = colors[sumChars % colors.length];
  }

  render() {
    if (this.props.user === null) {
      return (
        <View style={[styles.avatar, {
          backgroundColor: 'transparent',
        }]}/>
      )
    }

    if (this.props.user.avatar) {
      return (
        <Image
          source={{uri: this.props.user.avatar}}
          style={styles.avatar}
        />
      );
    }

    if (!this.avatarColor) {
      this.setAvatarColor();
    }

    return (
      <View
        style={[styles.avatar, {
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: this.avatarColor,
        }]}
      >
        <Text style={{
          color: '#fff',
          fontSize: 16,
          backgroundColor: 'transparent',
          fontWeight: '100',
        }}>
          {this.avatarName}
        </Text>
      </View>
    );
  }
}

Avatar.defaultProps = {
  user: null,
};

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
});

export default Avatar;
