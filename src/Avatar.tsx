import PropTypes from 'prop-types'
import React, { ReactNode } from 'react'
import {
  ImageStyle,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import { GiftedAvatar } from './GiftedAvatar'
import { StylePropType, isSameUser, isSameDay } from './utils'
import { IMessage, LeftRightStyle, User } from './Models'

interface Styles {
  left: {
    container: ViewStyle
    onTop: ViewStyle
    image: ImageStyle
  }
  right: {
    container: ViewStyle
    onTop: ViewStyle
    image: ImageStyle
  }
}

const styles: Styles = {
  left: StyleSheet.create({
    container: {
      marginRight: 8,
    },
    onTop: {
      alignSelf: 'flex-start',
    },
    image: {
      height: 36,
      width: 36,
      borderRadius: 18,
    },
  }),
  right: StyleSheet.create({
    container: {
      marginLeft: 8,
    },
    onTop: {
      alignSelf: 'flex-start',
    },
    image: {
      height: 36,
      width: 36,
      borderRadius: 18,
    },
  }),
}

export interface AvatarProps<TMessage extends IMessage> {
  currentMessage: TMessage
  previousMessage?: TMessage
  nextMessage?: TMessage
  position: 'left' | 'right'
  renderAvatarOnTop?: boolean
  showAvatarForEveryMessage?: boolean
  imageStyle?: LeftRightStyle<ImageStyle>
  containerStyle?: LeftRightStyle<ViewStyle>
  textStyle?: TextStyle
  renderAvatar?(props: Omit<AvatarProps<TMessage>, 'renderAvatar'>): ReactNode
  onPressAvatar?: (user: User) => void
  onLongPressAvatar?: (user: User) => void
}

export function Avatar<TMessage extends IMessage = IMessage> (
  props: AvatarProps<TMessage>
) {
  const {
    renderAvatarOnTop,
    showAvatarForEveryMessage,
    containerStyle,
    position,
    currentMessage,
    renderAvatar,
    previousMessage,
    nextMessage,
    imageStyle,
    onPressAvatar,
    onLongPressAvatar,
  } = props

  const messageToCompare = renderAvatarOnTop ? previousMessage : nextMessage

  if (renderAvatar === null)
    return null

  if (
    !showAvatarForEveryMessage &&
    currentMessage &&
    messageToCompare &&
    isSameUser(currentMessage, messageToCompare) &&
    isSameDay(currentMessage, messageToCompare)
  )
    return (
      <View
        style={[
          styles[position].container,
          containerStyle?.[position],
        ]}
      >
        <GiftedAvatar
          avatarStyle={[
            styles[position].image,
            imageStyle?.[position],
          ]}
        />
      </View>
    )

  const renderAvatarComponent = () => {
    if (renderAvatar)
      return renderAvatar({
        renderAvatarOnTop,
        showAvatarForEveryMessage,
        containerStyle,
        position,
        currentMessage,
        previousMessage,
        nextMessage,
        imageStyle,
        onPressAvatar,
        onLongPressAvatar,
      })

    if (currentMessage)
      return (
        <GiftedAvatar
          avatarStyle={[
            styles[position].image,
            imageStyle?.[position],
          ]}
          user={currentMessage.user}
          onPress={() => onPressAvatar?.(currentMessage.user)}
          onLongPress={() => onLongPressAvatar?.(currentMessage.user)}
        />
      )

    return null
  }

  return (
    <View
      style={[
        styles[position].container,
        renderAvatarOnTop && styles[position].onTop,
        containerStyle?.[position],
      ]}
    >
      {renderAvatarComponent()}
    </View>
  )
}

Avatar.propTypes = {
  renderAvatarOnTop: PropTypes.bool,
  showAvatarForEveryMessage: PropTypes.bool,
  position: PropTypes.oneOf(['left', 'right']),
  currentMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  onPressAvatar: PropTypes.func,
  onLongPressAvatar: PropTypes.func,
  renderAvatar: PropTypes.func,
  containerStyle: PropTypes.shape({
    left: StylePropType,
    right: StylePropType,
  }),
  imageStyle: PropTypes.shape({
    left: StylePropType,
    right: StylePropType,
  }),
}
