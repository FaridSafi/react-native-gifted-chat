import React, { Component } from 'react';
// import {
//   View,
//   Image,
// } from 'react-native';

import { GiftedChat, Actions } from 'react-native-gifted-chat';

export default class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };

    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderActions = this.renderActions.bind(this);
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
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
    // this.onReceive(); // for demo purpose
    // this.onReceive(); // for demo purpose
  }
  onReceive() {
    this.setState((previousState) => {
      return {
        ...previousState,
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
  renderActions(props) {
    const options = {
      'Take Photo': (props) => {
        console.log('option 1');
      },
      'Choose From Library': (props) => {
        console.log('option 2');
      },
      'Send Location': (props) => {
        console.log('option 3');
      },
      'Cancel': () => {},
    };
    // icon={() => {
    //   return (
    //     <Image
    //       style={{
    //         width: 20,
    //         height: 20,
    //       }}
    //       source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
    //     />
    //   );
    // }}
    return (
      <Actions
        {...props}
        options={options}
      />
    );
  }
  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        loadEarlier={true}
        user={{
          _id: 1,
        }}
        renderActions={this.renderActions}
      />
    );
  }
}
