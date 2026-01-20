import React, { useMemo } from 'react'
import {
  Image,
  ImageStyle,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

import { IMessage, ReplyMessage } from '../Models'
import { isSameUser } from '../utils'

export interface MessageReplyProps<TMessage extends IMessage = IMessage> {
  /** The reply message to display */
  replyMessage: ReplyMessage
  /** The current message containing the reply */
  currentMessage: TMessage
  /** Position of the bubble (left or right) */
  position: 'left' | 'right'
  /** Container style for the reply */
  containerStyle?: StyleProp<ViewStyle>
  /** Container style for left position */
  containerStyleLeft?: StyleProp<ViewStyle>
  /** Container style for right position */
  containerStyleRight?: StyleProp<ViewStyle>
  /** Text style for the reply */
  textStyle?: StyleProp<TextStyle>
  /** Text style for left position */
  textStyleLeft?: StyleProp<TextStyle>
  /** Text style for right position */
  textStyleRight?: StyleProp<TextStyle>
  /** Image style for the reply */
  imageStyle?: StyleProp<ImageStyle>
  /** Callback when reply is pressed */
  onPress?: (replyMessage: ReplyMessage) => void
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginBottom: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  containerLeft: {
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    borderLeftColor: '#0084ff',
    borderLeftWidth: 3,
  },
  containerRight: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderLeftColor: 'rgba(255, 255, 255, 0.6)',
    borderLeftWidth: 3,
  },
  image: {
    borderRadius: 4,
    height: 40,
    marginTop: 4,
    width: 40,
  },
  text: {
    fontSize: 13,
  },
  textLeft: {
    color: '#333',
  },
  textRight: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  username: {
    fontWeight: '600',
    marginBottom: 2,
  },
  usernameLeft: {
    color: '#0084ff',
  },
  usernameRight: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
})

export function MessageReply<TMessage extends IMessage = IMessage> ({
  replyMessage,
  currentMessage,
  position,
  containerStyle,
  containerStyleLeft,
  containerStyleRight,
  textStyle,
  textStyleLeft,
  textStyleRight,
  imageStyle,
  onPress,
}: MessageReplyProps<TMessage>) {
  const isCurrentUser = useMemo(
    () => isSameUser(currentMessage, { user: replyMessage.user } as TMessage),
    [currentMessage, replyMessage.user]
  )

  const displayName = useMemo(() => {
    if (isCurrentUser)
      return 'You'

    return replyMessage.user?.name || 'Unknown'
  }, [isCurrentUser, replyMessage.user?.name])

  const handlePress = () => {
    onPress?.(replyMessage)
  }

  const containerStyles = [
    styles.container,
    position === 'left' ? styles.containerLeft : styles.containerRight,
    containerStyle,
    position === 'left' ? containerStyleLeft : containerStyleRight,
  ]

  const usernameStyles = [
    styles.username,
    position === 'left' ? styles.usernameLeft : styles.usernameRight,
    textStyle,
    position === 'left' ? textStyleLeft : textStyleRight,
  ]

  const textStyles = [
    styles.text,
    position === 'left' ? styles.textLeft : styles.textRight,
    textStyle,
    position === 'left' ? textStyleLeft : textStyleRight,
  ]

  return (
    <Pressable onPress={handlePress}>
      <View style={containerStyles}>
        <Text style={usernameStyles} numberOfLines={1}>
          {displayName}
        </Text>
        {replyMessage.text && (
          <Text style={textStyles} numberOfLines={2}>
            {replyMessage.text}
          </Text>
        )}
        {replyMessage.image && (
          <Image
            source={{ uri: replyMessage.image }}
            style={[styles.image, imageStyle]}
          />
        )}
      </View>
    </Pressable>
  )
}
