# Gifted Messenger
Ready-to-use chat interface for iOS and Android React-Native apps

![](https://raw.githubusercontent.com/FaridSafi/react-native-gifted-messenger/master/screenshots/messenger-1.png)
![](https://raw.githubusercontent.com/FaridSafi/react-native-gifted-messenger/master/screenshots/messenger-2.png)


### Changelog
#### 0.1.0 - Breaking changes for a better Gifted Messenger
- Breaking: API is now deprecated, messages list are now managed only using states - See [example](https://raw.githubusercontent.com/FaridSafi/react-native-gifted-messenger/master/GiftedMessengerExample/GiftedMessengerContainer.js)
- Breaking: All messages should now contain a `uniqueId` property
- Breaking: `setMessageStatus` is now deprecated, use the message attribute `status` instead
- Breaking: New prop `isLoadingEarlierMessages` to display a loader when loading earlier messages
- New prop `typingMessage` for displaying 'User is typing a message...'
- New prop `leftControlBar` - PR [@gnl](https://github.com/gnl)
- Android improvements
- `react-native-parsed-text` has been re-implemented
- ESLint implementation - PR [@sethx](https://github.com/sethx)
- ES6 & Example refactoring
- Fixing scroll when loading earlier messages
- Various fixes and improvements by [@swapkats](https://github.com/swapkats), [@ianlin](https://github.com/ianlin), [@zxcpoiu](https://github.com/zxcpoiu), [@cnjon](https://github.com/cnjon)
- Special thanks to [@yogiben](https://github.com/yogiben), [@koppelaar](https://github.com/koppelaar) & [@sethx](https://github.com/sethx) for their help

### Example
See [GiftedMessengerExample/GiftedMessengerContainer.js](https://raw.githubusercontent.com/FaridSafi/react-native-gifted-messenger/master/GiftedMessengerExample/GiftedMessengerContainer.js)

### Installation
```npm install react-native-gifted-messenger --save```

### Props


| Props name                    | Type     | Description                                                                | Platform | Default                          |
| ----------------------------- | -------- | -------------------------------------------------------------------------- | -------- | -------------------------------- |
| messages                      | Array    | List of messages to display                                                | Both     | []                               |
| displayNames                  | Boolean  | Display or not the name of the interlocutor(s)                             | Both     | true                             |
| displayNamesInsideBubble      | Boolean  | Display the name of the interlocutor(s) inside the bubble                  | Both     | false                            |
| placeholder                   | String   | TextInput placeholder                                                      | Both     | 'Type a message...'              |
| placeholderTextColor          | String   | TextInput text color placeholder                                           | Both     | '#ccc'                           |
| styles                        | Function | Styles of children components - See GiftedMessenger.js/componentWillMount  | Both     | {}                               |
| autoFocus                     | Boolean  | TextInput auto focus                                                       | Both     | true                             |
| onErrorButtonPress            | Function | Called when the re-send button is pressed                                  | Both     | (message, rowID) => {}           |
| loadEarlierMessagesButton     | Boolean  | Display or not the button to load earlier message                          | Both     | false                            |
| loadEarlierMessagesButtonText | String   | Label of the 'Load Earlier Messages' button                                | Both     | 'Load earlier messages'          |
| onLoadEarlierMessages         | Function | Called when 'Load Earlier Message' button is pressed                       | Both     | (oldestMessage, callback) => {}  |
| handleSend                    | Function | Called when a message is Sent                                              | Both     | (message, rowID) => {}           |
| maxHeight                     | Integer  | Max height of the component                                                | Both     | Dimensions.get('window').height  |
| senderName                    | String   | Name of the sender of the messages                                         | Both     | 'Sender'                         |
| senderImage                   | Object   | Image of the sender                                                        | Both     | null                             |
| sendButtonText                | String   | 'Send' button label                                                        | Both     | 'Send'                           |
| leftControlBar                | Element  | Optional control element displayed left of the TextInput                   | Both     | null                             |
| onImagePress                  | Function | Called when the image of a message is pressed                              | Both     | (rowData, rowID) => {}           |
| parseText                     | Boolean  | If the text has to be parsed with taskrabbit/react-native-parsed-text      | iOS      | true                             |
| handleUrlPress                | Function | Called when a parsed url is pressed                                        | iOS      | (url) => {}                      |
| handlePhonePress              | Function | Called when a parsed phone number is pressed                               | iOS      | (phone) => {}                    |
| handleEmailPress              | Function | Called when a parsed email is pressed                                      | iOS      | (email) => {}                    |
| hideTextInput                 | Boolean  | Hide or not the text input                                                 | Both     | false                            |
| keyboardShouldPersistTaps     | Boolean  | When false, tapping the scrollview dismisses the keyboard.                 | Both     | true                             |
| keyboardDismissMode           | String   | Method to dismiss the keyboard when dragging (none, interactive, on-drag)  | Both     | interactive                      |
| returnKeyType                 | Boolean  | Determine if pressing 'send' will trigger handleSend                       | iOS      | false                            |
| submitOnReturn                | Boolean  | Send message when clicking on submit                                       | Both     | false                            |
| blurOnSubmit                  | Boolean  | Dismiss the keyboard when clicking on submit                               | Both     | false                            |
| forceRenderImage              | Boolean  | Always render the users images (avatar)                                    | Both     | false                            |
| onCustomSend                  | Function | If you want to implement a progress bar. See PR #16                        | Both     | (message) => {}                  |
| renderCustomText              | Function | Implement your own text rendering                                          | Both     | (rowData) => {}                  |
| onChangeText                  | Function | Called on every keypress in the TextInput                                  | Both     | (text) => {}                     |
| scrollAnimated                | Boolean  | do animation when scrolling                                                | Both     | true                             |
| typingMessage                 | String   | Display a text at the bottom of the list. Eg: 'User is typing a message'   | Both     | ''                               |
| isLoadingEarlierMessages      | Boolean  | Display a loader when loading earlier messages                             | Both     | false                            |


### Message object

```js
var message = {
  uniqueId: 'XXXXX' // each messages should have an unique identifer - mandatory
  text: 'Message content',
  name: "Sender's name",
  image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
  position: 'left', // left for received messages, right for sent messages
  date: new Date(),
  view: null, // A custom Bubble view - the view will receive the message attributes as props
  status: 'Seen', // if status is 'ErrorButton', a re-send button will be displayed
  // ...any attributes you want
};
```

### Android installation
- Add `windowSoftInputMode` in your Android Manifest `android/app/src/main/AndroidManifest.xml`
```
<!-- ... -->
  android:label="@string/app_name"
  android:windowSoftInputMode="adjustResize"
  android:configChanges="keyboard|keyboardHidden|orientation|screenSize">
<!-- ... -->
```
- Calculate the maxHeight prop using [react-native-extra-dimensions-android](https://github.com/jaysoo/react-native-extra-dimensions-android)
```js
  <GiftedMessenger
    // ...
    maxHeight={Dimensions.get('window').height - Navigator.NavigationBar.Styles.General.NavBarHeight - ExtraDimensions.get('STATUS_BAR_HEIGHT')}
    // ...
  />
```

### Known issues
- Android: When updating a message status, scroll to bottom is not triggered - Related to https://github.com/facebook/react-native/issues/5688


### License

[MIT](LICENSE)


Feel free to ask me questions on Twitter [@FaridSafi](https://www.twitter.com/FaridSafi) !