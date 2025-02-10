import * as React from 'react'
import {
  Text,
  View,
} from 'react-native'
import dayjs from 'dayjs'

import { DATE_FORMAT } from '../Constant'
import { DayProps } from './types'

import { useChatContext } from '../GiftedChatContext'
import stylesCommon from '../styles'
import styles from './styles'

export * from './types'

export function Day ({
  dateFormat = DATE_FORMAT,
  createdAt,
  containerStyle,
  wrapperStyle,
  textStyle,
}: DayProps) {
  const { getLocale } = useChatContext()

  if (createdAt == null)
    return null

  return (
    <View style={[stylesCommon.centerItems, styles.container, containerStyle]}>
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.text, textStyle]}>
          {dayjs(createdAt)
            .locale(getLocale())
            .format(dateFormat)}
        </Text>
      </View>
    </View>
  )
}
