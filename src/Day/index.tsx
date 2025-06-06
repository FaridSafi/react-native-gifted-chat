import React, { useMemo } from 'react'
import {
  Text,
  View,
} from 'react-native'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import calendar from 'dayjs/plugin/calendar'

import { DATE_FORMAT } from '../Constant'
import { DayProps } from './types'

import { useChatContext } from '../GiftedChatContext'
import stylesCommon from '../styles'
import styles from './styles'

export * from './types'

dayjs.extend(relativeTime)
dayjs.extend(calendar)

export function Day ({
  dateFormat = DATE_FORMAT,
  dateFormatCalendar,
  createdAt,
  containerStyle,
  wrapperStyle,
  textStyle,
  todayLocalized,
}: DayProps) {
  const { getLocale } = useChatContext()

  const dateStr = useMemo(() => {
    if (createdAt == null)
      return null

    const now = dayjs().startOf('day')
    const date = dayjs(createdAt).locale(getLocale()).startOf('day')

    if (!now.isSame(date, 'year'))
      return date.format('D MMMM YYYY')

    if (now.diff(date, 'days') < 1)
      return date.calendar(now, {
        sameDay: todayLocalized?.[getLocale()] ? `[${todayLocalized[getLocale()]}]` : '[Today]',
        ...dateFormatCalendar,
      })

    return date.format(dateFormat)
  }, [createdAt, getLocale, todayLocalized, dateFormatCalendar, dateFormat])

  if (!dateStr)
    return null

  return (
    <View style={[stylesCommon.centerItems, styles.container, containerStyle]}>
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.text, textStyle]}>{dateStr}</Text>
      </View>
    </View>
  )
}
