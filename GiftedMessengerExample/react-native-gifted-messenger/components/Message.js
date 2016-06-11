import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';


class Message extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this._styles = {
      container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 5,
        marginTop: 5,
      },
      bubble: {
        backgroundColor: 'blue',
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 10,
      },
      bubbleText: {
        color: 'white',
      },
      avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'green',
      }
    };

    if (this.props.position === 'left') {
      this._styles.container = {
        ...this._styles.container,
        justifyContent: 'flex-start',
        marginLeft: 5,
        marginRight: 0,
      }
    } else {
      this._styles.container = {
        ...this._styles.container,
        justifyContent: 'flex-end',
        marginLeft: 0,
        marginRight: 5,
      }
    }
  }

  renderAvatar() {
    // TODO replace by image from props
    return (
      <View style={this._styles.avatar} />
    );
  }

  renderBubble() {
    return (
      <View style={this._styles.bubble}>
        <Text style={this._styles.bubbleText}>
          {this.props.text}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={this._styles.container}>
        {this.props.position === 'left' ? this.renderAvatar() : null}
        {this.renderBubble()}
        {this.props.position === 'right' ? this.renderAvatar() : null}
      </View>
    );
  }
}

Message.defaultProps = {
  position: 'right',
};

export default Message;
