import * as React from 'react'
import {
  Text,
  View,
} from 'react-native'
import dayjs from 'dayjs'

import { DATE_FORMAT } from '../Constant'
import { IMessage } from '../Models'
import { DayProps } from './types'

import { useChatContext } from '../GiftedChatContext'
import stylesCommon from '../styles'
import styles from './styles'

export * from './types'

export function Day<TMessage extends IMessage = IMessage> ({
  dateFormat = DATE_FORMAT,
  currentMessage,
  containerStyle,
  wrapperStyle,
  textStyle,
}: DayProps<TMessage>) {
  const { getLocale } = useChatContext()

  if (currentMessage == null)
    return null

  return (
    <View style={[stylesCommon.centerItems, styles.container, containerStyle]}>
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
