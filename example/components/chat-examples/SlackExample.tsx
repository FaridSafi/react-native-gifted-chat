import React, { useCallback, useMemo, useState } from 'react'
import { StyleSheet, View, useColorScheme } from 'react-native'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import messagesData from '../../example-expo/data/messages'
import SlackMessage from '../../example-slack-message/src/SlackMessage'
import { getColorSchemeStyle } from '../../utils/styleUtils'

export default function SlackExample () {
  const [messages, setMessages] = useState<IMessage[]>(messagesData)
  const colorScheme = useColorScheme()
  const insets = useSafeAreaInsets()

  const tabbarHeight = 50
  const keyboardVerticalOffset = insets.bottom + tabbarHeight

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
    <View style={[styles.container, getColorSchemeStyle(styles, 'container', colorScheme)]}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={user}
        renderMessage={props => <SlackMessage {...props} />}
        messagesContainerStyle={getColorSchemeStyle(styles, 'messagesContainer', colorScheme)}
        textInputProps={{
          style: getColorSchemeStyle(styles, 'composer', colorScheme),
        }}
        keyboardAvoidingViewProps={{ keyboardVerticalOffset }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container_dark: {
    backgroundColor: '#000',
  },
  messagesContainer_dark: {
    backgroundColor: '#000',
  },
  composer_dark: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
  },
})
