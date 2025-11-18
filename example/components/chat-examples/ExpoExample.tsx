import React, { useCallback, useMemo, useState } from 'react'
import { StyleSheet, View, useColorScheme } from 'react-native'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AccessoryBar from '../../example-expo/AccessoryBar'
import CustomActions from '../../example-expo/CustomActions'
import CustomView from '../../example-expo/CustomView'
import earlierMessages from '../../example-expo/data/earlierMessages'
import messagesData from '../../example-expo/data/messages'

export default function ExpoExample () {
  const [messages, setMessages] = useState<IMessage[]>(messagesData)
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const colorScheme = useColorScheme()
  const insets = useSafeAreaInsets()

  const tabbarHeight = 50
  const keyboardBottomOffset = insets.bottom + tabbarHeight

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

  const onLoadEarlier = useCallback(() => {
    setIsLoadingEarlier(true)
    setTimeout(() => {
      setMessages(previousMessages =>
        GiftedChat.prepend(previousMessages, earlierMessages())
      )
      setIsLoadingEarlier(false)
    }, 1500)
  }, [])

  const renderAccessory = useCallback(
    () => <AccessoryBar onSend={onSend} isTyping={() => setIsTyping(!isTyping)} user={user} />,
    [onSend, isTyping, user]
  )

  const renderCustomView = useCallback((props: any) => <CustomView {...props} />, [])

  const renderActions = useCallback(
    (props: any) => <CustomActions {...props} onSend={onSend} user={user} />,
    [onSend, user]
  )

  const isDark = colorScheme === 'dark'

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        loadEarlier
        isLoadingEarlier={isLoadingEarlier}
        onLoadEarlier={onLoadEarlier}
        user={user}
        renderActions={renderActions}
        renderAccessory={renderAccessory}
        renderCustomView={renderCustomView}
        isTyping={isTyping}
        messagesContainerStyle={isDark && styles.messagesContainerDark}
        textInputProps={{
          style: isDark && styles.composerDark,
        }}
        keyboardBottomOffset={keyboardBottomOffset}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#000',
  },
  messagesContainerDark: {
    backgroundColor: '#000',
  },
  composerDark: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
  },
})
