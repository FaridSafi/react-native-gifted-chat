import React, { useState, useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { RenderInputToolbar, RenderActions, RenderComposer, renderSend } from './InputToolbar'
import {
  renderAvatar,
  renderBubble,
  renderSystemMessage,
  renderMessage,
  renderMessageText,
  renderCustomView,
} from './MessageContainer'
import initialMessages from './messages'

const Chats = () => {
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<IMessage[]>([])
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const insets = useSafeAreaInsets()

  const tabbarHeight = 50
  const keyboardVerticalOffset = insets.bottom + tabbarHeight

  useEffect(() => {
    setMessages(initialMessages.reverse())
  }, [])

  const onSend = (newMessages: IMessage[] = []) => {
    setMessages(prevMessages => GiftedChat.append(prevMessages, newMessages))
  }

  return (
    <GiftedChat
      messages={messages}
      text={text}
      onSend={onSend}
      user={{
        _id: 1,
        name: 'Aaron',
        avatar: 'https://placeimg.com/150/150/any',
      }}
      isAlignedTop
      isSendButtonAlwaysVisible
      isScrollToBottomEnabled
      // isUserAvatarVisible
      isAvatarOnTop
      isUsernameVisible
      onPressAvatar={console.log}
      renderInputToolbar={RenderInputToolbar}
      renderActions={RenderActions}
      renderComposer={RenderComposer}
      renderSend={renderSend}
      renderAvatar={renderAvatar}
      renderBubble={renderBubble}
      renderSystemMessage={renderSystemMessage}
      renderMessage={renderMessage}
      renderMessageText={renderMessageText}
      // renderMessageImage
      renderCustomView={renderCustomView}
      isCustomViewBottom
      messagesContainerStyle={{ backgroundColor: isDark ? '#1a1a1a' : 'indigo' }}
      textInputProps={{
        style: isDark && { backgroundColor: '#2a2a2a', color: '#fff' },
        onChangeText: setText,
      }}
      keyboardAvoidingViewProps={{ keyboardVerticalOffset }}
    />
  )
}

export default Chats
