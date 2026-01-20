import React, { useMemo, useCallback } from 'react'
import {
  StyleSheet,
  ViewStyle,
  View,
  Pressable,
  Image,
  TextStyle,
  StyleProp,
  ImageStyle,
} from 'react-native'

import { Text } from 'react-native-gesture-handler'
import { Color } from './Color'
import { LeftRightStyle, IMessage, ReplyMessage } from './Models'
import { getStyleWithPosition } from './styles'

export interface MessageReplyProps<TMessage extends IMessage> {
  position?: 'left' | 'right'
  currentMessage: TMessage
  containerStyle?: LeftRightStyle<ViewStyle>
  contentContainerStyle?: LeftRightStyle<ViewStyle>
  imageStyle?: StyleProp<ImageStyle>
  usernameStyle?: StyleProp<TextStyle>
  textStyle?: StyleProp<TextStyle>
  onPress?: (replyMessage: ReplyMessage) => void
}

export function MessageReply<TMessage extends IMessage = IMessage> ({
  currentMessage,
  position = 'left',
  containerStyle,
  contentContainerStyle,
  imageStyle,
  usernameStyle,
  textStyle,
  onPress: onPressProp,
}: MessageReplyProps<TMessage>) {
  const handlePress = useCallback(() => {
    if (!onPressProp || !currentMessage.replyMessage)
      return

    onPressProp(currentMessage.replyMessage)
  }, [onPressProp, currentMessage.replyMessage])

  const containerStyleMemo = useMemo(() => [
    styles.container,
    getStyleWithPosition(styles, 'container', position),
    containerStyle?.[position],
  ], [position, containerStyle])

  const contentContainerStyleMemo = useMemo(() => [
    styles.contentContainer,
    contentContainerStyle?.[position],
  ], [position, contentContainerStyle])

  const imageStyleMemo = useMemo(() => [
    styles.image,
    imageStyle,
  ], [imageStyle])

  const usernameStyleMemo = useMemo(() => [
    styles.username,
    getStyleWithPosition(styles, 'username', position),
    usernameStyle,
  ], [position, usernameStyle])

  const textStyleMemo = useMemo(() => [
    styles.text,
    getStyleWithPosition(styles, 'text', position),
    textStyle,
  ], [position, textStyle])

  if (!currentMessage.replyMessage)
    return null

  const { replyMessage } = currentMessage

  return (
    <Pressable
      onPress={handlePress}
      style={containerStyleMemo}
    >
      <View style={contentContainerStyleMemo}>
        {replyMessage.image && (
          <Image
            source={{ uri: replyMessage.image }}
            style={imageStyleMemo}
          />
        )}
        <View style={styles.textContainer}>
          <Text
            style={usernameStyleMemo}
            numberOfLines={1}
          >
            {replyMessage.user?.name || 'User'}
          </Text>
          <Text
            numberOfLines={1}
            style={textStyleMemo}
          >
            {replyMessage.text || (replyMessage.image ? 'Photo' : (replyMessage.audio ? 'Audio' : 'Message'))}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginTop: 5,
    marginBottom: 2,
    padding: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Color.defaultBlue,
    minWidth: 150,
  },
  container_left: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  container_right: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 36,
    height: 36,
    borderRadius: 4,
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  username_left: {
    color: Color.defaultBlue,
  },
  username_right: {
    color: Color.white,
  },
  text: {
    fontSize: 13,
  },
  text_left: {
    color: Color.black,
  },
  text_right: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
})
