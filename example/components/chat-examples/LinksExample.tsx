import React, { useCallback, useState } from 'react'
import { Alert, Linking, StyleSheet, View } from 'react-native'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import { Match } from 'autolinker/dist/es2015'

const initialMessages: IMessage[] = [
  {
    _id: 7,
    text: 'You can mention people like @kesha-antonov or @john-doe',
    createdAt: new Date(Date.now() - 6 * 60000),
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 6,
    text: 'Use hashtags to categorize: #giftedchat #reactnative #opensource',
    createdAt: new Date(Date.now() - 5 * 60000),
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 5,
    text: 'Different link formats work:\n• www.google.com\n• google.com\n• https://google.com',
    createdAt: new Date(Date.now() - 4 * 60000),
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 4,
    text: 'Email addresses are clickable: cool.guy@example.com or contact@reactnative.dev',
    createdAt: new Date(Date.now() - 3 * 60000),
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 3,
    text: 'Phone numbers are also parsed: +79931234567 or +1-555-123-4567',
    createdAt: new Date(Date.now() - 2 * 60000),
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 2,
    text: 'This example shows how GiftedChat handles different types of links in messages. Try tapping on any link!',
    createdAt: new Date(Date.now() - 1 * 60000),
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
  {
    _id: 1,
    text: 'Welcome! 👋',
    createdAt: new Date(),
    user: {
      _id: 2,
      name: 'React Native',
    },
  },
]

export default function LinksExample () {
  const [messages, setMessages] = useState<IMessage[]>(initialMessages)

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages)
    )
  }, [])

  const handleHashtagPress = useCallback(
    (currentMessage: IMessage, hashtag: string, _match: Match) => {
      Alert.alert(
        'Hashtag Pressed',
        `You pressed on hashtag: ${hashtag}\n\nMessage: "${currentMessage.text}"`,
        [{ text: 'OK' }]
      )
    },
    []
  )

  const handleMentionPress = useCallback(
    (currentMessage: IMessage, mention: string, _match: Match) => {
      Alert.alert(
        'Mention Pressed',
        `You pressed on mention: ${mention}\n\nMessage: "${currentMessage.text}"`,
        [{ text: 'OK' }]
      )
    },
    []
  )

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: 1,
          name: 'Developer',
        }}
        matchers={[
          {
            pattern: /#(\w+)/,
            style: { color: '#0084ff', fontWeight: 'bold' },
            onPress: handleHashtagPress,
          },
          {
            pattern: /@([\w-]+)/,
            style: { color: '#0084ff', fontWeight: 'bold' },
            onPress: handleMentionPress,
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
