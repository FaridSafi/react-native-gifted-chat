<p align="center" >
   <a href="https://reactnative.gallery/FaridSafi/gifted-chat">
    <img alt="react-native-gifted-chat" src="https://thumbs.gfycat.com/AbsoluteSadDobermanpinscher-size_restricted.gif" width="260" height="510" />
 </a>

</p>

<h3 align="center">
  💬 Gifted Chat
</h3>
<p align="center">
  The most complete chat UI for React Native <br/>
  <small>formerly known as Gifted Messenger</small>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/react-native-gifted-chat">
  <img alt="npm downloads" src="https://img.shields.io/npm/dm/react-native-gifted-chat.svg"/></a>
  <a href="https://www.npmjs.com/package/react-native-gifted-chat"><img alt="npm version" src="https://badge.fury.io/js/react-native-gifted-chat.svg"/></a>
  <a href="https://greenkeeper.io/"><img src="https://badges.greenkeeper.io/FaridSafi/react-native-gifted-chat.svg" alt="build"></a>
   <a href="https://reactnative.gallery/FaridSafi/gifted-chat"><img src="https://img.shields.io/badge/reactnative.gallery-%F0%9F%8E%AC-green.svg"/></a>

</p>
<p align="center">
  <a href="https://circleci.com/gh/FaridSafi/react-native-gifted-chat"><img src="https://circleci.com/gh/FaridSafi/react-native-gifted-chat.svg?style=shield" alt="build"></a>
  <a href="https://travis-ci.org/FaridSafi/react-native-gifted-chat"><img src="https://api.travis-ci.org/FaridSafi/react-native-gifted-chat.svg" alt="deployed"></a>
  <a title='License' href="https://github.com/FaridSafi/react-native-gifted-chat/blob/master/LICENSE" height="18">
    <img src='https://img.shields.io/badge/license-MIT-blue.svg' />
  </a>
</p>

<p align="center">
  <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=exp://expo.io/@xcarpentier/gifted-chat">
  <br>
  <a href="https://snack.expo.io/@xcarpentier/gifted-chat" target="_blank"><i>demo</i></a>
</p>

## Features

- Fully customizable components
- Composer actions (to attach photos, etc.)
- Load earlier messages
- Copy messages to clipboard
- Touchable links using [react-native-parsed-text](https://github.com/taskrabbit/react-native-parsed-text)
- Avatar as user's initials
- Localized dates
- Multi-line TextInput
- InputToolbar avoiding keyboard
- Redux support
- System message

## Dependency

- Use version `0.2.x` for RN `>= 0.44.0`
- Use version `0.1.x` for RN `>= 0.40.0`
- Use version `0.0.10` for RN `< 0.40.0`

## Installation

- Using [npm](https://www.npmjs.com/#getting-started): `npm install react-native-gifted-chat --save`
- Using [Yarn](https://yarnpkg.com/): `yarn add react-native-gifted-chat`

## You have a question ?

1. Please check this readme and may find a response
1. Please ask on StackOverflow first: https://stackoverflow.com/questions/tagged/react-native-gifted-chat
1. Find response on existing issues
1. Try to keep issues for issues

## Example

```jsx
import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'

class Example extends React.Component {
  state = {
    messages: [],
  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    )
  }
}
```

## Advanced example

See [`example/App.js`](example/App.js) for a working demo!

## "Slack" example

See the files in [`example-slack-message`](example-slack-message) for an example of how to override the default UI to make something that looks more like Slack -- with usernames displayed and all messages on the left.

## Message object

e.g. Chat Message

```js
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
  // You can also add a video prop:
  video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  // Any additional custom parameters are passed through
}
```

e.g. System Message

```js
{
  _id: 1,
  text: 'This is a system message',
  createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
  system: true,
  // Any additional custom parameters are passed through
}
```

## Props

- **`messages`** _(Array)_ - Messages to display
- **`text`** _(String)_ - Input text; default is `undefined`, but if specified, it will override GiftedChat's internal state (e.g. for redux; [see notes below](#notes-for-redux))
- **`placeholder`** _(String)_ - Placeholder when `text` is empty; default is `'Type a message...'`
- **`messageIdGenerator`** _(Function)_ - Generate an id for new messages. Defaults to UUID v4, generated by [uuid](https://github.com/kelektiv/node-uuid)
- **`user`** _(Object)_ - User sending the messages: `{ _id, name, avatar }`
- **`onSend`** _(Function)_ - Callback when sending a message
- **`alwaysShowSend`** _(Bool)_ - Always show send button in input text composer; default `false`, show only when text input is not empty
- **`locale`** _(String)_ - Locale to localize the dates
- **`timeFormat`** _(String)_ - Format to use for rendering times; default is `'LT'`
- **`dateFormat`** _(String)_ - Format to use for rendering dates; default is `'ll'`
- **`isAnimated`** _(Bool)_ - Animates the view when the keyboard appears
- **`loadEarlier`** _(Bool)_ - Enables the "Load earlier messages" button
- **`onLoadEarlier`** _(Function)_ - Callback when loading earlier messages
- **`isLoadingEarlier`** _(Bool)_ - Display an `ActivityIndicator` when loading earlier messages
- **`renderLoading`** _(Function)_ - Render a loading view when initializing
- **`renderLoadEarlier`** _(Function)_ - Custom "Load earlier messages" button
- **`renderAvatar`** _(Function)_ - Custom message avatar; set to `null` to not render any avatar for the message
- **`showUserAvatar`** _(Bool)_ - Whether to render an avatar for the current user; default is `false`, only show avatars for other users
- **`showAvatarForEveryMessage`** _(Bool)_ - When false, avatars will only be displayed when a consecutive message is from the same user on the same day; default is `false`
- **`onPressAvatar`** _(Function(`user`))_ - Callback when a message avatar is tapped
- **`renderAvatarOnTop`** _(Bool)_ - Render the message avatar at the top of consecutive messages, rather than the bottom; default is `false`
- **`renderBubble`** _(Function)_ - Custom message bubble
- **`renderSystemMessage`** _(Function)_ - Custom system message
- **`onLongPress`** _(Function(`context`, `message`))_ - Callback when a message bubble is long-pressed; default is to show an ActionSheet with "Copy Text" (see [example using `showActionSheetWithOptions()`](https://github.com/FaridSafi/react-native-gifted-chat/blob/master@%7B2017-09-25%7D/src/Bubble.js#L96-L119))
- **`inverted`** _(Bool)_ - Reverses display order of `messages`; default is `true`
- **`renderUsernameOnMessage`** _(Bool)_ - Indicate whether to show the user's username inside the message bubble; default is `false`
- **`renderMessage`** _(Function)_ - Custom message container
- **`renderMessageText`** _(Function)_ - Custom message text
- **`renderMessageImage`** _(Function)_ - Custom message image
- **`imageProps`** _(Object)_ - Extra props to be passed to the [`<Image>`](https://facebook.github.io/react-native/docs/image.html) component created by the default `renderMessageImage`
- **`videoProps`** _(Object)_ - Extra props to be passed to the [`<Video>`](https://github.com/react-native-community/react-native-video) component created by the default `renderMessageVideo`
- **`lightboxProps`** _(Object)_ - Extra props to be passed to the `MessageImage`'s [Lightbox](https://github.com/oblador/react-native-lightbox)
- **`renderCustomView`** _(Function)_ - Custom view inside the bubble
- **`renderDay`** _(Function)_ - Custom day above a message
- **`renderTime`** _(Function)_ - Custom time inside a message
- **`renderFooter`** _(Function)_ - Custom footer component on the ListView, e.g. `'User is typing...'`; see [example/App.js](example/App.js) for an example
- **`renderChatFooter`** _(Function)_ - Custom component to render below the MessageContainer (separate from the ListView)
- **`renderInputToolbar`** _(Function)_ - Custom message composer container
- **`renderComposer`** _(Function)_ - Custom text input message composer
- **`renderActions`** _(Function)_ - Custom action button on the left of the message composer
- **`renderSend`** _(Function)_ - Custom send button; you can pass children to the original `Send` component quite easily, for example to use a custom icon ([example](https://github.com/FaridSafi/react-native-gifted-chat/pull/487))
- **`renderAccessory`** _(Function)_ - Custom second line of actions below the message composer
- **`onPressActionButton`** _(Function)_ - Callback when the Action button is pressed (if set, the default `actionSheet` will not be used)
- **`bottomOffset`** _(Integer)_ - Distance of the chat from the bottom of the screen (e.g. useful if you display a tab bar)
- **`minInputToolbarHeight`** _(Integer)_ - Minimum height of the input toolbar; default is `44`
- **`listViewProps`** _(Object)_ - Extra props to be passed to the messages [`<ListView>`](https://facebook.github.io/react-native/docs/listview.html); some props can't be overridden, see the code in `MessageContainer.render()` for details
- **`textInputProps`** _(Object)_ - Extra props to be passed to the [`<TextInput>`](https://facebook.github.io/react-native/docs/textinput.html)
- **`keyboardShouldPersistTaps`** _(Enum)_ - Determines whether the keyboard should stay visible after a tap; see [`<ScrollView>`](https://facebook.github.io/react-native/docs/scrollview.html) docs
- **`onInputTextChanged`** _(Function)_ - Callback when the input text changes
- **`maxInputLength`** _(Integer)_ - Max message composer TextInput length
- **`parsePatterns`** _(Function)_ - Custom parse patterns for [react-native-parsed-text](https://github.com/taskrabbit/react-native-parsed-text) used to linkify message content (like URLs and phone numbers), e.g.:
 ```js
  <GiftedChat
    parsePatterns={(linkStyle) => [
      { type: 'phone', style: linkStyle, onPress: this.onPressPhoneNumber },
      { pattern: /#(\w+)/, style: { ...linkStyle, styles.hashtag }, onPress: this.onPressHashtag },
    ]}
  />
  ```
- **`extraData`** _(Object)_ - Extra props for re-rendering FlatList on demand. This will be useful for rendering footer etc.
- **`minComposerHeight`** _(Object)_ - Custom min height of the composer.
- **`maxComposerHeight`** _(Object)_ - Custom max height of the composer.
* **`scrollToBottom`** _(Bool)_ - Enables the scrollToBottom Component (Default is false)    
* **`scrollToBottomComponent`** _(Function)_ - Custom Scroll To Bottom Component container  
* **`scrollToBottomOffset`** _(Integer)_ - Custom Height Offset upon which to begin showing Scroll To Bottom Component (Default is 200)  
* **`alignTop`** _(Boolean)_ Controls whether or not the message bubbles appear at the top of the chat (Default is false - bubbles align to bottom)

## Imperative methods

- `focusTextInput()` - Open the keyboard and focus the text input box

## Notes for [Redux](https://github.com/reactjs/redux)

The `messages` prop should work out-of-the-box with Redux. In most cases this is all you need.

If you decide to specify a `text` prop, GiftedChat will no longer manage its own internal `text` state and will defer entirely to your prop.
This is great for using a tool like Redux, but there's one extra step you'll need to take:
simply implement `onInputTextChanged` to receive typing events and reset events (e.g. to clear the text `onSend`):

```js
<GiftedChat
  text={customText}
  onInputTextChanged={text => this.setCustomText(text)}
  /* ... */
/>
```

## Notes for Android

If you are using Create React Native App / Expo, no Android specific installation steps are required -- you can skip this section. Otherwise we recommend modifying your project configuration as follows.

- Make sure you have `android:windowSoftInputMode="adjustResize"` in your `AndroidManifest.xml`:

  ```xml
  <activity
    android:name=".MainActivity"
    android:label="@string/app_name"
    android:windowSoftInputMode="adjustResize"
    android:configChanges="keyboard|keyboardHidden|orientation|screenSize">
  ```

- For **Expo**, there are almost 2 solutions to fix it:

  - adding KeyboardAvoidingView after GiftedChat [see this comment](https://github.com/FaridSafi/react-native-gifted-chat/issues/461#issuecomment-314858092)
  - adding an opaque background status bar on app.json https://docs.expo.io/versions/latest/guides/configuration.html#androidstatusbar

- If you plan to use `GiftedChat` inside a `Modal`, see [#200](https://github.com/FaridSafi/react-native-gifted-chat/issues/200).

## Notes for local development

You can use [`wml`](https://github.com/wix/wml) to keep the example app in sync
with any changes you make to the library during development. Steps:

1. Install it: `npm install -g wml`
2. Configure it: `wml add . example/node_modules/react-native-gifted-chat` from the root directory
3. `cd example`
4. `npm start`
5. `wml start` in another terminal window (doesn't matter where)

Note that it's important for `wml start` to come **after** `npm start`, or you'll get `Can't find entry file index.js` errors.
If you have any issues, you can clear your watches using `watchman watch-del-all` and try again.

## Questions

- [How can I set Bubble color for each user?](https://github.com/FaridSafi/react-native-gifted-chat/issues/672)
- [How can I pass style props to InputToolbar design and customize it's color and other styles properties?](https://github.com/FaridSafi/react-native-gifted-chat/issues/662)
- [How can I change the color of the message box?](https://github.com/FaridSafi/react-native-gifted-chat/issues/640)
- [Is there a way to manually dismiss the keyboard?](https://github.com/FaridSafi/react-native-gifted-chat/issues/647)
- [I want to implement a popover that pops right after clicking on a specific avatar,
  what is the best implementation in this case and how?](https://github.com/FaridSafi/react-native-gifted-chat/issues/660)
- [Why TextInput is hidden on Android?](https://github.com/FaridSafi/react-native-gifted-chat/issues/680#issuecomment-359699364)
- [How to use renderLoading?](https://github.com/FaridSafi/react-native-gifted-chat/issues/298)
- [Can I use MySql to save the message?](https://github.com/FaridSafi/react-native-gifted-chat/issues/738)

## License

- [MIT](LICENSE)

## Author

Feel free to ask me questions on Twitter [@FaridSafi](https://www.twitter.com/FaridSafi)!

## Contributors

- Kevin Cooper [cooperka](https://github.com/cooperka)
- Kfir Golan [kfiroo](https://github.com/kfiroo)
- Bruno Cascio [brunocascio](https://github.com/brunocascio)
- Xavier Carpentier [xcarpentier](https://github.com/xcarpentier)
- [more](https://github.com/FaridSafi/react-native-gifted-chat/graphs/contributors)

<img src="https://api.keen.io/3.0/projects/5ae31b61c9e77c0001cc2093/events/pageviews?api_key=55301C3E5BAB217E90A5867113C02506CE20385CD6F4C9C1CCDD4671B1A9DE374C3DF9DEF70C0BB3F5A9C5CA4CB1CCCFAF25FC3ED9CF63FB83102456A6881EFBAECD1C7D9718EE5402752DD8F6FA2DEC4D844BCB17FE6262570DB447D9A8CED2&data=eyJ0aXRsZSI6ICJnYyJ9" />
