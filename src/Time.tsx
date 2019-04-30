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

interface TimeProps<TMessage extends IMessage = IMessage> {
  position: 'left' | 'right'
  currentMessage?: TMessage
  containerStyle?: LeftRightStyle<ViewStyle>
  textStyle?: LeftRightStyle<TextStyle>
  timeFormat?: string
}

export default function Time(
  {
    position,
    containerStyle,
    currentMessage,
    timeFormat,
    textStyle,
  }: TimeProps,
  context: any,
) {
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
            .locale(context.getLocale())
            .format(timeFormat)}
        </Text>
      </View>
    )
  }
  return null
}

Time.contextTypes = {
  getLocale: PropTypes.func,
}

Time.defaultProps = {
  position: 'left',
  currentMessage: {
    createdAt: null,
  },
  containerStyle: {},
  textStyle: {},
  timeFormat: TIME_FORMAT,
  timeTextStyle: {},
}

Time.propTypes = {
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
