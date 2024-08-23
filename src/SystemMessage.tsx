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
  currentMessage: TMessage
  containerStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

export function SystemMessage<TMessage extends IMessage = IMessage> ({
  currentMessage,
  containerStyle,
  wrapperStyle,
  textStyle,
}: SystemMessageProps<TMessage>) {
  if (currentMessage == null || currentMessage.system === false)
    return null

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={wrapperStyle}>
        <Text style={[styles.text, textStyle]}>{currentMessage.text}</Text>
      </View>
    </View>
  )
}

SystemMessage.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: StylePropType,
  wrapperStyle: StylePropType,
  textStyle: StylePropType,
}
