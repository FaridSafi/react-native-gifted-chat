import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native'
import dayjs from 'dayjs'

import Color from './Color'
import { TIME_FORMAT } from './Constant'
import { LeftRightStyle, IMessage } from './Models'
import { StylePropType } from './utils'

const containerStyle = {
  marginLeft: 10,
  marginRight: 10,
  marginBottom: 5,
}

const textStyle = {
  fontSize: 10,
  backgroundColor: 'transparent',
  textAlign: 'right',
}

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
  position: 'left' | 'right'
  currentMessage?: TMessage
  containerStyle?: LeftRightStyle<ViewStyle>
  timeTextStyle?: LeftRightStyle<TextStyle>
  timeFormat?: string
}

export default class Time<
  TMessage extends IMessage = IMessage
> extends Component<TimeProps<TMessage>> {
  static contextTypes = {
    getLocale: PropTypes.func,
  }

  static defaultProps = {
    position: 'left',
    currentMessage: {
      createdAt: null,
    },
    containerStyle: {},
    timeFormat: TIME_FORMAT,
    timeTextStyle: {},
  }

  static propTypes = {
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

  render() {
    const {
      position,
      containerStyle,
      currentMessage,
      timeFormat,
      timeTextStyle,
    } = this.props

    if (!!currentMessage) {
      return (
        <View
          style={[
            styles[position].container,
            containerStyle && containerStyle[position],
          ]}
        >
          <Text
            style={
              [
                styles[position].text,
                timeTextStyle && timeTextStyle[position],
              ] as TextStyle
            }
          >
            {dayjs(currentMessage.createdAt)
              .locale(this.context.getLocale())
              .format(timeFormat)}
          </Text>
        </View>
      )
    }
    return null
  }
}
