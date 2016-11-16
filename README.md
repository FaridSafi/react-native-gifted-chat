# Gifted Chat
The most complete chat UI for React Native (formerly known as Gifted Messenger)

![](https://raw.githubusercontent.com/FaridSafi/react-native-gifted-chat/master/screenshots/gifted-chat-1.png)
![](https://raw.githubusercontent.com/FaridSafi/react-native-gifted-chat/master/screenshots/gifted-chat-2.png)

## Dependency
React Native minimum version `0.29.0`

## Installation
`npm install react-native-gifted-chat --save`

## Android installation
- Add `android:windowSoftInputMode="adjustResize"` to your Android Manifest `android/app/src/main/AndroidManifest.xml`
```xml
<!-- ... -->
<activity
  android:name=".MainActivity"
  android:label="@string/app_name"
  android:windowSoftInputMode="adjustResize"
  android:configChanges="keyboard|keyboardHidden|orientation|screenSize">
<!-- ... -->
```

- If you plan to use `GiftedChat` inside a `Modal`, see [#200](https://github.com/FaridSafi/react-native-gifted-chat/issues/200)


## Example
```jsx
import { GiftedChat } from 'react-native-gifted-chat';

class Example extends React.Component {
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
  // additional custom parameters
}
```

## Props

- **`messages`** _(Array)_ - messages to display
- **`user`** _(Object)_ - user sending the messages `{_id, name, avatar}`
- **`onSend`** _(Function)_ - function to call when sending a message
- **`locale`** _(String)_ - localize the dates
- **`isAnimated`** _(Bool)_ - animates the view when the keyboard appears
- **`loadEarlier`** _(Bool)_ - enables the load earlier message button
- **`onLoadEarlier`** _(Function)_ - function to call when loading earlier messages
- **`isLoadingEarlier`** _(Bool)_ - display an ActivityIndicator when loading earlier messages
- **`renderLoading`** _(Function)_ - render a loading view when initializing
- **`renderLoadEarlier`** _(Function)_ - render the load earlier button
- **`onPressAvatar`** _(Function)_ - callback on pressing the avatar; returns the user ID
- **`renderAvatar`** _(Function)_ - renders the message avatar
- **`renderBubble`** _(Function)_ - render the message bubble
- **`renderMessage`** _(Function)_ - render the message container
- **`renderMessageText`** _(Function)_ - render the message text
- **`renderMessageImage`** _(Function)_ - render the message image
- **`renderCustomView`** _(Function)_ - render a custom view inside the bubble
- **`renderDay`** _(Function)_ - render the day above a message
- **`renderTime`** _(Function)_ - render the message time
- **`renderFooter`** _(Function)_ - renders a fixed bottom view. Can be used for 'is typing message', see [example/App.js](example/App.js)
- **`renderInputToolbar`** _(Function)_ - render the composer container
- **`renderActions`** _(Function)_ - renders an action button on the left of the message composer
- **`renderComposer`** _(Function)_ - render the text input message composer
- **`renderSend`** _(Function)_ - render the send button
- **`renderAccessory`** _(Function)_ - renders a second line of actions below the message composer
- **`bottomOffset`** _(Integer)_ - distance of the chat from the bottom of the screen, useful if you display a tab bar


## Features
- Custom components
- InputToolbar avoiding keyboard
- Multiline TextInput
- Load earlier messages
- Avatar as initials
- Touchable links using [react-native-parsed-text](https://github.com/taskrabbit/react-native-parsed-text)
- Localized dates
- Copy text messages to clipboard


## License
- [MIT](LICENSE)


Feel free to ask me questions on Twitter [@FaridSafi](https://www.twitter.com/FaridSafi) !
