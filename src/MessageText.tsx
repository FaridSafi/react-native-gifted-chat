import React, { useMemo, useCallback } from 'react'
import {
  Linking,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native'

import Autolink, { AutolinkProps } from 'react-native-autolink'
import { Match } from 'autolinker/dist/es2015'
import { LeftRightStyle, IMessage } from './types'
import { error } from './logging'

export interface MessageOption {
  title: string
  action: (phone: string) => void
}

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
  const onUrlPress = useCallback((url: string) => {
    if (/^www\./i.test(url))
      url = `https://${url}`

    Linking.openURL(url).catch(e => {
      error(e, 'No handler for URL:', url)
    })
  }, [])

  const onPhonePress = useCallback((phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(e => {
      error(e, 'No handler for telephone')
    })
  }, [])

  const onEmailPress = useCallback((email: string) =>
    Linking.openURL(`mailto:${email}`).catch(e =>
      error(e, 'No handler for mailto')
    ), [])

  const linkStyle = useMemo(() => StyleSheet.flatten([
    styles.link,
    linkStyleProp?.[position],
  ]), [position, linkStyleProp])

  const handlePress = useCallback((url: string, match: Match) => {
    const type = match.getType()

    if (onPressProp)
      onPressProp(currentMessage, url, match)
    else if (type === 'url')
      onUrlPress(url)
    else if (type === 'phone')
      onPhonePress(url)
    else if (type === 'email')
      onEmailPress(url)
  }, [onUrlPress, onPhonePress, onEmailPress, onPressProp, currentMessage])

  const style = useMemo(() => [
    styles[`text_${position}`],
    textStyle?.[position],
    customTextStyle,
  ], [position, textStyle, customTextStyle])

  return (
    <View style={[styles.container, containerStyle?.[position]]}>
      <Autolink
        style={style}
        {...rest}
        text={currentMessage!.text}
        email
        link
        linkStyle={linkStyle}
        onPress={handlePress}
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
