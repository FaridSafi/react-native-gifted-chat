import * as React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native'
import dayjs from 'dayjs'

import Color from './Color'
import { TIME_FORMAT } from './Constant'
import { LeftRightStyle, IMessage } from './Models'
import { StylePropType } from './utils'
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
  currentMessage?: TMessage
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
        containerStyle && containerStyle[position],
      ]}
    >
      <Text
        style={[
          styles[position].text,
          timeTextStyle && timeTextStyle[position],
        ]}
      >
        {dayjs(currentMessage.createdAt).locale(getLocale()).format(timeFormat)}
      </Text>
    </View>
  )
}

Time.propTypes = {
  position: PropTypes.oneOf(['left', 'right']),
  currentMessage: PropTypes.object,
  containerStyle: PropTypes.shape({
    left: StylePropType,
    right: StylePropType,
  }),
  timeFormat: PropTypes.string,
  timeTextStyle: PropTypes.shape({
    left: StylePropType,
    right: StylePropType,
  }),
}
