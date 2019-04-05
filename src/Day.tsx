import PropTypes from 'prop-types'
import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  ViewPropTypes,
  ViewStyle,
  TextStyle,
} from 'react-native'
import moment from 'moment'

import Color from './Color'

import { isSameDay } from './utils'
import { DATE_FORMAT } from './Constant'
import { IMessage } from './types'

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

interface DayProps<TMessage extends IMessage = IMessage> {
  currentMessage?: TMessage
  nextMessage?: TMessage
  previousMessage?: TMessage
  containerStyle?: ViewStyle
  wrapperStyle?: ViewStyle
  textStyle?: TextStyle
  dateFormat?: string
  inverted?: boolean
}

export default function Day(
  {
    dateFormat,
    currentMessage,
    previousMessage,
    nextMessage,
    containerStyle,
    wrapperStyle,
    textStyle,
    inverted,
  }: DayProps,
  context: any,
) {
  if (
    currentMessage &&
    !isSameDay(currentMessage, inverted ? previousMessage! : nextMessage!)
  ) {
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={wrapperStyle}>
          <Text style={[styles.text, textStyle]}>
            {moment(currentMessage.createdAt)
              .locale(context.getLocale())
              .format(dateFormat)
              .toUpperCase()}
          </Text>
        </View>
      </View>
    )
  }
  return null
}

Day.contextTypes = {
  getLocale: PropTypes.func,
}

Day.defaultProps = {
  currentMessage: {
    // TODO: test if crash when createdAt === null
    createdAt: null,
  },
  previousMessage: {},
  nextMessage: {},
  containerStyle: {},
  wrapperStyle: {},
  textStyle: {},
  dateFormat: DATE_FORMAT,
}

Day.propTypes = {
  currentMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  inverted: PropTypes.bool,
  containerStyle: ViewPropTypes.style,
  wrapperStyle: ViewPropTypes.style,
  textStyle: PropTypes.any,
  dateFormat: PropTypes.string,
}
