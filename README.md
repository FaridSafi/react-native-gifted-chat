# Gifted Chat
The most complete chat UI for React Native (formerly known as Gifted Messenger)

![](https://raw.githubusercontent.com/FaridSafi/react-native-gifted-chat/master/screenshots/gifted-chat-1.png)
![](https://raw.githubusercontent.com/FaridSafi/react-native-gifted-chat/master/screenshots/gifted-chat-2.png)


## Installation
`npm install react-native-gifted-chat --save`

## Android installation
Add `windowSoftInputMode` in your Android Manifest `android/app/src/main/AndroidManifest.xml`
```
<!-- ... -->
  android:label="@string/app_name"
  android:windowSoftInputMode="adjustResize" // <!-- add this -->
  android:configChanges="keyboard|keyboardHidden|orientation|screenSize">
<!-- ... -->
```

## Example
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
          createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
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
See [example/App.js](example/App.js)

## Message object
```javascript
{
  _id: 1,
  text: 'My message',
  createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
  user: {
    _id: 2,
    name: 'React Native',
    avatar: 'https://facebook.github.io/react/img/logo_og.png',
  },
  image: 'https://facebook.github.io/react/img/logo_og.png',
  // custom params
}
```


## Features
- Custom styles
- Custom actions
- Multiline TextInput
- Load earlier messages
- Avatar as initials
- Touchable links using [react-native-parsed-text](https://github.com/taskrabbit/react-native-parsed-text)
- Localized dates
- Copy text message to clipboard

## Props documentation
- Work in progress

## LICENSE
- [MIT](LICENSE)


Feel free to ask me questions on Twitter [@FaridSafi](https://www.twitter.com/FaridSafi) !
