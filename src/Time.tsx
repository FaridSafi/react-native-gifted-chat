import PropTypes from 'prop-types'
import React, { Component } from 'react'
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
import { TIME_FORMAT } from './Constant'
import { LeftRightStyle, IMessage } from './types'

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
  textStyle?: LeftRightStyle<TextStyle>
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
    textStyle: {},
    timeFormat: TIME_FORMAT,
    timeTextStyle: {},
  }

  static propTypes = {
    position: PropTypes.oneOf(['left', 'right']),
    currentMessage: PropTypes.object,
    containerStyle: PropTypes.shape({
      left: ViewPropTypes.style,
      right: ViewPropTypes.style,
    }),
    textStyle: PropTypes.shape({
      left: PropTypes.any,
      right: PropTypes.any,
    }),
    timeFormat: PropTypes.string,
    timeTextStyle: PropTypes.shape({
      left: PropTypes.any,
      right: PropTypes.any,
    }),
  }

  render() {
    const {
      position,
      containerStyle,
      currentMessage,
      timeFormat,
      textStyle,
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
                textStyle && textStyle[position],
              ] as TextStyle
            }
          >
            {moment(currentMessage.createdAt)
              .locale(this.context.getLocale())
              .format(timeFormat)}
          </Text>
        </View>
      )
    }
    return null
  }
}
