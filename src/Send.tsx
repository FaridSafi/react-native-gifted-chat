import React, { useMemo, useCallback } from 'react'
import {
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  useColorScheme,
} from 'react-native'
import { Color } from './Color'

import { TouchableOpacity, TouchableOpacityProps } from './components/TouchableOpacity'
import { TEST_ID } from './Constant'
import { IMessage } from './Models'

export interface SendProps<TMessage extends IMessage> {
  text?: string
  label?: string
  containerStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  children?: React.ReactNode
  isSendButtonAlwaysVisible?: boolean
  sendButtonProps?: Partial<TouchableOpacityProps>
  onSend?(
    messages: Partial<TMessage> | Partial<TMessage>[],
    shouldResetInputToolbar: boolean,
  ): void
}

export const Send = <TMessage extends IMessage = IMessage>({
  text,
  containerStyle,
  children,
  textStyle,
  label = 'Send',
  isSendButtonAlwaysVisible = false,
  sendButtonProps,
  onSend,
}: SendProps<TMessage>) => {
  const colorScheme = useColorScheme()

  const handleOnPress = useCallback(() => {
    const message = { text: text?.trim() } as Partial<TMessage>

    if (onSend && message.text?.length)
      onSend(message, true)
  }, [text, onSend])

  const showSend = useMemo(
    () => isSendButtonAlwaysVisible || !!text?.trim().length,
    [isSendButtonAlwaysVisible, text]
  )

  if (!showSend)
    return null

  return (
    <TouchableOpacity
      testID={TEST_ID.SEND_TOUCHABLE}
      style={[styles.container, containerStyle]}
      onPress={handleOnPress}
      accessible
      accessibilityLabel='send'
      accessibilityRole='button'
      {...sendButtonProps}
    >
      <View>
        {children || <Text style={[styles.text, styles[`text_${colorScheme}`], textStyle]}>{label}</Text>}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    justifyContent: 'flex-end',
  },
  text: {
    color: Color.defaultBlue,
    fontWeight: '600',
    fontSize: 17,
    backgroundColor: Color.backgroundTransparent,
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10,
  },
  text_dark: {
    color: '#4da6ff',
  },
})
