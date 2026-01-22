<p align="center">
  <a href="https://www.npmjs.com/package/react-native-gifted-chat"><img alt="npm version" src="https://badge.fury.io/js/react-native-gifted-chat.svg"/></a>
  <a href="https://www.npmjs.com/package/react-native-gifted-chat"><img alt="npm downloads" src="https://img.shields.io/npm/dm/react-native-gifted-chat.svg"/></a>
  <a href="https://circleci.com/gh/FaridSafi/react-native-gifted-chat"><img src="https://circleci.com/gh/FaridSafi/react-native-gifted-chat.svg?style=shield" alt="build"></a>
  <img src="https://img.shields.io/badge/platforms-iOS%20%7C%20Android%20%7C%20Web-lightgrey.svg" alt="platforms">
  <img src="https://img.shields.io/badge/TypeScript-supported-blue.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/Expo-compatible-000020.svg" alt="Expo compatible">
</p>

<h1 align="center">React Native Gifted Chat</h1>

<p align="center">
  The most complete chat UI for React Native & Web
</p>

<p align="center">
  <a href="https://snack.expo.dev/@kesha-antonov/gifted-chat-playground" target="_blank">
    <img src="https://img.shields.io/badge/▶️_Try_in_Browser-4630EB?style=for-the-badge&logo=expo&logoColor=white" alt="Try GiftedChat on Expo Snack"/>
  </a>
</p>

---

## ✨ Features

- 🎨 **Fully Customizable** - Override any component with your own implementation
- 📎 **Composer Actions** - Attach photos, files, or trigger custom actions
- ↩️ **Reply to Messages** - Swipe-to-reply with reply preview and message threading
- ⏮️ **Load Earlier Messages** - Infinite scroll with pagination support
- 📋 **Copy to Clipboard** - Long-press messages to copy text
- 🔗 **Smart Link Parsing** - Auto-detect URLs, emails, phone numbers, hashtags, mentions
- 👤 **Avatars** - User initials or custom avatar images
- 🌍 **Localized Dates** - Full i18n support via Day.js
- ⌨️ **Keyboard Handling** - Smart keyboard avoidance for all platforms
- 💬 **System Messages** - Display system notifications in chat
- ⚡ **Quick Replies** - Bot-style quick reply buttons
- ✍️ **Typing Indicator** - Show when users are typing
- ✅ **Message Status** - Tick indicators for sent/delivered/read states
- ⬇️ **Scroll to Bottom** - Quick navigation button
- 🌐 **Web Support** - Works with react-native-web
- 📱 **Expo Support** - Easy integration with Expo projects
- 📝 **TypeScript** - Complete TypeScript definitions included

<p align="center">
  <img width="200" src="https://github.com/user-attachments/assets/c9da88f5-0b20-471c-8cd7-373bdb767517" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img width="200" src="https://github.com/user-attachments/assets/f72b17f1-6c2e-43b5-87e7-477011aa3b07" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img width="200" src="https://github.com/user-attachments/assets/86711e73-ee3c-4527-b38d-e4dab47a44fe" />
</p>

---

<h3 align="center">Sponsors</h3>

<p align="center">
  <a href="https://www.lereacteur.io" target="_blank"><img src="https://raw.githubusercontent.com/FaridSafi/react-native-gifted-chat/master/media/logo_sponsor.png" height="50"></a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://getstream.io/chat/?utm_source=Github&utm_medium=Github_Repo_Content_Ad&utm_content=Developer&utm_campaign=Github_Jan2022_Chat&utm_term=react-native-gifted-chat" target="_blank"><img src="https://raw.githubusercontent.com/FaridSafi/react-native-gifted-chat/master/media/stream-logo.png" height="35"></a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://www.ethora.com" target="_blank"><img src="https://www.dappros.com/wp-content/uploads/2023/12/Ethora-Logo.png" height="50"></a>
</p>

<p align="center">
  <a href="https://www.lereacteur.io" target="_blank"><strong>Le Reacteur</strong></a> - Coding Bootcamp in Paris co-founded by Farid Safi
  <br>
  <a href="https://getstream.io/chat/?utm_source=Github&utm_medium=Github_Repo_Content_Ad&utm_content=Developer&utm_campaign=Github_Jan2022_Chat&utm_term=react-native-gifted-chat" target="_blank"><strong>Stream</strong></a> - Scalable chat API/Server written in Go (<a href="https://getstream.io/chat/get_started/?utm_source=Github&utm_medium=Github_Repo_Content_Ad&utm_content=Developer&utm_campaign=Github_Jan2022_Chat&utm_term=react-native-gifted-chat" target="_blank">API Tour</a> | <a href="https://dev.to/nickparsons/react-native-chat-with-chuck-norris-3h7m?utm_source=Github&utm_medium=Github_Repo_Content_Ad&utm_content=Developer&utm_campaign=Github_Jan2022_Chat&utm_term=react-native-gifted-chat" target="_blank">Tutorial</a>)
  <br>
  <a href="https://www.ethora.com" target="_blank"><strong>Ethora</strong></a> - A complete app engine featuring GiftedChat (<a href="https://bit.ly/ethorachat" target="_blank">GitHub</a>)
  <br><br>
  📚 <a href="https://amzn.to/3ZmTyb2" target="_blank">React Key Concepts (2nd ed.)</a>
</p>

---

## 📖 Table of Contents

- [Features](#-features)
- [Requirements](#-requirements)
- [Installation](#-installation)
- [Usage](#-usage)
- [Props Reference](#-props-reference)
- [Data Structure](#-data-structure)
- [Platform Notes](#-platform-notes)
- [Example App](#-example-app)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Authors](#-authors)
- [License](#-license)

---

## 📋 Requirements

| Requirement | Version |
|-------------|---------|
| React Native | >= 0.70.0 |
| iOS | >= 13.4 |
| Android | API 21+ (Android 5.0) |
| Expo | SDK 50+ |
| TypeScript | >= 5.0 (optional) |

---

## 📦 Installation

### Expo Projects

```bash
npx expo install react-native-gifted-chat react-native-reanimated react-native-gesture-handler react-native-safe-area-context react-native-keyboard-controller
```

### Bare React Native Projects

**Step 1:** Install the packages

Using yarn:
```bash
yarn add react-native-gifted-chat react-native-reanimated react-native-gesture-handler react-native-safe-area-context react-native-keyboard-controller
```

Using npm:
```bash
npm install --save react-native-gifted-chat react-native-reanimated react-native-gesture-handler react-native-safe-area-context react-native-keyboard-controller
```

**Step 2:** Install iOS pods

```bash
npx pod-install
```

**Step 3:** Configure react-native-reanimated

Follow the [react-native-reanimated installation guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/#step-2-add-reanimateds-babel-plugin) to add the Babel plugin.

---

## 🚀 Usage

### Basic Example

```jsx
import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { useHeaderHeight } from '@react-navigation/elements'

export function Example() {
  const [messages, setMessages] = useState([])

  // keyboardVerticalOffset = distance from screen top to GiftedChat container
  // useHeaderHeight() returns status bar + navigation header height
  const headerHeight = useHeaderHeight()

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'John Doe',
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
      keyboardAvoidingViewProps={{ keyboardVerticalOffset: headerHeight }}
    />
  )
}
```

> **💡 Tip:** Check out more examples in the [`example`](example) directory including Slack-style messages, quick replies, and custom components.

---

## 📊 Data Structure

Messages, system messages, and quick replies follow the structure defined in [Models.ts](src/Models.ts).

<details>
<summary><strong>Message Object Structure</strong></summary>

```typescript
interface IMessage {
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

interface User {
  _id: string | number
  name?: string
  avatar?: string | number | (() => React.ReactNode)
}
```

</details>

---

## 📖 Props Reference

### Core Configuration

- **`messages`** _(Array)_ - Messages to display
- **`user`** _(Object)_ - User sending the messages: `{ _id, name, avatar }`
- **`onSend`** _(Function)_ - Callback when sending a message
- **`messageIdGenerator`** _(Function)_ - Generate an id for new messages. Defaults to a simple random string generator.
- **`locale`** _(String)_ - Locale to localize the dates. You need first to import the locale you need (ie. `require('dayjs/locale/de')` or `import 'dayjs/locale/fr'`)
- **`colorScheme`** _('light' | 'dark')_ - Force color scheme (light/dark mode). When set to `'light'` or `'dark'`, it overrides the system color scheme. When `undefined`, it uses the system color scheme. Default is `undefined`.

### Refs

- **`messagesContainerRef`** _(FlatList ref)_ - Ref to the flatlist
- **`textInputRef`** _(TextInput ref)_ - Ref to the text input

### Keyboard & Layout

- **`keyboardProviderProps`** _(Object)_ - Props to be passed to the [`KeyboardProvider`](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/keyboard-provider) for keyboard handling. Default values:
  - `statusBarTranslucent: true` - Required on Android for correct keyboard height calculation when status bar is translucent (edge-to-edge mode)
  - `navigationBarTranslucent: true` - Required on Android for correct keyboard height calculation when navigation bar is translucent (edge-to-edge mode)
- **`keyboardAvoidingViewProps`** _(Object)_ - Props to be passed to the [`KeyboardAvoidingView`](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/components/keyboard-avoiding-view). See **keyboardVerticalOffset** below for proper keyboard handling.
- **`isAlignedTop`** _(Boolean)_ Controls whether or not the message bubbles appear at the top of the chat (Default is false - bubbles align to bottom)
- **`isInverted`** _(Bool)_ - Reverses display order of `messages`; default is `true`

#### Understanding `keyboardVerticalOffset`

The [`keyboardVerticalOffset`](https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/components/keyboard-avoiding-view#keyboardverticaloffset) tells the KeyboardAvoidingView where its container starts relative to the top of the screen. This is essential when GiftedChat is not positioned at the very top of the screen (e.g., when you have a navigation header).

**Default value:** `insets.top` (status bar height from `useSafeAreaInsets()`). This works correctly only when GiftedChat fills the entire screen without a navigation header. If you have a navigation header, you need to pass the correct offset via `keyboardAvoidingViewProps`.

**What the value means:** The offset equals the distance (in points) from the top of the screen to the top of your GiftedChat container. This typically includes:
- Status bar height
- Navigation header height (on iOS, `useHeaderHeight()` already includes status bar)

**How to use:**

```jsx
import { useHeaderHeight } from '@react-navigation/elements'

function ChatScreen() {
  // useHeaderHeight() returns status bar + navigation header height on iOS
  const headerHeight = useHeaderHeight()

  return (
    <GiftedChat
      keyboardAvoidingViewProps={{ keyboardVerticalOffset: headerHeight }}
      // ... other props
    />
  )
}
```

> **Note:** `useHeaderHeight()` requires your chat component to be rendered inside a proper navigation screen (not conditional rendering). If it returns `0`, ensure your chat screen is a real navigation screen with a visible header.

**Why this matters:** Without the correct offset, the keyboard may overlap the input field or leave extra space. The KeyboardAvoidingView uses this value to calculate how much to shift the content when the keyboard appears.

### Text Input & Composer

- **`text`** _(String)_ - Input text; default is `undefined`, but if specified, it will override GiftedChat's internal state. Useful for managing text state outside of GiftedChat (e.g. with Redux). Don't forget to implement `textInputProps.onChangeText` to update the text state.
- **`initialText`** _(String)_ - Initial text to display in the input field
- **`isSendButtonAlwaysVisible`** _(Bool)_ - Always show send button in input text composer; default `false`, show only when text input is not empty
- **`isTextOptional`** _(Bool)_ - Allow sending messages without text (useful for media-only messages); default `false`. Use with `isSendButtonAlwaysVisible` for media attachments.
- **`minComposerHeight`** _(Object)_ - Custom min-height of the composer.
- **`maxComposerHeight`** _(Object)_ - Custom max height of the composer.
- **`minInputToolbarHeight`** _(Integer)_ - Minimum height of the input toolbar; default is `44`
- **`renderInputToolbar`** _(Component | Function)_ - Custom message composer container
- **`renderComposer`** _(Component | Function)_ - Custom text input message composer
- **`renderSend`** _(Component | Function)_ - Custom send button; you can pass children to the original `Send` component quite easily, for example, to use a custom icon ([example](https://github.com/FaridSafi/react-native-gifted-chat/pull/487))
- **`renderActions`** _(Component | Function)_ - Custom action button on the left of the message composer
- **`renderAccessory`** _(Component | Function)_ - Custom second line of actions below the message composer
- **`textInputProps`** _(Object)_ - props to be passed to the [`<TextInput>`](https://reactnative.dev/docs/textinput).

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
- **`renderChatFooter`** _(Component | Function)_ - Custom component to render below the MessagesContainer (separate from the ListView)
- **`listProps`** _(Object)_ - Extra props to be passed to the messages [`<FlatList>`](https://reactnative.dev/docs/flatlist). Supports all FlatList props including `maintainVisibleContentPosition` for keeping scroll position when new messages arrive (useful for AI chatbots).

### Message Bubbles & Content

- **`renderBubble`** _(Component | Function(`props: BubbleProps`))_ - Custom message bubble. Receives [BubbleProps](src/Bubble/types.ts) as parameter.
- **`renderMessageText`** _(Component | Function)_ - Custom message text
- **`renderMessageImage`** _(Component | Function)_ - Custom message image
- **`renderMessageVideo`** _(Component | Function)_ - Custom message video
- **`renderMessageAudio`** _(Component | Function)_ - Custom message audio
- **`renderCustomView`** _(Component | Function)_ - Custom view inside the bubble
- **`isCustomViewBottom`** _(Bool)_ - Determine whether renderCustomView is displayed before or after the text, image and video views; default is `false`
- **`onPressMessage`** _(Function(`context`, `message`))_ - Callback when a message bubble is pressed
- **`onLongPressMessage`** _(Function(`context`, `message`))_ - Callback when a message bubble is long-pressed; you can use this to show action sheets (e.g., copy, delete, reply)
- **`imageProps`** _(Object)_ - Extra props to be passed to the [`<Image>`](https://reactnative.dev/docs/image) component created by the default `renderMessageImage`
- **`imageStyle`** _(Object)_ - Custom style for message images
- **`videoProps`** _(Object)_ - Extra props to be passed to the video component created by the required `renderMessageVideo`
- **`messageTextProps`** _(Object)_ - Extra props to be passed to the MessageText component. Useful for customizing link parsing behavior, text styles, and matchers. Supports the following props:
  - `matchers` - Custom matchers for linking message content (like URLs, phone numbers, hashtags, mentions)
  - `linkStyle` - Custom style for links
  - `email` - Enable/disable email parsing (default: true)
  - `phone` - Enable/disable phone number parsing (default: true)
  - `url` - Enable/disable URL parsing (default: true)
  - `hashtag` - Enable/disable hashtag parsing (default: false)
  - `mention` - Enable/disable mention parsing (default: false)
  - `hashtagUrl` - Base URL for hashtags (e.g., 'https://x.com/hashtag')
  - `mentionUrl` - Base URL for mentions (e.g., 'https://x.com')
  - `stripPrefix` - Strip 'http://' or 'https://' from URL display (default: false)
  - `TextComponent` - Custom Text component to use (e.g., from react-native-gesture-handler)

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
- **`isUserAvatarVisible`** _(Bool)_ - Whether to render an avatar for the current user; default is `false`, only show avatars for other users
- **`isAvatarVisibleForEveryMessage`** _(Bool)_ - When false, avatars will only be displayed when a consecutive message is from the same user on the same day; default is `false`
- **`onPressAvatar`** _(Function(`user`))_ - Callback when a message avatar is tapped
- **`onLongPressAvatar`** _(Function(`user`))_ - Callback when a message avatar is long-pressed
- **`isAvatarOnTop`** _(Bool)_ - Render the message avatar at the top of consecutive messages, rather than the bottom; default is `false`

### Username

- **`isUsernameVisible`** _(Bool)_ - Indicate whether to show the user's username inside the message bubble; default is `false`
- **`renderUsername`** _(Component | Function)_ - Custom Username container

### Date & Time

- **`timeFormat`** _(String)_ - Format to use for rendering times; default is `'LT'` (see [Day.js Format](https://day.js.org/docs/en/display/format))
- **`dateFormat`** _(String)_ - Format to use for rendering dates; default is `'D MMMM'` (see [Day.js Format](https://day.js.org/docs/en/display/format))
- **`dateFormatCalendar`** _(Object)_ - Format to use for rendering relative times; default is `{ sameDay: '[Today]' }` (see [Day.js Calendar](https://day.js.org/docs/en/plugin/calendar))
- **`renderDay`** _(Component | Function)_ - Custom day above a message
- **`dayProps`** _(Object)_ - Props to pass to the Day component:
  - `containerStyle` - Custom style for the day container
  - `wrapperStyle` - Custom style for the day wrapper
  - `textProps` - Props to pass to the Text component (e.g., `style`, `allowFontScaling`, `numberOfLines`)
- **`renderTime`** _(Component | Function)_ - Custom time inside a message
- **`timeTextStyle`** _(Object)_ - Custom text style for time inside messages (supports left/right styles)
- **`isDayAnimationEnabled`** _(Bool)_ - Enable animated day label that appears on scroll; default is `true`

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

### Reply to Messages

Gifted Chat supports swipe-to-reply functionality out of the box. When enabled, users can swipe on a message to reply to it, displaying a reply preview in the input toolbar and the replied message above the new message bubble.

> **Note:** This feature uses `ReanimatedSwipeable` from `react-native-gesture-handler` and `react-native-reanimated` for smooth, performant animations.

#### Basic Usage

```tsx
<GiftedChat
  messages={messages}
  onSend={onSend}
  user={{ _id: 1 }}
  reply={{
    swipe: {
      isEnabled: true,
      direction: 'left', // swipe left to reply
    },
  }}
/>
```

#### Reply Props (Grouped)

The `reply` prop accepts an object with the following structure:

```typescript
interface ReplyProps<TMessage> {
  // Swipe gesture configuration
  swipe?: {
    isEnabled?: boolean              // Enable swipe-to-reply; default false
    direction?: 'left' | 'right'     // Swipe direction; default 'left'
    onSwipe?: (message: TMessage) => void  // Callback when swiped
    renderAction?: (                 // Custom swipe action component
      progress: SharedValue<number>,
      translation: SharedValue<number>,
      position: 'left' | 'right'
    ) => React.ReactNode
    actionContainerStyle?: StyleProp<ViewStyle>
  }

  // Reply preview styling (above input toolbar)
  previewStyle?: {
    containerStyle?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    imageStyle?: StyleProp<ImageStyle>
  }

  // In-bubble reply styling
  messageStyle?: {
    containerStyle?: StyleProp<ViewStyle>
    containerStyleLeft?: StyleProp<ViewStyle>
    containerStyleRight?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    textStyleLeft?: StyleProp<TextStyle>
    textStyleRight?: StyleProp<TextStyle>
    imageStyle?: StyleProp<ImageStyle>
  }

  // Callbacks and state
  message?: ReplyMessage             // Controlled reply state
  onClear?: () => void               // Called when reply cleared
  onPress?: (message: TMessage) => void  // Called when reply preview tapped

  // Custom renderers
  renderPreview?: (props: ReplyPreviewProps) => React.ReactNode
  renderMessageReply?: (props: MessageReplyProps) => React.ReactNode
}
```

#### ReplyMessage Structure

When a message has a reply, it includes a `replyMessage` property:

```typescript
interface ReplyMessage {
  _id: string | number
  text: string
  user: User
  image?: string
  audio?: string
}
```

#### Advanced Example with External State

```tsx
const [replyMessage, setReplyMessage] = useState<ReplyMessage | null>(null)

<GiftedChat
  messages={messages}
  onSend={messages => {
    const newMessages = messages.map(msg => ({
      ...msg,
      replyMessage: replyMessage || undefined,
    }))
    setMessages(prev => GiftedChat.append(prev, newMessages))
    setReplyMessage(null)
  }}
  user={{ _id: 1 }}
  reply={{
    swipe: {
      isEnabled: true,
      direction: 'right',
      onSwipe: setReplyMessage,
    },
    message: replyMessage,
    onClear: () => setReplyMessage(null),
    onPress: (msg) => scrollToMessage(msg._id),
  }}
/>
```

#### Smooth Animations

The reply preview automatically animates when:
- **Appearing**: Smoothly expands from zero height with fade-in effect
- **Disappearing**: Smoothly collapses with fade-out effect
- **Content changes**: Smoothly transitions when replying to a different message

These animations use `react-native-reanimated` for 60fps performance.

### Scroll to Bottom

- **`isScrollToBottomEnabled`** _(Bool)_ - Enables the scroll to bottom Component (Default is false)
- **`scrollToBottomComponent`** _(Function)_ - Custom Scroll To Bottom Component container
- **`scrollToBottomOffset`** _(Integer)_ - Custom Height Offset upon which to begin showing Scroll To Bottom Component (Default is 200)
- **`scrollToBottomStyle`** _(Object)_ - Custom style for Scroll To Bottom wrapper (position, bottom, right, etc.)
- **`scrollToBottomContentStyle`** _(Object)_ - Custom style for Scroll To Bottom content (size, background, shadow, etc.)

### Maintaining Scroll Position (AI Chatbots)

For AI chat interfaces where long responses arrive and you don't want to disrupt the user's reading position, use [`maintainVisibleContentPosition`](https://reactnative.dev/docs/scrollview#maintainvisiblecontentposition) via `listProps`:

```tsx
// Basic usage - always maintain scroll position
<GiftedChat
  listProps={{
    maintainVisibleContentPosition: {
      minIndexForVisible: 0,
    },
  }}
/>

// With auto-scroll threshold - auto-scroll if within 10 pixels of newest content
<GiftedChat
  listProps={{
    maintainVisibleContentPosition: {
      minIndexForVisible: 0,
      autoscrollToTopThreshold: 10,
    },
  }}
/>

// Conditionally enable based on scroll state (recommended for chatbots)
const [isScrolledUp, setIsScrolledUp] = useState(false)

<GiftedChat
  listProps={{
    onScroll: (event) => {
      setIsScrolledUp(event.contentOffset.y > 50)
    },
    maintainVisibleContentPosition: isScrolledUp
      ? { minIndexForVisible: 0, autoscrollToTopThreshold: 10 }
      : undefined,
  }}
/>
```

---

## 📱 Platform Notes

### Android

<details>
<summary><strong>Keyboard configuration</strong></summary>

If you are using Create React Native App / Expo, no Android specific installation steps are required. Otherwise, we recommend modifying your project configuration:

Make sure you have `android:windowSoftInputMode="adjustResize"` in your `AndroidManifest.xml`:

```xml
<activity
  android:name=".MainActivity"
  android:label="@string/app_name"
  android:windowSoftInputMode="adjustResize"
  android:configChanges="keyboard|keyboardHidden|orientation|screenSize">
```

For **Expo**, you can append `KeyboardAvoidingView` after GiftedChat (Android only):

```jsx
<View style={{ flex: 1 }}>
   <GiftedChat />
   {Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />}
</View>
```

</details>

### Web (react-native-web)

<details>
<summary><strong>With create-react-app</strong></summary>

1. Install react-app-rewired: `yarn add -D react-app-rewired`
2. Create `config-overrides.js`:

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

> **Examples:**
> - [xcarpentier/gifted-chat-web-demo](https://github.com/xcarpentier/gifted-chat-web-demo)
> - [Gatsby example](https://github.com/xcarpentier/clean-archi-boilerplate/tree/develop/apps/web)

</details>

---

## 🧪 Testing

<details>
<summary><strong>Triggering layout events in tests</strong></summary>

`TEST_ID` is exported as constants that can be used in your testing library of choice.

Gifted Chat uses `onLayout` to determine the height of the chat container. To trigger `onLayout` during your tests:

```typescript
const WIDTH = 200
const HEIGHT = 2000

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

</details>

---

## 📦 Example App

The repository includes a comprehensive example app demonstrating all features:

```bash
# Clone and install
git clone https://github.com/FaridSafi/react-native-gifted-chat.git
cd react-native-gifted-chat/example
yarn install

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android

# Run on Web
npx expo start --web
```

The example app showcases:
- 💬 Basic chat functionality
- 🎨 Custom message bubbles and avatars
- ↩️ Reply to messages with swipe gesture
- ⚡ Quick replies (bot-style)
- ✍️ Typing indicators
- 📎 Attachment actions
- 🔗 Link parsing and custom matchers
- 🌐 Web compatibility

---

## ❓ Troubleshooting

<details>
<summary><strong>TextInput is hidden on Android</strong></summary>

Make sure you have `android:windowSoftInputMode="adjustResize"` in your `AndroidManifest.xml`. See [Android configuration](#android) above.

</details>

<details>
<summary><strong>How to set Bubble color for each user?</strong></summary>

See [this issue](https://github.com/FaridSafi/react-native-gifted-chat/issues/672) for examples.

</details>

<details>
<summary><strong>How to customize InputToolbar styles?</strong></summary>

See [this issue](https://github.com/FaridSafi/react-native-gifted-chat/issues/662) for examples.

</details>

<details>
<summary><strong>How to manually dismiss the keyboard?</strong></summary>

See [this issue](https://github.com/FaridSafi/react-native-gifted-chat/issues/647) for examples.

</details>

<details>
<summary><strong>How to use renderLoading?</strong></summary>

See [this issue](https://github.com/FaridSafi/react-native-gifted-chat/issues/298) for examples.

</details>

---

## 🤔 Have a Question?

1. Check this README first
2. Search [existing issues](https://github.com/FaridSafi/react-native-gifted-chat/issues)
3. Ask on [StackOverflow](https://stackoverflow.com/questions/tagged/react-native-gifted-chat)
4. Open a new issue if needed

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Install dependencies (`yarn install`)
4. Make your changes
5. Run tests (`yarn test`)
6. Run linting (`yarn lint`)
7. Build the library (`yarn build`)
8. Commit your changes (`git commit -m 'Add amazing feature'`)
9. Push to the branch (`git push origin feature/amazing-feature`)
10. Open a Pull Request

### Development Setup

```bash
# Install dependencies
yarn install

# Build the library
yarn build

# Run tests
yarn test

# Run linting
yarn lint

# Full validation
yarn prepublishOnly
```

---

## 👥 Authors

**Original Author:** [Farid Safi](https://www.x.com/FaridSafi)

**Co-maintainer:** [Xavier Carpentier](https://www.x.com/xcapetir) - [Hire Xavier](https://xaviercarpentier.com)

**Maintainer:** [Kesha Antonov](https://github.com/kesha-antonov)

> Please note that this project is maintained in free time. If you find it helpful, please consider [becoming a sponsor](https://github.com/sponsors/kesha-antonov).

---

## 📄 License

[MIT](LICENSE)

---

<p align="center">
  <sub>Built with ❤️ by the React Native community</sub>
</p>
