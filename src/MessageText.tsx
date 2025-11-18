import React, { useMemo, useCallback } from 'react'
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native'

import { Match } from 'autolinker/dist/es2015'
import Autolink, { AutolinkProps } from 'react-native-autolink'
import { LeftRightStyle, IMessage } from './types'

export type MessageTextProps<TMessage extends IMessage> = {
  position?: 'left' | 'right'
  currentMessage: TMessage
  containerStyle?: LeftRightStyle<ViewStyle>
  textStyle?: LeftRightStyle<TextStyle>
  linkStyle?: LeftRightStyle<TextStyle>
  customTextStyle?: StyleProp<TextStyle>
  onPress?: (
    message: TMessage,
    url: string,
    match: Match
  ) => void
} & Omit<AutolinkProps, 'text' | 'onPress'>

export const MessageText: React.FC<MessageTextProps<IMessage>> = ({
  currentMessage = {} as IMessage,
  position = 'left',
  containerStyle,
  textStyle,
  linkStyle: linkStyleProp,
  customTextStyle,
  onPress: onPressProp,
  ...rest
}) => {
  const linkStyle = useMemo(() => StyleSheet.flatten([
    styles.link,
    linkStyleProp?.[position],
  ]), [position, linkStyleProp])

  const style = useMemo(() => [
    styles[`text_${position}`],
    textStyle?.[position],
    customTextStyle,
  ], [position, textStyle, customTextStyle])

  const handlePress = useCallback((url: string, match: Match) => {
    onPressProp?.(currentMessage, url, match)
  }, [onPressProp, currentMessage])

  return (
    <View style={[styles.container, containerStyle?.[position]]}>
      <Autolink
        email
        phone
        link={false}
        {...rest}
        onPress={onPressProp ? handlePress : undefined}
        linkStyle={linkStyle}
        style={style}
        text={currentMessage!.text}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
  },
  text_left: {
    color: 'black',
  },
  text_right: {
    color: 'white',
  },
  link: {
    textDecorationLine: 'underline',
  },
})
