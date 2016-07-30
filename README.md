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


## Props

- **`messages`** _(Array)_ - messages to display
- **`user`** _(Object)_ - user sending the messages
- **`onSend`** _(Function)_ - function to call when sending a message
- **`loadEarlier`** _(Bool)_ - enables the load earlier message button
- **`onLoadEarlier`** _(Function)_ - function to call when loading earlier messages
- **`locale`** _(String)_ - localize the dates
- **`isAnimated`** _(Bool)_ - animates the view when the keyboard appears
- **`renderAccessory`** _(Function)_ - renders a second line of actions below the message composer
- **`renderActions`** _(Function)_ - renders an action button on the left of the message composer
- **`renderAvatar`** _(Function)_ - renders the sender avatar
- **`renderBubble`** _(Function)_ - render the message bubble
- **`renderParsedText`** _(Function)_ - render the message text
- **`renderBubbleImage`** _(Function)_ - render the message image
- **`renderComposer`** _(Function)_ - render the text input message composer
- **`renderCustomView`** _(Function)_ - render a custom view inside the bubble
- **`renderDay`** _(Function)_ - render the day above a message
- **`renderInputToolbar`** _(Function)_ - render the composer container
- **`renderLoadEarlier`** _(Function)_ - render the load earlier button
- **`renderLoading`** _(Function)_ - render a loading view when initializing
- **`renderMessage`** _(Function)_ - render the message container
- **`renderSend`** _(Function)_ - render the send button
- **`renderTime`** _(Function)_ - render the message time


## Features
- Custom styles
- Custom actions
- Multiline TextInput
- Load earlier messages
- Avatar as initials
- Touchable links using [react-native-parsed-text](https://github.com/taskrabbit/react-native-parsed-text)
- Localized dates
- Copy text message to clipboard


## LICENSE
- [MIT](LICENSE)


Feel free to ask me questions on Twitter [@FaridSafi](https://www.twitter.com/FaridSafi) !
