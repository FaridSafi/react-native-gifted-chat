import React, { useState, useEffect } from 'react'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import initialMessages from './messages'
import { renderInputToolbar, renderActions, renderComposer, renderSend } from './InputToolbar'
import {
  renderAvatar,
  renderBubble,
  renderSystemMessage,
  renderMessage,
  renderMessageText,
  renderCustomView,
} from './MessageContainer'
import { Match } from 'autolinker/dist/es2015'

const Chats = () => {
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    setMessages(initialMessages.reverse())
  }, [])

  const onSend = (newMessages = []) => {
    setMessages(prevMessages => GiftedChat.append(prevMessages, newMessages))
  }

  return (
    <GiftedChat
      messages={messages}
      text={text}
      onInputTextChanged={setText}
      onSend={onSend}
      user={{
        _id: 1,
        name: 'Aaron',
        avatar: 'https://placeimg.com/150/150/any',
      }}
      alignTop
      alwaysShowSend
      isScrollToBottomEnabled
      // showUserAvatar
      renderAvatarOnTop
      renderUsernameOnMessage
      onPressAvatar={console.log}
      renderInputToolbar={renderInputToolbar}
      renderActions={renderActions}
      renderComposer={renderComposer}
      renderSend={renderSend}
      renderAvatar={renderAvatar}
      renderBubble={renderBubble}
      renderSystemMessage={renderSystemMessage}
      renderMessage={renderMessage}
      renderMessageText={renderMessageText}
      // renderMessageImage
      renderCustomView={renderCustomView}
      isCustomViewBottom
      messagesContainerStyle={{ backgroundColor: 'indigo' }}
      matchers={[
        {
          pattern: /#(\w+)/,
          onPress: (_currentMessage: IMessage, tag: string, _match: Match) => console.log(`Pressed on hashtag: ${tag}`),
        },
      ]}
    />
  )
}

export default Chats
