import React from 'react'
import {
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native'
import Color from './Color'
import { MessageText } from './MessageText'
import stylesCommon from './styles'
import { IMessage } from './types'

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
  if (currentMessage == null || currentMessage.system === false)
    return null

  return (
    <View style={[stylesCommon.fill, stylesCommon.centerItems, styles.container, containerStyle]}>
      <View style={wrapperStyle}>
        <MessageText
          currentMessage={currentMessage}
          customTextStyle={[styles.text, textStyle]}
          containerStyle={{ left: styles.messageContainer, right: styles.messageContainer }}
        />
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  messageContainer: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  text: {
    backgroundColor: Color.backgroundTransparent,
    fontStyle: 'italic',
    fontSize: 12,
    fontWeight: '300',
  },
})
