import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ViewPropTypes,
  StyleProp,
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

export interface DayProps<TMessage extends IMessage> {
  currentMessage?: TMessage
  nextMessage?: TMessage
  previousMessage?: TMessage
  containerStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
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

  static propTypes = {
    currentMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    inverted: PropTypes.bool,
    containerStyle: ViewPropTypes.style,
    wrapperStyle: ViewPropTypes.style,
    textStyle: PropTypes.any,
    dateFormat: PropTypes.string,
  }
  render() {
    const {
      dateFormat,
      currentMessage,
      previousMessage,
      nextMessage,
      containerStyle,
      wrapperStyle,
      textStyle,
      inverted,
    } = this.props

    if (
      currentMessage &&
      !isSameDay(currentMessage, inverted ? previousMessage! : nextMessage!)
    ) {
      return (
        <View style={[styles.container, containerStyle]}>
          <View style={wrapperStyle}>
            <Text style={[styles.text, textStyle]}>
              {moment(currentMessage.createdAt)
                .locale(this.context.getLocale())
                .format(dateFormat)
                .toUpperCase()}
            </Text>
          </View>
        </View>
      )
    }
    return null
  }
}
