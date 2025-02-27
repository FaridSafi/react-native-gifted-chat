import React from 'react'
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native'
import dayjs from 'dayjs'

import Color from './Color'
import { TIME_FORMAT } from './Constant'
import { LeftRightStyle, IMessage } from './types'
import { useChatContext } from './GiftedChatContext'

const { containerStyle } = StyleSheet.create({
  containerStyle: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
  },
})

const { textStyle } = StyleSheet.create({
  textStyle: {
    fontSize: 10,
    textAlign: 'right',
  },
})

const styles = {
  left: StyleSheet.create({
    container: {
      ...containerStyle,
    },
    text: {
      color: Color.timeTextColor,
      ...textStyle,
    },
  }),
  right: StyleSheet.create({
    container: {
      ...containerStyle,
    },
    text: {
      color: Color.white,
      ...textStyle,
    },
  }),
}

export interface TimeProps<TMessage extends IMessage> {
  position?: 'left' | 'right'
  currentMessage: TMessage
  containerStyle?: LeftRightStyle<ViewStyle>
  timeTextStyle?: LeftRightStyle<TextStyle>
  timeFormat?: string
}

export function Time<TMessage extends IMessage = IMessage> ({
  position = 'left',
  containerStyle,
  currentMessage,
  timeFormat = TIME_FORMAT,
  timeTextStyle,
}: TimeProps<TMessage>) {
  const { getLocale } = useChatContext()

  if (currentMessage == null)
    return null

  return (
    <View
      style={[
        styles[position].container,
        containerStyle?.[position],
      ]}
    >
      <Text
        style={[
          styles[position].text,
          timeTextStyle?.[position],
        ]}
      >
        {dayjs(currentMessage.createdAt).locale(getLocale()).format(timeFormat)}
      </Text>
    </View>
  )
}
