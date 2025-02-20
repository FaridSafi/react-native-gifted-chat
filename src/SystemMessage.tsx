import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native'
import Color from './Color'
import { IMessage } from './types'
import stylesCommon from './styles'

const styles = StyleSheet.create({
  container: {
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
    <View style={[stylesCommon.fill, stylesCommon.centerItems, styles.container, containerStyle]}>
      <View style={wrapperStyle}>
        <Text style={[styles.text, textStyle]}>{currentMessage.text}</Text>
      </View>
    </View>
  )
}
