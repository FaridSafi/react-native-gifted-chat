import React, { useCallback, useMemo, useState } from 'react'
import { Platform, StyleSheet, View, useColorScheme } from 'react-native'
import { GiftedChat, IMessage, ReplyMessage } from 'react-native-gifted-chat'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import messagesData from '../../example-expo/data/messages'
import { getColorSchemeStyle } from '../../utils/styleUtils'

export interface IChatMessage extends IMessage {
  replyMessage?: ReplyMessage
}

export default function ReplyExample () {
  const [messages, setMessages] = useState<IChatMessage[]>(messagesData)
  const colorScheme = useColorScheme()
  const insets = useSafeAreaInsets()

  const tabbarHeight = 50
  const keyboardTopToolbarHeight = Platform.select({ ios: 44, default: 0 })
  const keyboardVerticalOffset = insets.bottom + tabbarHeight + keyboardTopToolbarHeight

  const user = useMemo(() => ({
    _id: 1,
    name: 'Developer',
  }), [])

  const onSend = useCallback((newMessages: IChatMessage[] = []) => {
    const messagesWithIds = newMessages.map(msg => ({
      ...msg,
      _id: msg._id || Math.random().toString(36).substring(7),
      user: msg.user || user,
    }))
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messagesWithIds)
    )
  }, [user])

  const handlePressReply = useCallback((reply: ReplyMessage) => {
    console.log('Pressed reply:', reply)
    // Could scroll to the original message here
  }, [])

  return (
    <View style={[styles.container, getColorSchemeStyle(styles, 'container', colorScheme)]}>
      <GiftedChat<IChatMessage>
        messages={messages}
        onSend={onSend}
        user={user}
        messagesContainerStyle={getColorSchemeStyle(styles, 'messagesContainer', colorScheme)}
        textInputProps={{
          style: getColorSchemeStyle(styles, 'composer', colorScheme),
        }}
        // New grouped reply props
        reply={{
          swipe: {
            isEnabled: true,
            direction: 'left', // swipe left to reply
          },
          onPress: handlePressReply,
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
