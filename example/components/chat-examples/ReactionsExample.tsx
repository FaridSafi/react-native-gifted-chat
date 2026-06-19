import React, { useCallback, useMemo, useState } from 'react'
import { StyleSheet, View, useColorScheme } from 'react-native'
import { GiftedChat, IMessage, MessageReaction, ReactionPickerProps } from 'react-native-gifted-chat'

import messagesData from '../../example-expo/data/messages'
import { useKeyboardVerticalOffset } from '../../hooks/useKeyboardVerticalOffset'
import { getColorSchemeStyle } from '../../utils/styleUtils'
import { EmojiReactionPicker } from './reactions/EmojiReactionPicker'

export interface IChatMessage extends IMessage {
  reactions?: MessageReaction[]
}

const CURRENT_USER_ID = 1

export default function ReactionsExample () {
  const [messages, setMessages] = useState<IChatMessage[]>(messagesData)
  const colorScheme = useColorScheme()
  const keyboardVerticalOffset = useKeyboardVerticalOffset()
  const isDark = colorScheme === 'dark'

  const user = useMemo(() => ({
    _id: CURRENT_USER_ID,
    name: 'Developer',
  }), [])

  const onSend = useCallback((newMessages: IChatMessage[] = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages)
    )
  }, [])

  // Toggle the current user's reaction for the given emoji on a message.
  const handleReactionPress = useCallback((message: IChatMessage, emoji: string) => {
    setMessages(previousMessages =>
      previousMessages.map(m => {
        if (m._id !== message._id)
          return m

        const existing = (m.reactions ?? []).find(r => r.emoji === emoji)
        if (existing) {
          const newUserIds = existing.userIds.includes(CURRENT_USER_ID)
            ? existing.userIds.filter(id => id !== CURRENT_USER_ID)
            : [...existing.userIds, CURRENT_USER_ID]

          return {
            ...m,
            reactions: newUserIds.length === 0
              ? (m.reactions ?? []).filter(r => r.emoji !== emoji)
              : (m.reactions ?? []).map(r =>
                r.emoji === emoji ? { ...r, userIds: newUserIds } : r
              ),
          }
        }

        return {
          ...m,
          reactions: [...(m.reactions ?? []), { emoji, userIds: [CURRENT_USER_ID] }],
        }
      })
    )
  }, [])

  // Provide a richer picker (quick bar + full emoji browser) via the override.
  const renderReactionPicker = useCallback(
    (pickerProps: ReactionPickerProps<IChatMessage>) => (
      <EmojiReactionPicker
        {...pickerProps}
        isFullPickerEnabled
        mode={isDark ? 'dark' : 'light'}
        fullPickerLang='en'
        fullPickerColumnCount={6}
        fullPickerTheme={{
          light: {
            searchbar: {
              container: { backgroundColor: '#f3f4f6' },
              textInput: { backgroundColor: '#ffffff', color: '#111827', fontSize: 15 },
            },
            toolbar: { container: { backgroundColor: '#ffffff' } },
          },
          dark: {
            searchbar: {
              container: { backgroundColor: '#1f2937' },
              textInput: { backgroundColor: '#374151', color: '#f9fafb', fontSize: 15 },
            },
            toolbar: { container: { backgroundColor: '#111827' } },
          },
        }}
      />
    ),
    [isDark]
  )

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
        keyboardAvoidingViewProps={{ keyboardVerticalOffset }}
        reactions={{
          isEnabled: true,
          onReactionPress: handleReactionPress,
          renderReactionPicker,
        }}
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
