'use strict';

import React, {
  Linking,
  Platform,
  ActionSheetIOS,
  Dimensions,
  View,
  Text,
  Navigator,
  Component,
} from 'react-native';

var GiftedMessenger = require('react-native-gifted-messenger');
var Communications = require('react-native-communications');


var STATUS_BAR_HEIGHT = Navigator.NavigationBar.Styles.General.StatusBarHeight;
if (Platform.OS === 'android') {
  var ExtraDimensions = require('react-native-extra-dimensions-android');
  var STATUS_BAR_HEIGHT = ExtraDimensions.get('STATUS_BAR_HEIGHT');
}


class GiftedMessengerContainer extends Component {
  
  constructor(props) {
    super(props);
    
    this._isMounted = false;
    this._messages = this.getInitialMessages();
    
    this.state = {
      messages: this._messages,
      isLoadingEarlierMessages: false,
      typingMessage: '',
    };
    
  }
  
  // TODO check if we always use isMounted when necessary (including in the component)
  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  
  getInitialMessages() {
    return [
      {
        text: 'Are you building a chat app?', 
        name: 'React-Native', 
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'}, 
        position: 'left', 
        date: new Date(2015, 10, 16, 19, 0),
        uniqueId: Math.round(Math.random() * 1000), // simulating server-side unique id generation
      },
      {
        text: "Yes, and I use Gifted Messenger!", 
        name: 'Developer', 
        image: null, 
        position: 'right', 
        date: new Date(2015, 10, 17, 19, 0),
        uniqueId: Math.round(Math.random() * 1000), // simulating server-side unique id generation
      },
    ];
  }
  
  setMessageStatus(uniqueId, status) {
    let messages = [];
    let found = false;
    
    for (let i = 0; i < this._messages.length; i++) {
      if (this._messages[i].uniqueId === uniqueId) {
        let clone = Object.assign({}, this._messages[i]);
        clone.status = status;
        messages.push(clone);
        found = true;
      } else {
        messages.push(this._messages[i]);
      }
    }
    
    if (found === true) {
      this.setMessages(messages);
    }
  }
  
  setMessages(messages) {
    this._messages = messages;
    
    // append the message
    this.setState({
      messages: messages,
    });
  }
  
  handleSend(message = {}) {
    
    // Your logic here
    // Send message.text to your server
    
    message.uniqueId = Math.round(Math.random() * 1000); // simulating server-side unique id generation
    this.setMessages(this._messages.concat(message));
    
    
    setTimeout(() => {
      this.setMessageStatus(message.uniqueId, 'ErrorButton');
    }, 500); // simulating network


    setTimeout(() => {
      this.setState({
        typingMessage: 'Bot is typing a message...',
      });
    }, 1000); // simulating network

    setTimeout(() => {
      this.setState({
        typingMessage: '',
      });
    }, 3000); // simulating network
    
    
    setTimeout(() => {
      this.handleReceive({
        text: 'I saw your message', 
        name: 'React-Native', 
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'}, 
        position: 'left', 
        date: new Date(),
        uniqueId: Math.round(Math.random() * 1000), // simulating server-side unique id generation
      });
    }, 3300); // simulating network
    
  }
  
  onLoadEarlierMessagesPress() {

    // Your logic here
    // Eg: Retrieve old messages from your server

    // IMPORTANT
    // Newest messages have to be at the begining of the array
    var earlierMessages = [
      {
        text: 'React Native enables you to build world-class application experiences on native platforms using a consistent developer experience based on JavaScript and React. https://github.com/facebook/react-native', 
        name: 'React-Native', 
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'}, 
        position: 'left', 
        date: new Date(2013, 0, 2, 12, 0),
        uniqueId: Math.round(Math.random() * 1000), // simulating server-side unique id generation
      }, {
        text: 'This is a touchable phone number 0606060606 parsed by taskrabbit/react-native-parsed-text', 
        name: 'Developer', 
        image: null, 
        position: 'right', 
        date: new Date(2014, 0, 1, 20, 0),
        uniqueId: Math.round(Math.random() * 1000), // simulating server-side unique id generation
      },
    ];

    this.setState({
      isLoadingEarlierMessages: true,
    });

    setTimeout(() => {
      this.setMessages(earlierMessages.concat(this._messages));
      this.setState({
        isLoadingEarlierMessages: false,
      });
    }, 1000); // simulating network
    
  }
  
  handleReceive(message = {}) {
    // make sure that your message contains :
    // text, name, image, position: 'left', date, uniqueId
    this.setMessages(this._messages.concat(message));
  }

  onErrorButtonPress(message = {}) {
    // Your logic here
    // re-send the failed message

    this.setMessageStatus(message.uniqueId, '');
  }
  
  // will be triggered when the Image of a row is touched
  onImagePress(message = {}) {
    // Your logic here
    // Eg: Navigate to the user profile
  }
  
  render() {
    return (
      <GiftedMessenger
        ref={(c) => this._GiftedMessenger = c}
    
        styles={{
          bubbleRight: {
            marginLeft: 70,
            backgroundColor: '#007aff',
          },
        }}
        
        autoFocus={false}
        messages={this.state.messages}
        handleSend={this.handleSend.bind(this)}
        onErrorButtonPress={this.onErrorButtonPress.bind(this)}
        maxHeight={Dimensions.get('window').height - Navigator.NavigationBar.Styles.General.NavBarHeight - STATUS_BAR_HEIGHT}

        loadEarlierMessagesButton={true}
        onLoadEarlierMessagesPress={this.onLoadEarlierMessagesPress.bind(this)}

        senderName='Developer'
        senderImage={null}
        onImagePress={this.onImagePress}
        displayNames={true}
        
        parseText={true} // enable handlePhonePress, handleUrlPress and handleEmailPress
        handlePhonePress={this.handlePhonePress}
        handleUrlPress={this.handleUrlPress}
        handleEmailPress={this.handleEmailPress}
        
        isLoadingEarlierMessages={this.state.isLoadingEarlierMessages}
        
        typingMessage={this.state.typingMessage}
      />
    );
  }
  
  handleUrlPress(url) {
    Linking.openURL(url);
  }

  handlePhonePress(phone) {
    if (Platform.OS !== 'android') {
      var BUTTONS = [
        'Text message',
        'Call',
        'Cancel',
      ];
      var CANCEL_INDEX = 2;
    
      ActionSheetIOS.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            Communications.phonecall(phone, true);
            break;
          case 1:
            Communications.text(phone);
            break;
        }
      });
    }
  }
  
  handleEmailPress(email) {
    Communications.email(email, null, null, null, null);
  }
  
}


module.exports = GiftedMessengerContainer;