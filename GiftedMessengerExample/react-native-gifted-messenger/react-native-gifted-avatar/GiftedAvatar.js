import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

class Avatar extends Component {

  setAvatarColor() {
    const userName = this.props.name || '';
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
    // colors from https://flatuicolors.com/
    const colors = [
      '#2ecc71', // emerald
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
    if (!this.props.name && !this.props.avatar) {
      // render placeholder
      return (
        <View style={[
          defaultStyles.avatarStyle,
          {backgroundColor: 'transparent'},
          this.props.avatarStyle,
        ]}/>
      )
    }

    if (this.props.avatar) {
      return (
        <TouchableOpacity
          disabled={this.props.onPress ? false : true}
          onPress={() => {
            const {onPress, ...other} = this.props;
            this.props.onPress && this.props.onPress(other);
          }}
        >
          <Image
            source={{uri: this.props.avatar}}
            style={[defaultStyles.avatarStyle, this.props.avatarStyle]}
          />
        </TouchableOpacity>
      );
    }

    if (!this.avatarColor) {
      this.setAvatarColor();
    }

    return (
      <TouchableOpacity
        disabled={this.props.onPress ? false : true}
        onPress={() => {
          const {onPress, ...other} = this.props;
          this.props.onPress && this.props.onPress(other);
        }}
        style={[
          defaultStyles.avatarStyle,
          {backgroundColor: this.avatarColor},
          this.props.avatarStyle,
        ]}
      >
        <Text style={[defaultStyles.textStyle, this.props.textStyle]}>
          {this.avatarName}
        </Text>
      </TouchableOpacity>
    );
  }
}

Avatar.defaultProps = {
  name: null,
  avatar: null,
  onPress: null,

  avatarStyle: {},
  textStyle: {},
};

const defaultStyles = {
  avatarStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  textStyle: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'transparent',
    fontWeight: '100',
  },
};

export default Avatar;
