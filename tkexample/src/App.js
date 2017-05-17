/**
 * Entry point to the tkexample app.
 * Created by tkfeng on 12/3/16.
 */
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {GiftedChat} from 'react-native-gifted-chat';

export default class TKExample extends React.Component {
  state = {
    messages: [
      {
        _id: 20,
        text: "I'm trying this gifted chat out.",
        createdAt: new Date(Date.UTC(2016, 8, 30, 17, 20, 0)),
        user: {
          _id: 1,
          name: 'TK Feng',
          avatar: 'https://facebook.github.io/react/img/logo_og.png',
        },
      },
      {
        _id: 10,
        text: 'Hello developer',
        createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://facebook.github.io/react/img/logo_og.png',
        },
      },
    ],
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>
          This is TK's Example.
        </Text>
        <GiftedChat
          messages={this.state.messages}
          renderTime={()=> {
          }}
          user={{
            _id: 1,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 20,
  }
});