import React, { Component } from 'react';
import {
  View,
} from 'react-native';

import {
  GiftedMessenger
} from './react-native-gifted-messenger';

export default class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };

    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
  }
  componentWillMount() {
    this.setState({
      messages: require('./data/messages.js'),
    });
  }
  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        ...previousState,
        messages: GiftedMessenger.append(previousState.messages, messages),
      };
    });
    // this.onReceive(); // for demo purpose
    // this.onReceive(); // for demo purpose
  }
  onReceive() {
    this.setState((previousState) => {
      return {
        ...previousState,
        messages: GiftedMessenger.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text: 'Hodor',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Bot',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        }),
      };
    });
  }
  render() {
    return (
      <GiftedMessenger
        messages={this.state.messages}
        onSend={this.onSend}
        loadEarlier={true}
        user={{
          _id: 1,
        }}
      />
    );
  }
}
