import PropTypes from 'prop-types'
import React, { ReactNode } from 'react'
import {
  ImageStyle,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import GiftedAvatar from './GiftedAvatar'
import { StylePropType, isSameUser, isSameDay } from './utils'
import { IMessage, LeftRightStyle, User } from './Models'

const styles: { [key: string]: any } = {
  left: StyleSheet.create({
    container: {
      marginRight: 8,
    },
    onTop: {
      alignSelf: 'flex-start',
    },
    onBottom: {},
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
    onBottom: {},
    image: {
      height: 36,
      width: 36,
      borderRadius: 18,
    },
  }),
}

export interface AvatarProps<TMessage extends IMessage> {
  currentMessage?: TMessage
  previousMessage?: TMessage
  nextMessage?: TMessage
  position: 'left' | 'right' | string // Allow string as a fallback value
  renderAvatarOnTop?: boolean
  showAvatarForEveryMessage?: boolean
  imageStyle?: LeftRightStyle<ImageStyle>
  containerStyle?: LeftRightStyle<ViewStyle>
  textStyle?: TextStyle
  renderAvatar?(props: Omit<AvatarProps<TMessage>, 'renderAvatar'>): ReactNode
  onPressAvatar?(user: User): void
  onLongPressAvatar?(user: User): void
}

export function Avatar({
  renderAvatarOnTop = false,
  showAvatarForEveryMessage = false,
  containerStyle = {} as { [key: string]: any },
  position = 'left',
  currentMessage = {} as IMessage,
  previousMessage = {} as IMessage,
  nextMessage = {} as IMessage,
  renderAvatar = (({}) => null) as AvatarProps<IMessage>['renderAvatar'],
  imageStyle = {} as { [key: string]: any },
  onPressAvatar = ({}) => {},
  onLongPressAvatar = ({}) => {},
}) {
  const messageToCompare = renderAvatarOnTop ? previousMessage : nextMessage
  const computedStyle = renderAvatarOnTop ? 'onTop' : 'onBottom'

  if (renderAvatar === null) {
    return null
  }

  if (
    !showAvatarForEveryMessage &&
    currentMessage &&
    messageToCompare &&
    isSameUser(currentMessage, messageToCompare) &&
    isSameDay(currentMessage, messageToCompare)
  ) {
    return (
      <View
        style={[
          styles[position].container,
          containerStyle && containerStyle[position],
        ]}
      >
        <GiftedAvatar
          avatarStyle={[
            styles[position].image,
            imageStyle && imageStyle[position],
          ]}
        />
      </View>
    )
  }

  const renderAvatarComponent = () => {
    if (renderAvatar) {
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
    }
    if (currentMessage) {
      return (
        <GiftedAvatar
          avatarStyle={[
            styles[position].image,
            imageStyle && imageStyle[position],
          ]}
          user={currentMessage.user}
          onPress={() => onPressAvatar(currentMessage.user)}
          onLongPress={() => onLongPressAvatar(currentMessage.user)}
        />
      )
    }
    return null
  }

  return (
    <View
      style={[
        styles[position].container,
        styles[position][computedStyle],
        containerStyle && containerStyle[position],
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
