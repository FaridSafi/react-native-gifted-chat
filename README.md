# react-native-gifted-messenger
Ready-to-use chat interface for iOS and Android React-Native apps

![](https://raw.githubusercontent.com/FaridSafi/react-native-gifted-messenger/master/screenshots/1.png)
![](https://raw.githubusercontent.com/FaridSafi/react-native-gifted-messenger/master/screenshots/2.png)
![](https://raw.githubusercontent.com/FaridSafi/react-native-gifted-messenger/master/screenshots/3.png)
![](https://raw.githubusercontent.com/FaridSafi/react-native-gifted-messenger/master/screenshots/4.png)

### Simple example

```js
var GiftedMessenger = require('react-native-gifted-messenger');
var {Dimensions} = React;

var GiftedMessengerExample = React.createClass({
  getInitialMessages() {
    return [
      {text: 'Are you building a chat app?', name: 'React-Native', image: {uri: 'https://facebook.github.io/react/img/logo_og.png'}, position: 'left', date: new Date(2015, 0, 16, 19, 0)},
      {text: "Yes, and I use Gifted Messenger!", name: 'Developer', image: null, position: 'right', date: new Date(2015, 0, 17, 19, 0)},
    ];
  },
  handleSend(message = {}, rowID = null) {
    // Send message.text to your server
  },
  handleReceive() {
    this.refs.GiftedMessenger.appendMessage({
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
        ref='GiftedMessenger'
        initialMessages={this.getInitialMessages()}
        handleSend={this.handleSend}
        maxHeight={Dimensions.get('window').height - navBarHeight} // 64 for the navBar
        
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

[See GiftedMessengerExample/GiftedMessengerExample.js](https://raw.githubusercontent.com/FaridSafi/react-native-gifted-messenger/master/GiftedMessengerExample/GiftedMessengerExample.js)


### Installation

```npm install react-native-gifted-messenger --save```


### Props


| Props name                    | Platform | Description                                                                | Default                          | Type     |
| ----------------------------- | -------- | -------------------------------------------------------------------------- | -------------------------------- | -------- |
| displayNames                  | Both     | Display or not the name of the interlocutor(s)                             | true                             | Boolean  |
| placeholder                   | Both     | TextInput placeholder                                                      | 'Type a message...'              | String   |
| styles                        | Both     | Styles of children components - See GiftedMessenger.js/componentWillMount  | {}                               | Function |
| autoFocus                     | Both     | TextInput auto focus                                                       | true                             | Boolean  |
| onErrorButtonPress            | Both     | Called when the re-send button is pressed                                  | (message, rowID) => {}           | Function |
| loadEarlierMessagesButton     | Both     | Display or not the button to load earlier message                          | false                            | Boolean  |
| loadEarlierMessagesButtonText | Both     | Label of the 'Load Earlier Messages' button                                | 'Load earlier messages'          | String   |
| onLoadEarlierMessages         | Both     | Called when 'Load Earlier Message' button is pressed                       | (oldestMessage, callback) => {}  | Function |
| initialMessages               | Both     | List of initial messages                                                   | []                               | Array    |
| handleSend                    | Both     | Called when a message is Sent                                              | (message, rowID) => {}           | Function |
| maxHeight                     | Both     | Max height of the component                                                | Dimensions.get('window').height  | Integer  |
| senderName                    | Both     | Name of the sender of the messages                                         | 'Sender'                         | String   |
| senderImage                   | Both     | Image of the sender                                                        | null                             | Object   |
| sendButtonText                | Both     | 'Send' button label                                                        | 'Send'                           | String   |
| onImagePress                  | Both     | Called when the image of a message is pressed                              | (rowData, rowID) => {}           | Function |
| parseText                     | iOS      | If the text has to be parsed with taskrabbit/react-native-parsed-text      | true                             | Boolean  |
| handleUrlPress                | iOS      | Called when a parsed url is pressed                                        | (url) => {}                      | Function |
| handlePhonePress              | iOS      | Called when a parsed phone number is pressed                               | (phone) => {}                    | Function |
| handleEmailPress              | iOS      | Called when a parsed email is pressed                                      | (email) => {}                    | Function |
| inverted                      | Both     | Invert vertically the orientation of the chat                              | true                             | Boolean  |

* In React-Native 0.14.2, I recommend to use inverted={false} in Android until issue [#3557](https://github.com/facebook/react-native/issues/3557) is fixed 


### API

- Add messages at the end of the list view
```appendMessages(messages = [])```

- Add 1 message at the end of the list view
```appendMessage(message = {})```

- Add messages at the begining of the list view
```prependMessages(messages = [])```

- Add 1 message at the begining of the list view
```prependMessage(message = {})```

- Set the status of a message ('ErrorButton', 'Sent', 'Seen', 'Anything you want')
```setMessageStatus(status = '', rowID)```

- Get message object by rowID
```getMessage(rowID)```

- Get previous message object of a rowID
```getPreviousMessage(rowID)```

- Get next message object of a rowID
```getNextMessage(rowID)```


### Message object

var message = {
  text: 'Message content', 
  name: "Sender's name", 
  image: {uri: 'https://facebook.github.io/react/img/logo_og.png'}, 
  position: 'left', // left if received, right if sent
  date: new Date(),
  // ...any attributes you want
};

### License

[MIT](LICENSE)



Follow [@FaridSafi](https://www.twitter.com/FaridSafi) on Twitter for updates about React-Native !