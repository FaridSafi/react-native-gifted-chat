import React, { Component } from 'react';

import { GiftedChat, Actions, Bubble } from 'react-native-gifted-chat';
import CustomActions from './CustomActions';
import CustomView from './CustomView';

export default class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };

    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);
  }

  componentWillMount() {
    this.setState(() => {
      return {
        messages: require('./data/messages.js'),
      };
    });
  }

  onLoadEarlier() {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.prepend(previousState.messages, require('./data/old_messages.js')),
      };
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
    this.onReceive(); // for demo purpose
  }

  onReceive() {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
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

  renderCustomActions(props) {
    return (
      <CustomActions
        {...props}
      />
    );
  }

  /*
  renderActions(props) {
    const options = {
      'Action 1': (props) => {
        console.log('option 1');
      },
      'Action 2': (props) => {
        console.log('option 2');
      },
      'Cancel': () => {},
    };
    return (
      <Actions
        {...props}
        options={options}
      />
    );
  }
  */

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  }

  renderCustomView(props) {
    return (
      <CustomView
        {...props}
      />
    );
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        loadEarlier={true}
        onLoadEarlier={this.onLoadEarlier}
        user={{
          _id: 1,
        }}
        renderActions={this.renderCustomActions}
        renderBubble={this.renderBubble}
        renderCustomView={this.renderCustomView}
      />
    );
  }
}
