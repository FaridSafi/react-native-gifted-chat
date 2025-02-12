import React, { useMemo, useCallback } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native'

import Color from './Color'
import { IMessage } from './types'
import { TEST_ID } from './Constant'

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
})

export interface SendProps<TMessage extends IMessage> {
  text?: string
  label?: string
  containerStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  children?: React.ReactNode
  alwaysShowSend?: boolean
  disabled?: boolean
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
  alwaysShowSend = false,
  disabled = false,
  sendButtonProps,
  onSend,
}: SendProps<TMessage>) => {
  const handleOnPress = useCallback(() => {
    if (text && onSend)
      onSend({ text: text.trim() } as Partial<TMessage>, true)
  }, [text, onSend])

  const showSend = useMemo(
    () => alwaysShowSend || (text && text.trim().length > 0),
    [alwaysShowSend, text]
  )

  if (!showSend)
    return null

  return (
    <TouchableOpacity
      testID={TEST_ID.SEND_TOUCHABLE}
      accessible
      accessibilityLabel='send'
      style={[styles.container, containerStyle]}
      onPress={handleOnPress}
      accessibilityRole='button'
      disabled={disabled}
      {...sendButtonProps}
    >
      <View>
        {children || <Text style={[styles.text, textStyle]}>{label}</Text>}
      </View>
    </TouchableOpacity>
  )
}
