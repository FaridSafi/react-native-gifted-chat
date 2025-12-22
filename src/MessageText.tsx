import React, { useMemo, useCallback } from 'react'
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native'

import { Text } from 'react-native-gesture-handler'
import { LinkParser, LinkMatcher, LinkType } from './linkParser'
import { LeftRightStyle, IMessage } from './Models'

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
    type: LinkType
  ) => void
  // Link parser options
  matchers?: LinkMatcher[]
  email?: boolean
  phone?: boolean
  url?: boolean
  hashtag?: boolean
  mention?: boolean
  hashtagUrl?: string
  mentionUrl?: string
  stripPrefix?: boolean
}

export function MessageText<TMessage extends IMessage>({
  currentMessage,
  position = 'left',
  containerStyle,
  textStyle,
  linkStyle: linkStyleProp,
  customTextStyle,
  onPress: onPressProp,
  matchers,
  email = true,
  phone = true,
  url = true,
  hashtag = false,
  mention = false,
  hashtagUrl,
  mentionUrl,
  stripPrefix = false,
}: MessageTextProps<TMessage>) {
  const linkStyle = useMemo(() => StyleSheet.flatten([
    styles.link,
    linkStyleProp?.[position],
  ]), [position, linkStyleProp])

  const style = useMemo(() => [
    styles[`text_${position}`],
    textStyle?.[position],
    customTextStyle,
  ], [position, textStyle, customTextStyle])

  const handlePress = useCallback((url: string, type: LinkType) => {
    onPressProp?.(currentMessage, url, type)
  }, [onPressProp, currentMessage])

  return (
    <View style={[styles.container, containerStyle?.[position]]}>
      <LinkParser
        text={currentMessage!.text}
        matchers={matchers}
        email={email}
        phone={phone}
        url={url}
        hashtag={hashtag}
        mention={mention}
        hashtagUrl={hashtagUrl}
        mentionUrl={mentionUrl}
        stripPrefix={stripPrefix}
        linkStyle={linkStyle}
        textStyle={style}
        onPress={onPressProp ? handlePress : undefined}
        TextComponent={Text}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    marginHorizontal: 10,
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
