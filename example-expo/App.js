import React, { Component } from 'react';
import { Asset, AppLoading } from 'expo';
import { View, StyleSheet, Linking } from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';
import Sentry from 'sentry-expo';

import messagesData from './data';
import NavBar from './NavBar';
import CustomView from './CustomView';

Sentry.config('https://2a164b1e89424a5aafc186da811308cb@sentry.io/276804').install();

const styles = StyleSheet.create({
  container: { flex: 1 },
});

const filterBotMessages = (message) => !message.system && message.user && message.user._id && message.user._id === 2;
const findStep = (step) => (_, index) => index === step - 1;

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      step: 0,
      appIsReady: false,
    };

    this.onSend = this.onSend.bind(this);
    this.parsePatterns = this.parsePatterns.bind(this);
  }

  async componentWillMount() {
    // init with only system messages
    await Asset.fromModule(require('./assets/avatar.png')).downloadAsync();
    this.setState({ messages: messagesData.filter((message) => message.system), appIsReady: true });
  }

  onSend(messages = []) {
    const step = this.state.step + 1;
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, [{ ...messages[0], sent: true, received: true }]),
      step,
    }));
    setTimeout(() => this.botSend(step), 1200 + Math.round(Math.random() * 1000));
  }

  botSend(step = 0) {
    const newMessage = messagesData
      .reverse()
      .filter(filterBotMessages)
      .find(findStep(step));
    if (newMessage) {
      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, newMessage),
      }));
    }
  }

  parsePatterns(linkStyle) {
    return [
      {
        pattern: /#(\w+)/,
        style: { ...linkStyle, color: 'darkorange' },
        onPress: () => Linking.openURL('http://gifted.chat'),
      },
    ];
  }
  render() {
    if (!this.state.appIsReady) {
      return <AppLoading />;
    }
    return (
      <View style={styles.container} accessible accessibilityLabel="main" testID="main">
        <NavBar />
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          renderCustomView={CustomView}
          keyboardShouldPersistTaps="never"
          user={{
            _id: 1,
          }}
          parsePatterns={this.parsePatterns}
        />
      </View>
    );
  }

}
