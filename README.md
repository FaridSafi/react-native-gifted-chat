# Gifted Messenger
Ready-to-use chat interface for iOS and Android React-Native apps

Dependency: React-Native >= v0.20.0 (scrollTo is now using {x, y, animated})


![](https://raw.githubusercontent.com/FaridSafi/react-native-gifted-messenger/master/screenshots/messenger-1.png)
![](https://raw.githubusercontent.com/FaridSafi/react-native-gifted-messenger/master/screenshots/messenger-2.png)


### Changelog
#### 0.0.25
- Android improvements
- New leftControlBar prop (PR @gnl)
- Various fixes and improvements by @swapkats, @ianlin, @zxcpoiu, @cnjon
#### 0.0.24
- Fix textInputContainer issue #83
#### 0.0.23
- Scroll to bottom after onSend, Add enablesReturnKeyAutomatically setting to end on return key (PR @alizbazar)
- New prop onMessageLongPress (PR @corymsmith)
- displayNamesInsideBubble and keyboardShouldPersistTaps props (PR @koppelaar)
- Expose full rowData to renderCustomText and add dynamic hide/show text input (PR @bpeters)


### Example

```js
var GiftedMessenger = require('react-native-gifted-messenger');
var {Dimensions} = React;

var GiftedMessengerExample = React.createClass({
  getMessages() {
    return [
      {text: 'Are you building a chat app?', name: 'React-Native', image: {uri: 'https://facebook.github.io/react/img/logo_og.png'}, position: 'left', date: new Date(2015, 0, 16, 19, 0)},
      {text: "Yes, and I use Gifted Messenger!", name: 'Developer', image: null, position: 'right', date: new Date(2015, 0, 17, 19, 0)},
    ];
  },
  handleSend(message = {}, rowID = null) {
    // Send message.text to your server
  },
  handleReceive() {
    this._GiftedMessenger.appendMessage({
      text: 'Received message',
      name: 'Friend',
      image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
      position: 'left',
      date: new Date(),
    });
  },
  render() {
    return (
      <GiftedMessenger
        ref={(c) => this._GiftedMessenger = c}

        messages={this.getMessages()}
        handleSend={this.handleSend}
        maxHeight={Dimensions.get('window').height - 64} // 64 for the navBar

        styles={{
          bubbleLeft: {
            backgroundColor: '#e6e6eb',
            marginRight: 70,
          },
          bubbleRight: {
            backgroundColor: '#007aff',
            marginLeft: 70,
          },
        }}
      />
    );
  },
});
```

### Advanced example

See [GiftedMessengerExample/GiftedMessengerExample.js](https://raw.githubusercontent.com/FaridSafi/react-native-gifted-messenger/master/GiftedMessengerExample/GiftedMessengerExample.js)


### Installation

```npm install react-native-gifted-messenger --save```


### Props


| Props name                    | Type     | Description                                                                | Platform | Default                          |
| ----------------------------- | -------- | -------------------------------------------------------------------------- | -------- | -------------------------------- |
| messages                      | Array    | List of messages to display                                                | Both     | []                               |
| displayNames                  | Boolean  | Display or not the name of the interlocutor(s)                             | Both     | true                             |
| displayNamesInsideBubble      | Boolean  | Display the name of the interlocutor(s) inside the bubble                  | Both     | false                             |
| placeholder                   | String   | TextInput placeholder                                                      | Both     | 'Type a message...'              |
placeholderTextColor                   | String   | TextInput text color placeholder                                                      | Both     | '#ccc'              |
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
| forceRenderImage              | Boolean  | Always render the users images (avatar)                                    | Both     | false                            |
| onCustomSend                  | Function | If you want to implement a progress bar. See PR #16                        | Both     | (message) => {}                  |
| renderCustomText              | Function | Implement your own text rendering                                          | Both     | (rowData) => {}           |
| onChangeText                  | Function | Called on every keypress in the TextInput                                  | Both     | (text) => {}                     |
| autoScroll                    | Boolean  | scroll to bottom when receiving new messages                               | Both     | false                            |
| scrollAnimated                | Boolean  | do animation when scrolling                                                | Both     | true                                  |

### Props update

The UI is updated when receiving new ```messages``` prop.


### API

- ```appendMessages(messages = [])``` // Add messages at the end of the list view

- ```appendMessage(message = {})``` // Add 1 message at the end of the list view

- ```prependMessages(messages = [])``` // Add messages at the begining of the list view

- ```prependMessage(message = {})``` // Add 1 message at the begining of the list view

- ```setMessageStatus(status = '', rowID)``` // Set the status of a message ('ErrorButton', 'Sent', 'Seen', 'Anything you want')

- ```getMessage(rowID)``` // Get message object by rowID

- ```getPreviousMessage(rowID)``` // Get previous message object of a rowID

- ```getNextMessage(rowID)``` // Get next message object of a rowID


### Message object

```js
var message = {
  text: 'Message content',
  name: "Sender's name",
  image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
  position: 'left', // left if received, right if sent
  date: new Date(),
  view: null, // A custom Bubble view
  // ...any attributes you want
};
```

### License

[MIT](LICENSE)



Feel free to ask me questions on Twitter [@FaridSafi](https://www.twitter.com/FaridSafi) !
