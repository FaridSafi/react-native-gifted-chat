import React, { useCallback, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import messagesData from '../../example-expo/data/messages'
import SlackMessage from '../../example-slack-message/src/SlackMessage'

export default function SlackExample () {
  const [messages, setMessages] = useState<IMessage[]>(messagesData)

  const user = useMemo(() => ({
    _id: 1,
    name: 'Developer',
  }), [])

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    const messagesWithIds = newMessages.map(msg => ({
      ...msg,
      _id: msg._id || Math.random().toString(36).substring(7),
      user: msg.user || user,
    }))
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messagesWithIds)
    )
  }, [user])

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={user}
        renderMessage={props => <SlackMessage {...props} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
