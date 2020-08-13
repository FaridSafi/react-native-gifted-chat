import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
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

import { StylePropType, isSameDay } from './utils'
import { DATE_FORMAT } from './Constant'
import { IMessage } from './Models'

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

export interface DayProps<TMessage extends IMessage> {
  currentMessage?: TMessage
  nextMessage?: TMessage
  previousMessage?: TMessage
  containerStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  textProps?: TextProps
  dateFormat?: string
  inverted?: boolean
}

export default class Day<
  TMessage extends IMessage = IMessage
> extends PureComponent<DayProps<TMessage>> {
  static contextTypes = {
    getLocale: PropTypes.func,
  }

  static defaultProps = {
    currentMessage: {
      createdAt: null,
    },
    previousMessage: {},
    nextMessage: {},
    containerStyle: {},
    wrapperStyle: {},
    textStyle: {},
    textProps: {},
    dateFormat: DATE_FORMAT,
  }

  static propTypes = {
    currentMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    inverted: PropTypes.bool,
    containerStyle: StylePropType,
    wrapperStyle: StylePropType,
    textStyle: StylePropType,
    textProps: PropTypes.object,
    dateFormat: PropTypes.string,
  }

  render() {
    const {
      dateFormat,
      currentMessage,
      previousMessage,
      containerStyle,
      wrapperStyle,
      textStyle,
      textProps,
    } = this.props

    if (currentMessage && !isSameDay(currentMessage, previousMessage!)) {
      return (
        <View style={[styles.container, containerStyle]}>
          <View style={wrapperStyle}>
            <Text style={[styles.text, textStyle]} {...textProps}>
              {dayjs(currentMessage.createdAt)
                .locale(this.context.getLocale())
                .format(dateFormat)}
            </Text>
          </View>
        </View>
      )
    }
    return null
  }
}
