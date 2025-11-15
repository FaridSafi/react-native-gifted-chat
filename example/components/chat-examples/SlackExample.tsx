import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import messagesData from '../../example-expo/data/messages'
import SlackMessage from '../../example-slack-message/src/SlackMessage'

export default function SlackExample() {
  const [messages, setMessages] = useState<IMessage[]>(messagesData)

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    )
  }, [])

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: 1,
          name: 'Developer',
        }}
        renderMessage={(props) => <SlackMessage {...props} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
