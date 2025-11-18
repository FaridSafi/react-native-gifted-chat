import React, { useMemo } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native'
import Color from './Color'
import stylesCommon from './styles'
import { IMessage } from './types'

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
  children?: React.ReactNode
}

export function SystemMessage<TMessage extends IMessage = IMessage> ({
  currentMessage,
  containerStyle,
  wrapperStyle,
  textStyle,
  children,
}: SystemMessageProps<TMessage>) {
  const textContent = useMemo(() => {
    if (!currentMessage?.text)
      return null

    return <Text style={[styles.text, textStyle]}>{currentMessage.text}</Text>
  }, [currentMessage?.text, textStyle])

  if (currentMessage == null || currentMessage.system === false)
    return null

  return (
    <View style={[stylesCommon.fill, stylesCommon.centerItems, styles.container, containerStyle]}>
      <View style={wrapperStyle}>
        {textContent}
        {children}
      </View>
    </View>
  )
}
