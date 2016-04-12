'use strict';

var React = require('react-native');
var {
  LinkingIOS,
  Platform,
  ActionSheetIOS,
  Dimensions,
  View,
  Text,
  Navigator,
} = React;

var GiftedMessenger = require('react-native-gifted-messenger');
var Communications = require('react-native-communications');


var STATUS_BAR_HEIGHT = Navigator.NavigationBar.Styles.General.StatusBarHeight;
if (Platform.OS === 'android') {
  var ExtraDimensions = require('react-native-extra-dimensions-android');
  var STATUS_BAR_HEIGHT = ExtraDimensions.get('STATUS_BAR_HEIGHT');
}


var GiftedMessengerExample = React.createClass({
  
  getMessages() {
    return [
      {text: 'Are you building a chat app?', name: 'React-Native', image: {uri: 'https://facebook.github.io/react/img/logo_og.png'}, position: 'left', date: new Date(2015, 10, 16, 19, 0)},
      {
        text: "Yes, and I use Gifted Messenger!", 
        name: 'Developer', 
        image: null, 
        position: 'right', 
        date: new Date(2015, 10, 17, 19, 0)
        // If needed, you can add others data (eg: userId, messageId)
      },
    ];
  },
  
  handleSend(message = {}, rowID = null) {
    // Your logic here
    // Send message.text to your server
    
    // this._GiftedMessenger.setMessageStatus('Sent', rowID);
    // this._GiftedMessenger.setMessageStatus('Seen', rowID);
    // this._GiftedMessenger.setMessageStatus('Custom label status', rowID);
    if (this.isMounted()) {
      this._GiftedMessenger.setMessageStatus('ErrorButton', rowID); // => In this case, you need also to set onErrorButtonPress
    }
  },
  
  // @oldestMessage is the oldest message already added to the list
  onLoadEarlierMessages(oldestMessage = {}, callback = () => {}) {    

    // Your logic here
    // Eg: Retrieve old messages from your server

    // newest messages have to be at the begining of the array
    var earlierMessages = [
      {
        text: 'This is a touchable phone number 0606060606 parsed by taskrabbit/react-native-parsed-text', 
        name: 'Developer', 
        image: null, 
        position: 'right', 
        date: new Date(2014, 0, 1, 20, 0),
      }, {
        text: 'React Native enables you to build world-class application experiences on native platforms using a consistent developer experience based on JavaScript and React. https://github.com/facebook/react-native', 
        name: 'React-Native', 
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'}, 
        position: 'left', 
        date: new Date(2013, 0, 1, 12, 0),
      },
    ];
    
    setTimeout(() => {
      callback(earlierMessages, false); // when second parameter is true, the "Load earlier messages" button will be hidden      
    }, 1000);
  },
  
  handleReceive(message = {}) {
    if (this.isMounted()) {
      this._GiftedMessenger.appendMessage(message);
    }
  },
  
  onErrorButtonPress(message = {}, rowID = null) {
    // Your logic here
    // Eg: Re-send the message to your server
    
    setTimeout(() => {
      // will set the message to a custom status 'Sent' (you can replace 'Sent' by what you want - it will be displayed under the row)
      if (this.isMounted()) {
        this._GiftedMessenger.setMessageStatus('Sent', rowID);
      }
      setTimeout(() => {
        // will set the message to a custom status 'Seen' (you can replace 'Seen' by what you want - it will be displayed under the row)
        if (this.isMounted()) {        
          this._GiftedMessenger.setMessageStatus('Seen', rowID);
        }
        setTimeout(() => {
          // append an answer
          this.handleReceive({text: 'I saw your message', name: 'React-Native', image: {uri: 'https://facebook.github.io/react/img/logo_og.png'}, position: 'left', date: new Date()});
        }, 500);
      }, 1000);
    }, 500);
  },
  
  // will be triggered when the Image of a row is touched
  onImagePress(rowData = {}, rowID = null) {
    // Your logic here
    // Eg: Navigate to the user profile
  },
  
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
        messages={this.getMessages()}
        handleSend={this.handleSend.bind(this)}
        onErrorButtonPress={this.onErrorButtonPress.bind(this)}
        maxHeight={Dimensions.get('window').height - Navigator.NavigationBar.Styles.General.NavBarHeight - STATUS_BAR_HEIGHT}
        loadEarlierMessagesButton={true}
        onLoadEarlierMessages={this.onLoadEarlierMessages.bind(this)}

        senderName='Developer'
        senderImage={null}
        onImagePress={this.onImagePress.bind(this)}
        displayNames={true}
        
        parseText={true} // enable handlePhonePress and handleUrlPress
        handlePhonePress={this.handlePhonePress.bind(this)}
        handleUrlPress={this.handleUrlPress.bind(this)}
        handleEmailPress={this.handleEmailPress.bind(this)}
        
        inverted={true}
      />

    );
  },
  
  handleUrlPress(url) {
    if (Platform.OS !== 'android') {
      LinkingIOS.openURL(url);
    }
  },

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
  },
  
  handleEmailPress(email) {
    Communications.email(email, null, null, null, null);
  },
});


module.exports = GiftedMessengerExample;