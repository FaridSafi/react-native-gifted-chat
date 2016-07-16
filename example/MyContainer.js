import React, { Component } from 'react';

import {
  GiftedMessenger
} from './react-native-gifted-messenger';

export default class MyContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
    this.onSend = this.onSend.bind(this);
  }
  componentWillMount() {
    this.setState({
      messages: require('./data/messages.js'),
    });
  }
  onSend(messages = []) {
    this.setState({
      messages: GiftedMessenger.append(this.state.messages, messages),
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
