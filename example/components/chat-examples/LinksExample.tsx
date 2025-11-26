import React, { useCallback, useMemo, useState } from 'react'
import { Linking, Platform, StyleSheet, Text, View } from 'react-native'
import { ActionSheetProvider, useActionSheet } from '@expo/react-native-action-sheet'
import { setStringAsync } from 'expo-clipboard'
import { isValidPhoneNumber, parsePhoneNumberWithError } from 'libphonenumber-js'
import { GiftedChat, IMessage, LinkMatcher } from 'react-native-gifted-chat'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const LinksExample: React.FC = () => {
  const { showActionSheetWithOptions } = useActionSheet()
  const insets = useSafeAreaInsets()

  const tabbarHeight = 50
  const keyboardTopToolbarHeight = Platform.select({ ios: 44, default: 0 })
  const keyboardVerticalOffset = insets.bottom + tabbarHeight + keyboardTopToolbarHeight

  const initialMessages: IMessage[] = useMemo(() => [
    {
      text: 'Welcome! 👋',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'John Doe',
      },
    },
    {
      text: 'This example shows how GiftedChat handles different types of links in messages. Try tapping on any link!',
      createdAt: new Date(Date.now() - 1 * 60000),
      user: {
        _id: 2,
        name: 'John Doe',
      },
    },
    {
      text: 'Phone numbers are also parsed:\n\n• +79931234567\n\n• 89931234567\n\n• +1-215-456-7890.\n\nIt shouldn\'t parse phone numbers in file names like IMG_20220101_123456.jpg, 89201234567_today.pdf, or in addresses like 1234 React St., JS City, 56789.',
      createdAt: new Date(Date.now() - 2 * 60000),
      user: {
        _id: 2,
        name: 'John Doe',
      },
    },
    {
      text: 'Email addresses are clickable: cool.guy@example.com or contact@reactnative.dev',
      createdAt: new Date(Date.now() - 3 * 60000),
      user: {
        _id: 2,
        name: 'John Doe',
      },
    },
    {
      text: 'Different link formats work:\n• www.google.com\n• google.com\n• https://google.com',
      createdAt: new Date(Date.now() - 4 * 60000),
      user: {
        _id: 2,
        name: 'John Doe',
      },
    },
    {
      text: 'Use hashtags to categorize: #giftedchat #reactnative #opensource',
      createdAt: new Date(Date.now() - 5 * 60000),
      user: {
        _id: 2,
        name: 'John Doe',
      },
    },
    {
      text: 'You can mention people like @kesha-antonov or @john-doe',
      createdAt: new Date(Date.now() - 6 * 60000),
      user: {
        _id: 2,
        name: 'John Doe',
      },
    },
    {
      text: 'System message with link: Check out our documentation at https://github.com/FaridSafi/react-native-gifted-chat',
      createdAt: new Date(Date.now() - 7 * 60000),
      user: {
        _id: 2,
        name: 'John Doe',
      },
      system: true,
    },
    {
      text: 'System message with data and phone numbers: Contact support at +79931234567 or +1-215-456-7890. We have holidays on 2025-12-25 and until 2026-01-01 12:00.',
      createdAt: new Date(Date.now() - 7 * 60000),
      user: {
        _id: 2,
        name: 'John Doe',
      },
      system: true,
    },
  ].map((message, index) => ({
    ...message,
    _id: index + 1,
  })).reverse(), [])

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

  const getValidPhoneNumber = useCallback((text: string): string | undefined => {
    const cleaned = text.replace(/[\-\(\)\s\.]/g, '')

    // Validate with libphonenumber-js
    try {
      // Try direct validation first
      if (isValidPhoneNumber(cleaned))
        return cleaned

      // Try with RU region for local numbers
      if (isValidPhoneNumber(cleaned, 'RU'))
        return cleaned

      // Try parsing to check validity
      const phoneNumber = parsePhoneNumberWithError(cleaned, 'RU')
      if (phoneNumber && phoneNumber.isValid())
        return cleaned

    } catch (error) {
      console.warn('Invalid phone number:', error)
    }

    return undefined
  }, [])

  const handlePressPhoneNumber = useCallback((url: string) => {
    if (!url)
      return // Skip if validation failed

    const options: {
      title: string
      action?: () => void
    }[] = [
      { title: 'Call', action: () => Linking.openURL(`tel:${url}`) },
      { title: 'Send SMS', action: () => Linking.openURL(`sms:${url}`) },
      { title: 'Copy Phone Number', action: () => setStringAsync(url) },
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
  }, [showActionSheetWithOptions])

  const matchers = useMemo<LinkMatcher[]>(() => [
    {
      type: 'phone',
      // Pattern that excludes numbers adjacent to underscores or part of filenames
      pattern: /(?<![A-Za-z0-9_])(?:\+?\d{1,3}[\s.-]?)?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}(?![A-Za-z0-9_]|\.[a-z]{2,4})/gi,
      getLinkUrl: (matchedText: string): string => {
        return getValidPhoneNumber(matchedText) || ''
      },
      getLinkText: (text: string): string => {
        return text
      },
      renderLink: (text: string, url: string, index: number) => {
        const validPhoneNumber = getValidPhoneNumber(text)
        const isDisabled = !validPhoneNumber || !url

        return (
          <Text
            key={index}
            style={[styles.link, isDisabled && styles.linkDisabled]}
            onPress={() => !isDisabled && handlePressPhoneNumber(url)}
          >
            {text}
          </Text>
        )
      },
    },
  ], [getValidPhoneNumber, handlePressPhoneNumber])

  return (
    <ActionSheetProvider>
      <View style={styles.container}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={user}
          messageTextProps={{
            phone: false,
            url: true,
            matchers,
            mention: true,
            hashtag: true,
            mentionUrl: 'https://x.com',
            hashtagUrl: 'https://x.com/hashtag',
          }}
          keyboardAvoidingViewProps={{ keyboardVerticalOffset }}
          colorScheme='light'
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
  link: {
    textDecorationLine: 'underline',
  },
  linkDisabled: {
    textDecorationLine: 'none',
  },
})
