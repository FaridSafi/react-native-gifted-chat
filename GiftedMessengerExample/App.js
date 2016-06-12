import React, { Component } from 'react';
import {
} from 'react-native';

import GiftedMessenger from './react-native-gifted-messenger/GiftedMessenger';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }
  componentWillMount() {
    setTimeout(() => {
      this.setState({
        messages: [
          {key: Math.round(Math.random() * 10000), position: 'left', text: 'Newest Message', time: new Date(Date.UTC(2016, 6, 11, 17, 30, 0))},
          {key: Math.round(Math.random() * 10000), position: 'right', text: 'Message', time: new Date(Date.UTC(2016, 6, 11, 17, 10, 0))},
          {key: Math.round(Math.random() * 10000), position: 'left', text: 'Message', time: new Date(Date.UTC(2016, 6, 11, 17, 9, 0))},
          {key: Math.round(Math.random() * 10000), position: 'right', text: 'Message', time: new Date(Date.UTC(2016, 6, 11, 17, 0, 0))},
          {key: Math.round(Math.random() * 10000), position: 'right', text: 'Message', time: new Date(Date.UTC(2016, 6, 11, 17, 0, 0))},
          {key: Math.round(Math.random() * 10000), position: 'right', text: 'Message', time: new Date(Date.UTC(2016, 6, 11, 17, 0, 0))},
          {key: Math.round(Math.random() * 10000), position: 'left', text: 'Oldest Message', time: new Date(Date.UTC(2016, 6, 1, 17, 0, 0))},
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
        key: Math.round(Math.random() * 10000),
      }),
    });
  }
}

export default App;
