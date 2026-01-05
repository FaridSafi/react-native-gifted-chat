import React, { useMemo } from 'react'
import { StyleSheet, View, StyleProp, ViewStyle, TextStyle, Pressable } from 'react-native'

import { Text } from 'react-native-gesture-handler'
import { Color } from './Color'
import { useColorScheme } from './hooks/useColorScheme'
import { ReplyMessage } from './Models'

export interface ReplyPreviewProps {
  replyMessage: ReplyMessage
  onClearReply: () => void
  containerStyle?: StyleProp<ViewStyle>
  usernameStyle?: StyleProp<TextStyle>
  textStyle?: StyleProp<TextStyle>
  clearButtonStyle?: StyleProp<ViewStyle>
  clearButtonTextStyle?: StyleProp<TextStyle>
}

export function ReplyPreview ({
  replyMessage,
  onClearReply,
  containerStyle,
  usernameStyle,
  textStyle,
  clearButtonStyle,
  clearButtonTextStyle,
}: ReplyPreviewProps) {
  const colorScheme = useColorScheme()

  const containerStyles = useMemo(() => [
    styles.container,
    colorScheme === 'dark' && styles.container_dark,
    containerStyle,
  ], [colorScheme, containerStyle])

  const usernameStyles = useMemo(() => [
    styles.username,
    colorScheme === 'dark' && styles.username_dark,
    usernameStyle,
  ], [colorScheme, usernameStyle])

  const textStyles = useMemo(() => [
    styles.text,
    colorScheme === 'dark' && styles.text_dark,
    textStyle,
  ], [colorScheme, textStyle])

  return (
    <View style={containerStyles}>
      <View style={styles.border} />
      <View style={styles.content}>
        <Text
          style={usernameStyles}
          numberOfLines={1}
        >
          {replyMessage.user?.name || 'User'}
        </Text>
        <Text
          style={textStyles}
          numberOfLines={1}
        >
          {replyMessage.text || (replyMessage.image ? 'Photo' : (replyMessage.audio ? 'Audio' : 'Message'))}
        </Text>
      </View>
      <Pressable
        onPress={onClearReply}
        style={[styles.clearButton, clearButtonStyle]}
        hitSlop={8}
      >
        <Text style={[styles.clearButtonText, clearButtonTextStyle]}>
          {'✕'}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Color.defaultColor,
  },
  container_dark: {
    backgroundColor: '#2a2a2a',
    borderBottomColor: '#444',
  },
  border: {
    width: 3,
    height: '100%',
    backgroundColor: Color.defaultBlue,
    borderRadius: 1.5,
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  username: {
    fontSize: 13,
    fontWeight: '600',
    color: Color.defaultBlue,
    marginBottom: 2,
  },
  username_dark: {
    color: '#6eb5ff',
  },
  text: {
    fontSize: 13,
    color: '#666',
  },
  text_dark: {
    color: '#999',
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Color.defaultColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
})

