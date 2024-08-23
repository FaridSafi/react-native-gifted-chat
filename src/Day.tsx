import * as React from 'react'
import {
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextProps,
} from 'react-native'
import dayjs from 'dayjs'

import Color from './Color'
import { isSameDay } from './utils'
import { DATE_FORMAT } from './Constant'
import { IMessage } from './Models'

import { useChatContext } from './GiftedChatContext'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  text: {
    backgroundColor: Color.backgroundTransparent,
    color: Color.defaultColor,
    fontSize: 12,
    fontWeight: '600',
  },
})

export interface DayProps<TMessage extends IMessage = IMessage> {
  currentMessage: TMessage
  nextMessage?: TMessage
  previousMessage?: TMessage
  containerStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  textProps?: TextProps
  dateFormat?: string
  inverted?: boolean
}

export function Day<TMessage extends IMessage = IMessage> ({
  dateFormat = DATE_FORMAT,
  currentMessage,
  previousMessage,
  containerStyle,
  wrapperStyle,
  textStyle,
}: DayProps<TMessage>) {
  const { getLocale } = useChatContext()

  if (currentMessage == null || isSameDay(currentMessage, previousMessage))
    return null

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={wrapperStyle}>
        <Text style={[styles.text, textStyle]}>
          {dayjs(currentMessage.createdAt)
            .locale(getLocale())
            .format(dateFormat)}
        </Text>
      </View>
    </View>
  )
}
