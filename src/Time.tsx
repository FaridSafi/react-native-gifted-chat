import React, { useMemo } from 'react'
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native'
import dayjs from 'dayjs'

import { Text } from 'react-native-gesture-handler'
import { Color } from './Color'
import { TIME_FORMAT } from './Constant'
import { useChatContext } from './GiftedChatContext'
import { LeftRightStyle, IMessage } from './Models'
import { getStyleWithPosition } from './styles'

const styles = StyleSheet.create({
  text: {
    fontSize: 10,
    textAlign: 'right',
  },
  text_left: {
    color: Color.timeTextColor,
  },
  text_right: {
    color: Color.white,
  },
})

export interface TimeProps<TMessage extends IMessage> {
  position?: 'left' | 'right'
  currentMessage: TMessage
  containerStyle?: LeftRightStyle<ViewStyle>
  timeTextStyle?: LeftRightStyle<TextStyle>
  timeFormat?: string
}

export const Time = <TMessage extends IMessage = IMessage>({
  position = 'left',
  containerStyle,
  currentMessage,
  timeFormat = TIME_FORMAT,
  timeTextStyle,
}: TimeProps<TMessage>) => {
  const { getLocale } = useChatContext()

  const formattedTime = useMemo(() => {
    if (!currentMessage)
      return null

    return dayjs(currentMessage.createdAt).locale(getLocale()).format(timeFormat)
  }, [currentMessage, getLocale, timeFormat])

  if (!currentMessage)
    return null

  return (
    <View style={containerStyle?.[position]}>
      <Text
        style={[
          getStyleWithPosition(styles, 'text', position),
          timeTextStyle?.[position],
        ]}
      >
        {formattedTime}
      </Text>
    </View>
  )
}
