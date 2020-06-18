import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native'
import PropTypes from 'prop-types'
import Color from './Color'
import { IMessage } from './Models'
import { StylePropType } from './utils'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 5,
    marginBottom: 10,
  },
  text: {
    backgroundColor: Color.backgroundTransparent,
    color: Color.defaultColor,
    fontSize: 12,
    fontWeight: '300',
  },
})

export interface SystemMessageProps<TMessage extends IMessage> {
  currentMessage?: TMessage
  containerStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

export default function SystemMessage<TMessage extends IMessage = IMessage>(props: SystemMessageProps<TMessage>) {
  const { currentMessage, containerStyle, wrapperStyle, textStyle } = props

  if (currentMessage) {
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={wrapperStyle}>
          <Text style={[styles.text, textStyle]}>{currentMessage.text}</Text>
        </View>
      </View>
    )
  }

  return null
}

SystemMessage.defaultProps = {
  currentMessage: {
    system: false,
  },
  containerStyle: {},
  wrapperStyle: {},
  textStyle: {},
}

SystemMessage.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: StylePropType,
  wrapperStyle: StylePropType,
  textStyle: StylePropType,
}
