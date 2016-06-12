import React, { Component } from 'react';
import {
} from 'react-native';

import GiftedMessenger from './react-native-gifted-messenger/GiftedMessenger';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
      ],
    };
  }

  componentWillMount() {
    setTimeout(() => {
      this.setState({
        messages: [
          {key: Math.round(Math.random() * 100000), avatar: 'https://facebook.github.io/react/img/logo_og.png', position: 'left', text: 'Newest Message', time: new Date(Date.UTC(2016, 5, 11, 17, 30, 0))},
          {key: Math.round(Math.random() * 100000), name: 'Farid Safi', position: 'right', location: {longitude: -122.04120235, latitude: 37.33756603}, time: new Date(Date.UTC(2016, 5, 11, 17, 10, 0))},
          {key: Math.round(Math.random() * 100000), position: 'left', text: 'Yesterday', time: new Date(Date.UTC(2016, 5, 11, 17, 9, 0))},
          {key: Math.round(Math.random() * 100000), position: 'right', text: 'Message', time: new Date(Date.UTC(2016, 5, 11, 17, 0, 0))},
          {key: Math.round(Math.random() * 100000), position: 'right', text: 'Message', time: new Date(Date.UTC(2016, 5, 9, 17, 0, 0))},
          {key: Math.round(Math.random() * 100000), position: 'right', text: 'Message', time: new Date(Date.UTC(2016, 5, 8, 17, 0, 0))},
          {key: Math.round(Math.random() * 100000), position: 'right', text: 'Message', time: new Date(Date.UTC(2016, 5, 7, 17, 0, 0))},
          {key: Math.round(Math.random() * 100000), position: 'right', text: 'Message', time: new Date(Date.UTC(2016, 5, 6, 17, 0, 0))},
          {key: Math.round(Math.random() * 100000), position: 'right', text: 'Message', time: new Date(Date.UTC(2016, 5, 5, 17, 0, 0))},
          {key: Math.round(Math.random() * 100000), position: 'right', text: 'Message', time: new Date(Date.UTC(2016, 5, 4, 17, 0, 0))},
          {key: Math.round(Math.random() * 100000), position: 'right', text: 'Message', time: new Date(Date.UTC(2016, 5, 3, 17, 0, 0))},
          {key: Math.round(Math.random() * 100000), position: 'right', text: 'Message', time: new Date(Date.UTC(2016, 5, 2, 17, 0, 0))},
          {key: Math.round(Math.random() * 100000), position: 'right', text: '1 june', time: new Date(Date.UTC(2016, 5, 1, 17, 0, 0))},
          {key: Math.round(Math.random() * 100000), position: 'right', text: '20 may', time: new Date(Date.UTC(2016, 4, 20, 17, 0, 0))},
          {key: Math.round(Math.random() * 100000), position: 'left', text: 'Oldest Message', time: new Date(Date.UTC(2016, 4, 1, 17, 0, 0))},
        ]
      });
    }, 0); // simulating network

  }

  componentDidMount() {
    // setTimeout(() => {
    //   const messages = this.state.messages.slice(0);
    //   messages.shift();
    //
    //   this.setState({
    //     messages: messages,
    //   })
    // }, 2000);
  }

  render() {
    return (
      <GiftedMessenger
        messages={this.state.messages}
        onSend={this.onSend.bind(this)}

      />
    );
  }

  onSend(message) {
    this.setState({
      messages: GiftedMessenger.append(this.state.messages, {
        ...message,
        time: new Date(),
        name: 'Developer',
        avatar: 'https://facebook.github.io/react/img/logo_og.png',
        key: Math.round(Math.random() * 100000),
      }),
    });
  }
}

export default App;
