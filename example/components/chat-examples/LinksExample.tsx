import React, { useCallback, useMemo, useState } from 'react'
import { Linking, Platform, StyleSheet, View } from 'react-native'
import { ActionSheetProvider, useActionSheet } from '@expo/react-native-action-sheet'
import { setStringAsync } from 'expo-clipboard'
import { AutolinkProps, CustomMatch, ReplacerArgs } from 'react-native-autolink'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const LinksExample: React.FC = () => {
  const { showActionSheetWithOptions } = useActionSheet()
  const insets = useSafeAreaInsets()

  const tabbarHeight = 50
  const keyboardTopToolbarHeight = Platform.select({ ios: 44, default: 0 })
  const keyboardVerticalOffset = insets.bottom + tabbarHeight + keyboardTopToolbarHeight

  const initialMessages: IMessage[] = useMemo(() => [
    {
      _id: 8,
      text: 'System message with link: Check out our documentation at https://github.com/FaridSafi/react-native-gifted-chat',
      createdAt: new Date(Date.now() - 7 * 60000),
      system: true,
    },
    {
      _id: 7,
      text: 'You can mention people like @kesha-antonov or @john-doe',
      createdAt: new Date(Date.now() - 6 * 60000),
      user: {
        _id: 2,
        name: 'John Doe',
      },
    },
    {
      _id: 6,
      text: 'Use hashtags to categorize: #giftedchat #reactnative #opensource',
      createdAt: new Date(Date.now() - 5 * 60000),
      user: {
        _id: 2,
        name: 'John Doe',
      },
    },
    {
      _id: 5,
      text: 'Different link formats work:\n• www.google.com\n• google.com\n• https://google.com',
      createdAt: new Date(Date.now() - 4 * 60000),
      user: {
        _id: 2,
        name: 'John Doe',
      },
    },
    {
      _id: 4,
      text: 'Email addresses are clickable: cool.guy@example.com or contact@reactnative.dev',
      createdAt: new Date(Date.now() - 3 * 60000),
      user: {
        _id: 2,
        name: 'John Doe',
      },
    },
    {
      _id: 3,
      text: 'Phone numbers are also parsed:\n\n• +79931234567\n\n• 89931234567\n\n• +1-555-123-4567',
      createdAt: new Date(Date.now() - 2 * 60000),
      user: {
        _id: 2,
        name: 'John Doe',
      },
    },
    {
      _id: 2,
      text: 'This example shows how GiftedChat handles different types of links in messages. Try tapping on any link!',
      createdAt: new Date(Date.now() - 1 * 60000),
      user: {
        _id: 2,
        name: 'John Doe',
      },
    },
    {
      _id: 1,
      text: 'Welcome! 👋',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'John Doe',
      },
    },
  ], [])

  const [messages, setMessages] = useState<IMessage[]>(initialMessages)

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

  const matchers = useMemo<AutolinkProps['matchers']>(() => [
    {
      type: 'phone',
      pattern: /\+?[1-9][0-9\-\(\) ]{7,}[0-9]/g,
      getLinkUrl: (replacerArgs: ReplacerArgs): string => {
        return replacerArgs[0].replace(/[\-\(\) ]/g, '')
      },
      getLinkText: (replacerArgs: ReplacerArgs): string => {
        return replacerArgs[0]
      },
      style: styles.linkStyle,
      onPress: (match: CustomMatch) => {
        const url = match.getAnchorHref()

        const options: {
          title: string
          action?: () => void
        }[] = [
          { title: 'Copy', action: () => setStringAsync(url) },
          { title: 'Call', action: () => Linking.openURL(`tel:${url}`) },
          { title: 'Send SMS', action: () => Linking.openURL(`sms:${url}`) },
          { title: 'Cancel' },
        ]

        showActionSheetWithOptions({
          options: options.map(o => o.title),
          cancelButtonIndex: options.length - 1,
        }, (buttonIndex?: number) => {
          if (buttonIndex === undefined)
            return

          const option = options[buttonIndex]
          option.action?.()
        })
      },
    },
  ], [showActionSheetWithOptions])

  return (
    <ActionSheetProvider>
      <View style={styles.container}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={user}
          messageTextProps={{
            phone: false,
            matchers,
          }}
          keyboardAvoidingViewProps={{ keyboardVerticalOffset }}
        />
      </View>
    </ActionSheetProvider>
  )
}

const ExampleContainer = () => (
  <ActionSheetProvider>
    <LinksExample />
  </ActionSheetProvider>
)

export default ExampleContainer

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linkStyle: {
    textDecorationLine: 'underline',
    fontStyle: 'italic',
  },
})
