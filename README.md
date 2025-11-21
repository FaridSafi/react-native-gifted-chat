<p align="center">
<p align="center">
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
</p>
<p align="center">
  <a href="https://circleci.com/gh/FaridSafi/react-native-gifted-chat"><img src="https://circleci.com/gh/FaridSafi/react-native-gifted-chat.svg?style=shield" alt="build"></a>
  <a title='License' href="https://github.com/FaridSafi/react-native-gifted-chat/blob/master/LICENSE" height="18">
    <img src='https://img.shields.io/badge/license-MIT-blue.svg' />
  </a>
  <a href="#hire-an-expert"><img src="https://img.shields.io/badge/%F0%9F%92%AA-hire%20an%20expert-brightgreen"/></a>
</p>

<p align="center">
  <a href="https://snack.expo.dev/@kesha-antonov/gifted-chat-playground" target="_blank">Snack GiftedChat playground</a>
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
  <a href="https://getstream.io/chat/?utm_source=Github&utm_medium=Github_Repo_Content_Ad&utm_content=Developer&utm_campaign=Github_Jan2022_Chat&utm_term=react-native-gifted-chat" target="_blank">
    <img src="https://raw.githubusercontent.com/FaridSafi/react-native-gifted-chat/master/media/stream-logo.png" height="50">
  </a>
  <br>
  <p align="center">
    Scalable <a href="https://getstream.io/chat/?utm_source=Github&utm_medium=Github_Repo_Content_Ad&utm_content=Developer&utm_campaign=Github_Jan2022_Chat&utm_term=react-native-gifted-chat" target="_blank">chat API/Server</a> written in Go
  </p>
  <p align="center">
    <a href="https://getstream.io/chat/get_started/?utm_source=Github&utm_medium=Github_Repo_Content_Ad&utm_content=Developer&utm_campaign=Github_Jan2022_Chat&utm_term=react-native-gifted-chat" target="_blank">API Tour</a> | <a href="https://dev.to/nickparsons/react-native-chat-with-chuck-norris-3h7m?utm_source=Github&utm_medium=Github_Repo_Content_Ad&utm_content=Developer&utm_campaign=Github_Jan2022_Chat&utm_term=react-native-gifted-chat" target="_blank">React Native Gifted tutorial</a>
  </p>
</p>

<p align="center">
  <br/>
  <a href="https://www.ethora.com" target="_blank">
    <img src="https://www.dappros.com/wp-content/uploads/2023/12/Ethora-Logo.png" width="300px">
  </a>
  <br>
  <p align="center">
    A complete app engine featuring GiftedChat
  </p>
  <p align="center">
    <a href="https://bit.ly/ethorachat" target="_blank">Check out our GitHub</a>
  </p>
</p>
<br>
<p align="center">
 <a href="https://amzn.to/3ZmTyb2" target="_blank">React Key Concepts: Consolidate your knowledge of React’s core features (2nd ed. Edition)</a>
</p>

## Features

- Fully customizable components
- Composer actions (to attach photos, etc.)
- Load earlier messages
- Copy messages to clipboard
- Touchable links using [react-native-autolink](https://github.com/joshswan/react-native-autolink)
- Avatar as user's initials
- Localized dates
- Multi-line TextInput
- InputToolbar avoiding keyboard
- System message
- Quick Reply messages (bot)
- Typing indicator
- react-native-web [web configuration](#react-native-web)

# Getting started

## 🚧👷 Important notice

There's currently WIP going on to make the library more performant, modern in terms of chat UI and easier to maintain. If you have any issues, please report them. If you want to contribute, please do so.

The most stable version is `2.6.5`. If you want to use the latest version, please be aware that it's a work in progress.

Readme for this version: [2.6.5 readme](https://github.com/FaridSafi/react-native-gifted-chat/blob/eebab3751fcbe07715135e6e7b2aa3f76a10d8ac/README.md)

## Installation

### Install dependencies

Yarn:
```bash
yarn add react-native-gifted-chat react-native-reanimated react-native-keyboard-controller react-native-gesture-handler react-native-safe-area-context
```

Npm:

```bash
npm install --save react-native-gifted-chat react-native-reanimated react-native-keyboard-controller react-native-gesture-handler react-native-safe-area-context
```

Expo
```bash
npx expo install react-native-gifted-chat react-native-reanimated react-native-keyboard-controller react-native-gesture-handler react-native-safe-area-context
```

### Non-expo users

```bash
npx pod-install
```

### Setup react-native-reanimated

Follow guide: [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/#step-2-add-reanimateds-babel-plugin)

## Simple example

```jsx
import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function Example() {
  const [messages, setMessages] = useState([])
  const insets = useSafeAreaInsets()

  // If you have a tab bar, include its height
  const tabbarHeight = 50
  const keyboardBottomOffset = insets.bottom + tabbarHeight

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
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
      keyboardBottomOffset={keyboardBottomOffset}
    />
  )
}
```

## Different examples

Check out code of [`examples`](example)

## Data structure

Messages, system messages, quick replies etc.: [data structure](src/Models.ts)

## Props

### Core Configuration

- **`messages`** _(Array)_ - Messages to display
- **`user`** _(Object)_ - User sending the messages: `{ _id, name, avatar }`
- **`onSend`** _(Function)_ - Callback when sending a message
- **`messageIdGenerator`** _(Function)_ - Generate an id for new messages. Defaults to UUID v4, generated by [uuid](https://github.com/kelektiv/node-uuid)
- **`locale`** _(String)_ - Locale to localize the dates. You need first to import the locale you need (ie. `require('dayjs/locale/de')` or `import 'dayjs/locale/fr'`)

### Refs

- **`messageContainerRef`** _(FlatList ref)_ - Ref to the flatlist
- **`textInputRef`** _(TextInput ref)_ - Ref to the text input

### Keyboard & Layout

- **`keyboardBottomOffset`** _(Integer)_ - Distance between the bottom of the screen and bottom of the `GiftedChat` component. Useful when you have a tab bar or navigation bar; default is `0`. Needed for correct keyboard avoiding behavior. Without it you might see gap between the keyboard and the input toolbar if you have a tab bar, navigation bar, or safe area.
- **`isKeyboardInternallyHandled`** _(Bool)_ - Determine whether to handle keyboard awareness inside the plugin. If you have your own keyboard handling outside the plugin set this to false; default is `true`
- **`focusOnInputWhenOpeningKeyboard`** _(Bool)_ - Focus on <TextInput> automatically when opening the keyboard; default `true`
- **`alignTop`** _(Boolean)_ Controls whether or not the message bubbles appear at the top of the chat (Default is false - bubbles align to bottom)
- **`inverted`** _(Bool)_ - Reverses display order of `messages`; default is `true`

### Text Input & Composer

- **`text`** _(String)_ - Input text; default is `undefined`, but if specified, it will override GiftedChat's internal state. Useful for managing text state outside of GiftedChat (e.g. with Redux). Don't forget to implement `textInputProps.onChangeText` to update the text state.
- **`initialText`** _(String)_ - Initial text to display in the input field
- **`alwaysShowSend`** _(Bool)_ - Always show send button in input text composer; default `false`, show only when text input is not empty
- **`minComposerHeight`** _(Object)_ - Custom min-height of the composer.
- **`maxComposerHeight`** _(Object)_ - Custom max height of the composer.
- **`minInputToolbarHeight`** _(Integer)_ - Minimum height of the input toolbar; default is `44`
- **`renderInputToolbar`** _(Component | Function)_ - Custom message composer container
- **`renderComposer`** _(Component | Function)_ - Custom text input message composer
- **`renderSend`** _(Component | Function)_ - Custom send button; you can pass children to the original `Send` component quite easily, for example, to use a custom icon ([example](https://github.com/FaridSafi/react-native-gifted-chat/pull/487))
- **`renderActions`** _(Component | Function)_ - Custom action button on the left of the message composer
- **`renderAccessory`** _(Component | Function)_ - Custom second line of actions below the message composer
- **`textInputProps`** _(Object)_ - props to be passed to the [`<TextInput>`](https://reactnative.dev/docs/textinput.html).

### Actions & Action Sheet

- **`onPressActionButton`** _(Function)_ - Callback when the Action button is pressed (if set, the default `actionSheet` will not be used)
- **`actionSheet`** _(Function)_ - Custom action sheet interface for showing action options
- **`actions`** _(Array)_ - Custom action options for the input toolbar action button; array of objects with `title` (string) and `action` (function) properties
- **`actionSheetOptionTintColor`** _(String)_ - Tint color for action sheet options

### Messages & Message Container

- **`messagesContainerStyle`** _(Object)_ - Custom style for the messages container
- **`renderMessage`** _(Component | Function)_ - Custom message container
- **`renderLoading`** _(Component | Function)_ - Render a loading view when initializing
- **`renderChatEmpty`** _(Component | Function)_ - Custom component to render in the ListView when messages are empty
- **`renderChatFooter`** _(Component | Function)_ - Custom component to render below the MessageContainer (separate from the ListView)
- **`listProps`** _(Object)_ - Extra props to be passed to the messages [`<FlatList>`](https://reactnative.dev/docs/flatlist.html); some props can't be overridden, see the code in `MessageContainer.render()` for details

### Message Bubbles & Content

- **`renderBubble`** _(Component | Function)_ - Custom message bubble
- **`renderMessageText`** _(Component | Function)_ - Custom message text
- **`renderMessageImage`** _(Component | Function)_ - Custom message image
- **`renderMessageVideo`** _(Component | Function)_ - Custom message video
- **`renderMessageAudio`** _(Component | Function)_ - Custom message audio
- **`renderCustomView`** _(Component | Function)_ - Custom view inside the bubble
- **`isCustomViewBottom`** _(Bool)_ - Determine whether renderCustomView is displayed before or after the text, image and video views; default is `false`
- **`renderTicks`** _(Component | Function(`message`))_ - Custom ticks indicator to display message status
- **`onPressMessage`** _(Function(`context`, `message`))_ - Callback when a message bubble is pressed
- **`onLongPressMessage`** _(Function(`context`, `message`))_ - Callback when a message bubble is long-pressed; you can use this to show action sheets (e.g., copy, delete, reply)
- **`imageProps`** _(Object)_ - Extra props to be passed to the [`<Image>`](https://reactnative.dev/docs/image.html) component created by the default `renderMessageImage`
- **`imageStyle`** _(Object)_ - Custom style for message images
- **`videoProps`** _(Object)_ - Extra props to be passed to the video component created by the required `renderMessageVideo`
- **`messageTextProps`** _(Object)_ - Extra props to be passed to the MessageText component. Useful for customizing link parsing behavior, text styles, and matchers. Supports all [react-native-autolink](https://github.com/joshswan/react-native-autolink) props including:
  - `matchers` - Custom matchers for linking message content (like URLs, phone numbers, hashtags, mentions)
  - `linkStyle` - Custom style for links
  - `email` - Enable/disable email parsing (default: true)
  - `phone` - Enable/disable phone number parsing (default: true)
  - `url` - Enable/disable URL parsing (default: true)

Example:

```tsx
<GiftedChat
  messageTextProps={{
    phone: false, // Disable default phone number linking
    matchers: [
      {
        type: 'phone',
        pattern: /\+?[1-9][0-9\-\(\) ]{7,}[0-9]/g,
        getLinkUrl: (replacerArgs: ReplacerArgs): string => {
          return replacerArgs[0].replace(/[\-\(\) ]/g, '')
        },
        getLinkText: (replacerArgs: ReplacerArgs): string => {
          return replacerArgs[0]
        },
        style: styles.linkStyle,
        onPress: (match: CustomMatch) => {
          const url = match.getAnchorHref()

          const options: {
            title: string
            action?: () => void
          }[] = [
            { title: 'Copy', action: () => setStringAsync(url) },
            { title: 'Call', action: () => Linking.openURL(`tel:${url}`) },
            { title: 'Send SMS', action: () => Linking.openURL(`sms:${url}`) },
            { title: 'Cancel' },
          ]

          showActionSheetWithOptions({
            options: options.map(o => o.title),
            cancelButtonIndex: options.length - 1,
          }, (buttonIndex?: number) => {
            if (buttonIndex === undefined)
              return

            const option = options[buttonIndex]
            option.action?.()
          })
        },
      },
    ],
    linkStyle: { left: { color: 'blue' }, right: { color: 'lightblue' } },
  }}
/>
```

See full example in [LinksExample](example/components/chat-examples/LinksExample.tsx)

### Avatars

- **`renderAvatar`** _(Component | Function)_ - Custom message avatar; set to `null` to not render any avatar for the message
- **`showUserAvatar`** _(Bool)_ - Whether to render an avatar for the current user; default is `false`, only show avatars for other users
- **`showAvatarForEveryMessage`** _(Bool)_ - When false, avatars will only be displayed when a consecutive message is from the same user on the same day; default is `false`
- **`onPressAvatar`** _(Function(`user`))_ - Callback when a message avatar is tapped
- **`onLongPressAvatar`** _(Function(`user`))_ - Callback when a message avatar is long-pressed
- **`renderAvatarOnTop`** _(Bool)_ - Render the message avatar at the top of consecutive messages, rather than the bottom; default is `false`

### Username

- **`renderUsernameOnMessage`** _(Bool)_ - Indicate whether to show the user's username inside the message bubble; default is `false`
- **`renderUsername`** _(Component | Function)_ - Custom Username container

### Date & Time

- **`timeFormat`** _(String)_ - Format to use for rendering times; default is `'LT'` (see [Day.js Format](https://day.js.org/docs/en/display/format))
- **`dateFormat`** _(String)_ - Format to use for rendering dates; default is `'D MMMM'` (see [Day.js Format](https://day.js.org/docs/en/display/format))
- **`dateFormatCalendar`** _(Object)_ - Format to use for rendering relative times; default is `{ sameDay: '[Today]' }` (see [Day.js Calendar](https://day.js.org/docs/en/plugin/calendar))
- **`renderDay`** _(Component | Function)_ - Custom day above a message
- **`renderTime`** _(Component | Function)_ - Custom time inside a message
- **`timeTextStyle`** _(Object)_ - Custom text style for time inside messages (supports left/right styles)

### System Messages

- **`renderSystemMessage`** _(Component | Function)_ - Custom system message

### Load Earlier Messages

- **`loadEarlierMessagesProps`** _(Object)_ - Props to pass to the LoadEarlierMessages component. The button is only visible when `isAvailable` is `true`. Supports the following props:
  - `isAvailable` - Controls button visibility (default: false)
  - `onPress` - Callback when button is pressed
  - `isLoading` - Display loading indicator (default: false)
  - `isInfiniteScrollEnabled` - Enable infinite scroll up when reaching the top of messages container, automatically calls `onPress` (not yet supported for web)
  - `label` - Override the default "Load earlier messages" text
  - `containerStyle` - Custom style for the button container
  - `wrapperStyle` - Custom style for the button wrapper
  - `textStyle` - Custom style for the button text
  - `activityIndicatorStyle` - Custom style for the loading indicator
  - `activityIndicatorColor` - Color of the loading indicator (default: 'white')
  - `activityIndicatorSize` - Size of the loading indicator (default: 'small')
- **`renderLoadEarlier`** _(Component | Function)_ - Custom "Load earlier messages" button

### Typing Indicator

- **`isTyping`** _(Bool)_ - Typing Indicator state; default `false`. If you use`renderFooter` it will override this.
- **`renderTypingIndicator`** _(Component | Function)_ - Custom typing indicator component
- **`typingIndicatorStyle`** _(StyleProp<ViewStyle>)_ - Custom style for the TypingIndicator component.
- **`renderFooter`** _(Component | Function)_ - Custom footer component on the ListView, e.g. `'User is typing...'`; see [CustomizedFeaturesExample.tsx](example/components/chat-examples/CustomizedFeaturesExample.tsx) for an example. Overrides default typing indicator that triggers when `isTyping` is true.

### Quick Replies

See [Quick Replies example in messages.ts](example/example-expo/data/messages.ts)

- **`onQuickReply`** _(Function)_ - Callback when sending a quick reply (to backend server)
- **`renderQuickReplies`** _(Function)_ - Custom all quick reply view
- **`quickReplyStyle`** _(StyleProp<ViewStyle>)_ - Custom quick reply view style
- **`quickReplyTextStyle`** _(StyleProp<TextStyle>)_ - Custom text style for quick reply buttons
- **`quickReplyContainerStyle`** _(StyleProp<ViewStyle>)_ - Custom container style for quick replies
- **`renderQuickReplySend`** _(Function)_ - Custom quick reply **send** view

### Scroll to Bottom

- **`isScrollToBottomEnabled`** _(Bool)_ - Enables the scroll to bottom Component (Default is false)
- **`scrollToBottomComponent`** _(Function)_ - Custom Scroll To Bottom Component container
- **`scrollToBottomOffset`** _(Integer)_ - Custom Height Offset upon which to begin showing Scroll To Bottom Component (Default is 200)
- **`scrollToBottomStyle`** _(Object)_ - Custom style for Bottom Component container

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

  - Append [`KeyboardAvoidingView`](https://reactnative.dev/docs/keyboardavoidingview) after GiftedChat. This should only be done for Android, as `KeyboardAvoidingView` may conflict with the iOS keyboard avoidance already built into GiftedChat, e.g.:

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

1. Install `yarn global add expo-cli`
2. Install dependencies`yarn install`
3. `expo start`

### react-native-web

#### With expo

1. Install `yarn global add expo-cli`
2. Install dependencies`yarn install`
3. `expo start -w`

[Upgrade snack version](https://snackager.expo.io/bundle/react-native-gifted-chat@0.15.0?bypassCache=true)

#### With create-react-app

1. `yarn add -D react-app-rewired`
2. `touch config-overrides.js`

```js
module.exports = function override(config, env) {
  config.module.rules.push({
    test: /\.js$/,
    exclude: /node_modules[/\\](?!react-native-gifted-chat)/,
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

## Testing
`TEST_ID` is exported as constants that can be used in your testing library of choice

Gifted Chat uses `onLayout` to determine the height of the chat container. To trigger `onLayout` during your tests, you can run the following bits of code.

```typescript
const WIDTH = 200; // or any number
const HEIGHT = 2000; // or any number

const loadingWrapper = getByTestId(TEST_ID.LOADING_WRAPPER)
fireEvent(loadingWrapper, 'layout', {
  nativeEvent: {
    layout: {
      width: WIDTH,
      height: HEIGHT,
    },
  },
})
```

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

## You have a question?

1. Please check this readme and you might find a response
1. Please ask on StackOverflow first: https://stackoverflow.com/questions/tagged/react-native-gifted-chat
1. Find responses in existing issues
1. Try to keep issues for issues

## License

- [MIT](LICENSE)

## Author

Feel free to ask me questions on Twitter [@FaridSafi](https://www.twitter.com/FaridSafi)! or [@xcapetir](https://www.twitter.com/xcapetir)!

## Contributors

- Kevin Cooper [cooperka](https://github.com/cooperka)
- Kfir Golan [kfiroo](https://github.com/kfiroo)
- Bruno Cascio [brunocascio](https://github.com/brunocascio)
- Xavier Carpentier [xcarpentier](https://github.com/xcarpentier)
- Kesha Antonov [kesha-antonov](https://github.com/kesha-antonov)
- [more](https://github.com/FaridSafi/react-native-gifted-chat/graphs/contributors)

## Hire an expert!

Looking for a React Native freelance expert with more than 14 years of experience? Contact Xavier from his [website](https://xaviercarpentier.com)!

Need expert help with React Native Gifted Chat? Reach out to [Kesha Antonov](mailto:innokenty.longway@gmail.com)
