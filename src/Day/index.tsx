import * as React from 'react'
import {
  Text,
  View,
} from 'react-native'
import dayjs from 'dayjs'

import { isSameDay } from '../utils'
import { DATE_FORMAT } from '../Constant'
import { IMessage } from '../Models'
import { DayProps } from './types'

import { useChatContext } from '../GiftedChatContext'
import styles from './styles'

export * from './types'

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
