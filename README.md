<p align="center" >
<p align="center" >
   <a href="https://reactnative.gallery/FaridSafi/gifted-chat">
    <img alt="react-native-gifted-chat" src="https://thumbs.gfycat.com/AbsoluteSadDobermanpinscher-size_restricted.gif" width="260" height="510" />
 </a>

</p>

<h3 align="center">
  💬 Gifted Chat
</h3>
<p align="center">
  The most complete chat UI for React Native & Web
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
  <a href="#hire-an-expert"><img src="https://img.shields.io/badge/%F0%9F%92%AA-hire%20an%20expert-brightgreen"/></a>
</p>

<p align="center">
  <a href="https://reverent-bardeen-47c862.netlify.com/" target="_blank">Demo Web 🖥</a>
</p>
<p align="center">
  <a href="https://snack.expo.io/@xcarpentier/giftedchat-playground" target="_blank">Snack GiftedChat playground</a>
  <img height="18" src="https://snack.expo.io/favicon.ico" />
</p>

## Sponsor

<p align="center">
  <br/>
  <a href="https://www.lereacteur.io" target="_blank">
    <img src="https://raw.githubusercontent.com/FaridSafi/react-native-gifted-chat/master/media/logo_sponsor.png">
  </a>
  <br>
  <p align="center">
    Coding Bootcamp in Paris co-founded by Farid Safi
  </p>
  <a href="https://www.lereacteur.io" target="_blank">
    <p align="center">
      Click to learn more
    </p>
  </a>
</p>

<p align="center">
  <br/>
  <a href="https://getstream.io/chat/?utm_source=github&utm_medium=react-native-gifted-chat&utm_campaign=sponsorship" target="_blank">
    <img src="https://i.imgur.com/oU7XYkk.png">
  </a>
  <br>
  <p align="center">
    Scalable <a href="https://getstream.io/chat/?utm_source=github&utm_medium=react-native-gifted-chat&utm_campaign=sponsorship" target="_blank">chat API/Server</a> written in Go
  </p>
  <p align="center">
    <a href="https://getstream.io/chat/get_started/?utm_source=github&utm_medium=react-native-gifted-chat&utm_campaign=sponsorship" target="_blank">API Tour</a> | <a href="https://dev.to/nickparsons/react-native-chat-with-chuck-norris-3h7m?utm_source=github&utm_medium=react-native-gifted-chat&utm_campaign=sponsorship" target="_blank">React Native Gifted tutorial</a>
  </p>
</p>

<p align="center">
  <br/>
  <a href="https://www.docdok.health/?utm_source=github&utm_medium=react-native-gifted-chat&utm_campaign=sponsorship" target="_blank">
    <img src="https://www.dropbox.com/s/g4dcq267aqbykpz/logo.png?dl=0&raw=1">
  </a>
  <br>
  <p align="center">Delivering Personalized Healthcare</p>
  <p align="center">
    <a href="https://www.docdok.health/?utm_source=github&utm_medium=react-native-gifted-chat&utm_campaign=sponsorship" target="_blank">      Find out more</a>
  </p>
</p>

## Please vote

**GiftedChat** depends on other packages and some needs a boost, please vote for PRs will improve it, thanks:

- https://github.com/taskrabbit/react-native-parsed-text/pull/58
- https://github.com/watadarkstar/react-native-typing-animation/issues/18

## Features

- 🎉 **_`react-native-web`able_ (since 0.10.0)** [web configuration](#react-native-web)
- Write with **TypeScript** (since 0.8.0)
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
- Quick Reply messages (bot)
- Typying indicatior [react-native-typing-animation](https://github.com/watadarkstar/react-native-typing-animation)

## Dependency

- Use version `0.2.x` for RN `>= 0.44.0`
- Use version `0.1.x` for RN `>= 0.40.0`
- Use version `0.0.10` for RN `< 0.40.0`

## Installation

- Using [npm](https://www.npmjs.com/#getting-started): `npm install react-native-gifted-chat --save`
- Using [Yarn](https://yarnpkg.com/): `yarn add react-native-gifted-chat`

### react-native-video and expo-av

- Both dependencies are removed since `0.11.0`.
- You still be able to provide a `video` but you need to provide `renderMessageVideo` prop.

## You have a question?

1. Please check this readme and may find a response
1. Please ask on StackOverflow first: https://stackoverflow.com/questions/tagged/react-native-gifted-chat
1. Find response on existing issues
1. Try to keep issues for issues

## Example

```jsx
import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'

export function Example() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
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
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  )
}
```

## Advanced example

See [`App.tsx`](https://github.com/FaridSafi/react-native-gifted-chat/blob/master/App.tsx) for a working demo!

## "Slack" example

See the files in [`example-slack-message`](example-slack-message) for an example of how to override the default UI to make something that looks more like Slack -- with usernames displayed and all messages on the left.

## Message object

> e.g. Chat Message

```ts
export interface IMessage {
  _id: string | number
  text: string
  createdAt: Date | number
  user: User
  image?: string
  video?: string
  audio?: string
  system?: boolean
  sent?: boolean
  received?: boolean
  pending?: boolean
  quickReplies?: QuickReplies
}
```

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
  // Mark the message as sent, using one tick
  sent: true,
  // Mark the message as received, using two tick
  received: true,
  // Mark the message as pending with a clock loader
  pending: true,
  // Any additional custom parameters are passed through
}
```

> e.g. System Message

```js
{
  _id: 1,
  text: 'This is a system message',
  createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
  system: true,
  // Any additional custom parameters are passed through
}
```

> e.g. Chat Message with Quick Reply options

See PR [#1211](https://github.com/FaridSafi/react-native-gifted-chat/pull/1211)

```ts
interface Reply {
  title: string
  value: string
  messageId?: any
}

interface QuickReplies {
  type: 'radio' | 'checkbox'
  values: Reply[]
  keepIt?: boolean
}
```

```js
  {
    _id: 1,
    text: 'This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT',
    createdAt: new Date(),
    quickReplies: {
      type: 'radio', // or 'checkbox',
      keepIt: true,
      values: [
        {
          title: '😋 Yes',
          value: 'yes',
        },
        {
          title: '📷 Yes, let me show you with a picture!',
          value: 'yes_picture',
        },
        {
          title: '😞 Nope. What?',
          value: 'no',
        },
      ],
    },
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 2,
    text: 'This is a quick reply. Do you love Gifted Chat? (checkbox)',
    createdAt: new Date(),
    quickReplies: {
      type: 'checkbox', // or 'radio',
      values: [
        {
          title: 'Yes',
          value: 'yes',
        },
        {
          title: 'Yes, let me show you with a picture!',
          value: 'yes_picture',
        },
        {
          title: 'Nope. What?',
          value: 'no',
        },
      ],
    },
    user: {
      _id: 2,
      name: 'React Native',
    },
  }
```

## Props

- **`messages`** _(Array)_ - Messages to display
- **`isTyping`** _(Bool)_ - Typing Indicator state; default `false`. If you use`renderFooter` it will override this.
- **`text`** _(String)_ - Input text; default is `undefined`, but if specified, it will override GiftedChat's internal state (e.g. for redux; [see notes below](#notes-for-redux))
- **`placeholder`** _(String)_ - Placeholder when `text` is empty; default is `'Type a message...'`
- **`messageIdGenerator`** _(Function)_ - Generate an id for new messages. Defaults to UUID v4, generated by [uuid](https://github.com/kelektiv/node-uuid)
- **`user`** _(Object)_ - User sending the messages: `{ _id, name, avatar }`
- **`onSend`** _(Function)_ - Callback when sending a message
- **`alwaysShowSend`** _(Bool)_ - Always show send button in input text composer; default `false`, show only when text input is not empty
- **`locale`** _(String)_ - Locale to localize the dates. You need first to import the locale you need (ie. `require('dayjs/locale/de')` or `import 'dayjs/locale/fr'`)
- **`timeFormat`** _(String)_ - Format to use for rendering times; default is `'LT'`
- **`dateFormat`** _(String)_ - Format to use for rendering dates; default is `'ll'`
- **`loadEarlier`** _(Bool)_ - Enables the "load earlier messages" button, required for `infiniteScroll`
- **`isKeyboardInternallyHandled`** _(Bool)_ - Determine whether to handle keyboard awareness inside the plugin. If you have your own keyboard handling outside the plugin set this to false; default is `true`
- **`onLoadEarlier`** _(Function)_ - Callback when loading earlier messages
- **`isLoadingEarlier`** _(Bool)_ - Display an `ActivityIndicator` when loading earlier messages
- **`renderLoading`** _(Function)_ - Render a loading view when initializing
- **`renderLoadEarlier`** _(Function)_ - Custom "Load earlier messages" button
- **`renderAvatar`** _(Function)_ - Custom message avatar; set to `null` to not render any avatar for the message
- **`showUserAvatar`** _(Bool)_ - Whether to render an avatar for the current user; default is `false`, only show avatars for other users
- **`showAvatarForEveryMessage`** _(Bool)_ - When false, avatars will only be displayed when a consecutive message is from the same user on the same day; default is `false`
- **`onPressAvatar`** _(Function(`user`))_ - Callback when a message avatar is tapped
- **`onLongPressAvatar`** _(Function(`user`))_ - Callback when a message avatar is long-pressed
- **`renderAvatarOnTop`** _(Bool)_ - Render the message avatar at the top of consecutive messages, rather than the bottom; default is `false`
- **`renderBubble`** _(Function)_ - Custom message bubble
- **`renderTicks`** _(Function(`message`))_ - Custom ticks indicator to display message status
- **`renderSystemMessage`** _(Function)_ - Custom system message
- **`onLongPress`** _(Function(`context`, `message`))_ - Callback when a message bubble is long-pressed; default is to show an ActionSheet with "Copy Text" (see [example using `showActionSheetWithOptions()`](https://github.com/FaridSafi/react-native-gifted-chat/blob/master@%7B2017-09-25%7D/src/Bubble.js#L96-L119))
- **`inverted`** _(Bool)_ - Reverses display order of `messages`; default is `true`
- **`renderUsernameOnMessage`** _(Bool)_ - Indicate whether to show the user's username inside the message bubble; default is `false`
- **`renderMessage`** _(Function)_ - Custom message container
- **`renderMessageText`** _(Function)_ - Custom message text
- **`renderMessageImage`** _(Function)_ - Custom message image
- **`renderMessageVideo`** _(Function)_ - Custom message video
- **`imageProps`** _(Object)_ - Extra props to be passed to the [`<Image>`](https://facebook.github.io/react-native/docs/image.html) component created by the default `renderMessageImage`
- **`videoProps`** _(Object)_ - Extra props to be passed to the video component created by the required `renderMessageVideo`
- **`lightboxProps`** _(Object)_ - Extra props to be passed to the `MessageImage`'s [Lightbox](https://github.com/oblador/react-native-lightbox)
- **`isCustomViewBottom`** _(Bool)_ - Determine whether renderCustomView is displayed before or after the text, image and video views; default is `false`
- **`renderCustomView`** _(Function)_ - Custom view inside the bubble
- **`renderDay`** _(Function)_ - Custom day above a message
- **`renderTime`** _(Function)_ - Custom time inside a message
- **`renderFooter`** _(Function)_ - Custom footer component on the ListView, e.g. `'User is typing...'`; see [example/App.js](example/App.js) for an example. Overrides default typing indicator that triggers when `isTyping` is true.
- **`renderChatEmpty`** _(Function)_ - Custom component to render in the ListView when messages are empty
- **`renderChatFooter`** _(Function)_ - Custom component to render below the MessageContainer (separate from the ListView)
- **`renderInputToolbar`** _(Function)_ - Custom message composer container
- **`renderComposer`** _(Function)_ - Custom text input message composer
- **`renderActions`** _(Function)_ - Custom action button on the left of the message composer
- **`renderSend`** _(Function)_ - Custom send button; you can pass children to the original `Send` component quite easily, for example, to use a custom icon ([example](https://github.com/FaridSafi/react-native-gifted-chat/pull/487))
- **`renderAccessory`** _(Function)_ - Custom second line of actions below the message composer
- **`onPressActionButton`** _(Function)_ - Callback when the Action button is pressed (if set, the default `actionSheet` will not be used)
- **`bottomOffset`** _(Integer)_ - Distance of the chat from the bottom of the screen (e.g. useful if you display a tab bar)
- **`minInputToolbarHeight`** _(Integer)_ - Minimum height of the input toolbar; default is `44`
- **`listViewProps`** _(Object)_ - Extra props to be passed to the messages [`<ListView>`](https://facebook.github.io/react-native/docs/listview.html); some props can't be overridden, see the code in `MessageContainer.render()` for details
- **`textInputProps`** _(Object)_ - Extra props to be passed to the [`<TextInput>`](https://facebook.github.io/react-native/docs/textinput.html)
- **`textInputStyle`** _(Object)_ - Custom style to be passed to the [`<TextInput>`](https://facebook.github.io/react-native/docs/textinput.html)
- **`multiline`** _(Bool)_ - Indicates whether to allow the [`<TextInput>`](https://facebook.github.io/react-native/docs/textinput.html) to be multiple lines or not; default `true`.
- **`keyboardShouldPersistTaps`** _(Enum)_ - Determines whether the keyboard should stay visible after a tap; see [`<ScrollView>`](https://facebook.github.io/react-native/docs/scrollview.html) docs
- **`onInputTextChanged`** _(Function)_ - Callback when the input text changes
- **`maxInputLength`** _(Integer)_ - Max message composer TextInput length
- **`parsePatterns`** _(Function)_ - Custom parse patterns for [react-native-parsed-text](https://github.com/taskrabbit/react-native-parsed-text) used to linking message content (like URLs and phone numbers), e.g.:

```js
 <GiftedChat
   parsePatterns={(linkStyle) => [
     { type: 'phone', style: linkStyle, onPress: this.onPressPhoneNumber },
     { pattern: /#(\w+)/, style: { ...linkStyle, styles.hashtag }, onPress: this.onPressHashtag },
   ]}
 />
```

- **`extraData`** _(Object)_ - Extra props for re-rendering FlatList on demand. This will be useful for rendering footer etc.
- **`minComposerHeight`** _(Object)_ - Custom min-height of the composer.
- **`maxComposerHeight`** _(Object)_ - Custom max height of the composer.

* **`scrollToBottom`** _(Bool)_ - Enables the scroll to bottom Component (Default is false)
* **`scrollToBottomComponent`** _(Function)_ - Custom Scroll To Bottom Component container
* **`scrollToBottomOffset`** _(Integer)_ - Custom Height Offset upon which to begin showing Scroll To Bottom Component (Default is 200)
* **`scrollToBottomStyle`** _(Object)_ - Custom style for Bottom Component container
* **`alignTop`** _(Boolean)_ Controls whether or not the message bubbles appear at the top of the chat (Default is false - bubbles align to bottom)
* **`onQuickReply`** _(Function)_ - Callback when sending a quick reply (to backend server)
* **`renderQuickReplies`** _(Function)_ - Custom all quick reply view
* **`quickReplyStyle`** _(StyleProp<ViewStyle>)_ - Custom quick reply view style
* **`renderQuickReplySend`** _(Function)_ - Custom quick reply **send** view
* **`shouldUpdateMessage`** _(Function)_ - Lets the message component know when to update outside of normal cases.
* **`infiniteScroll`** _(Bool)_ - infinite scroll up when reach the top of messages container, automatically call onLoadEarlier function if exist (not yet supported for the web). You need to add `loadEarlier` prop too.

## Imperative methods

- `focusTextInput()` - Open the keyboard and focus the text input box

## Notes for [Redux](https://github.com/reactjs/redux)

The `messages` prop should work out-of-the-box with Redux. In most cases, this is all you need.

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

If you are using Create React Native App / Expo, no Android specific installation steps are required -- you can skip this section. Otherwise, we recommend modifying your project configuration as follows.

- Make sure you have `android:windowSoftInputMode="adjustResize"` in your `AndroidManifest.xml`:

  ```xml
  <activity
    android:name=".MainActivity"
    android:label="@string/app_name"
    android:windowSoftInputMode="adjustResize"
    android:configChanges="keyboard|keyboardHidden|orientation|screenSize">
  ```

- For **Expo**, there are at least 2 solutions to fix it:

  - Append [`KeyboardAvoidingView`](https://facebook.github.io/react-native/docs/keyboardavoidingview) after GiftedChat. This should only be done for Android, as `KeyboardAvoidingView` may conflict with the iOS keyboard avoidance already built into GiftedChat, e.g.:

```
<View style={{ flex: 1 }}>
   <GiftedChat />
   {
      Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />
   }
</View>
```

If you use React Navigation, additional handling may be required to account for navigation headers and tabs. `KeyboardAvoidingView`'s `keyboardVerticalOffset` property can be set to the height of the navigation header and [`tabBarOptions.keyboardHidesTabBar`](https://reactnavigation.org/docs/en/bottom-tab-navigator.html#bottomtabnavigatorconfig) can be set to keep the tab bar from being shown when the keyboard is up. Due to a [bug with calculating height on Android phones with notches](facebook/react-native#23693), `KeyboardAvoidingView` is recommended over other solutions that involve calculating the height of the window.

- adding an opaque background status bar on app.json (even though `android:windowSoftInputMode="adjustResize"` is set internally on Expo's Android apps, the translucent status bar causes it not to work): https://docs.expo.io/versions/latest/guides/configuration.html#androidstatusbar

- If you plan to use `GiftedChat` inside a `Modal`, see [#200](https://github.com/FaridSafi/react-native-gifted-chat/issues/200).

## Notes for local development

### Native

1. Install `yarn add -g expo-cli`
2. `expo start`

### react-native-web

#### With expo

1. Install `yarn add -g expo-cli`
2. `expo start -w`

[Upgrade snack version](https://snackager.expo.io/bundle/react-native-gifted-chat@0.15.0?bypassCache=true)

#### With create-react-app

1. `yarn add -D react-app-rewired`
2. `touch config-overrides.js`

```js
module.exports = function override(config, env) {
  config.module.rules.push({
    test: /\.js$/,
    exclude: /node_modules[/\\](?!react-native-gifted-chat|react-native-lightbox|react-native-parsed-text)/,
    use: {
      loader: 'babel-loader',
      options: {
        babelrc: false,
        configFile: false,
        presets: [
          ['@babel/preset-env', { useBuiltIns: 'usage' }],
          '@babel/preset-react',
        ],
        plugins: ['@babel/plugin-proposal-class-properties'],
      },
    },
  })

  return config
}
```

> You will find an example and a **web demo** here: [xcarpentier/gifted-chat-web-demo](https://github.com/xcarpentier/gifted-chat-web-demo)

> Another example with **Gatsby** : [xcarpentier/clean-archi-boilerplate](https://github.com/xcarpentier/clean-archi-boilerplate/tree/develop/apps/web)

## Questions

- [How can I set Bubble color for each user?](https://github.com/FaridSafi/react-native-gifted-chat/issues/672)
- [How can I pass style props to InputToolbar design and customize its color and other styles properties?](https://github.com/FaridSafi/react-native-gifted-chat/issues/662)
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

Feel free to ask me questions on Twitter [@FaridSafi](https://www.twitter.com/FaridSafi)! or [@xcapetir](https://www.twitter.com/xcapetir)!

## Contributors

- Kevin Cooper [cooperka](https://github.com/cooperka)
- Kfir Golan [kfiroo](https://github.com/kfiroo)
- Bruno Cascio [brunocascio](https://github.com/brunocascio)
- Xavier Carpentier [xcarpentier](https://github.com/xcarpentier)
- [more](https://github.com/FaridSafi/react-native-gifted-chat/graphs/contributors)

## Hire an expert!

Looking for a ReactNative freelance expert with more than 12 years of experience? Contact Xavier from his [website](https://xaviercarpentier.com)!
