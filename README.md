# Gifted Chat
The most complete chat UI for React Native (formerly known as Gifted Messenger)

## Installation
- `npm install react-native-gifted-chat --save`

## Android installation
- Add `windowSoftInputMode` in your Android Manifest `android/app/src/main/AndroidManifest.xml`
```
<!-- ... -->
  android:label="@string/app_name"
  android:windowSoftInputMode="adjustResize" // <!-- add this -->
  android:configChanges="keyboard|keyboardHidden|orientation|screenSize">
<!-- ... -->
```

## Minimal example
```jsx
import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {messages: []};
    this.onSend = this.onSend.bind(this);
  }
  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(Date.UTC(2016, 5, 11, 17, 10, 0)),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        },
      ],
    });
  }
  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }
  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={{
          _id: 1,
        }}
      />
    );
  }
}
```

## Advanced example
See [example project](example/App.js)

## Props documentation
- Work in progress

## LICENSE
- [MIT](LICENSE)


Feel free to ask me questions on Twitter [@FaridSafi](https://www.twitter.com/FaridSafi) !
