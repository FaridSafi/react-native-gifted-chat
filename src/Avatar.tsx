import PropTypes from 'prop-types'
import React, { ReactNode } from 'react'
import {
  StyleSheet,
  View,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native'
import GiftedAvatar from './GiftedAvatar'
import { StylePropType, isSameUser, isSameDay } from './utils'
import { Omit, IMessage, User, LeftRightStyle } from './Models'

const styles = {
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
  position: 'left' | 'right'
  renderAvatarOnTop?: boolean
  showAvatarForEveryMessage?: boolean
  imageStyle?: LeftRightStyle<ImageStyle>
  containerStyle?: LeftRightStyle<ViewStyle>
  textStyle?: TextStyle
  renderAvatar?(props: Omit<AvatarProps<TMessage>, 'renderAvatar'>): ReactNode
  onPressAvatar?(user: User): void
  onLongPressAvatar?(user: User): void
}

export function Avatar<TMessage extends IMessage = IMessage>(props: AvatarProps<TMessage>) {
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
  } = props
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
          avatarStyle={
            [
              styles[position].image,
              imageStyle && imageStyle[position],
            ] as ImageStyle
          }
        />
      </View>
    )
  }

  const renderAvatarComponent = () => {
    if (props.renderAvatar) {
      const { renderAvatar, ...avatarProps } = props
      return props.renderAvatar(avatarProps)
    }

    if (props.currentMessage) {
      return (
        <GiftedAvatar
          avatarStyle={
            [
              styles[props.position].image,
              props.imageStyle &&
              props.imageStyle[props.position],
            ] as ImageStyle
          }
          user={props.currentMessage.user}
          onPress={() => props.onPressAvatar?.(props.currentMessage!.user)}
          onLongPress={() => props.onLongPressAvatar?.(props.currentMessage!.user)}
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

Avatar.defaultProps = {
  renderAvatarOnTop: false,
  showAvatarForEveryMessage: false,
  position: 'left',
  currentMessage: {
    user: null,
  },
  previousMessage: {},
  nextMessage: {},
  containerStyle: {},
  imageStyle: {},
  onPressAvatar: () => { },
  onLongPressAvatar: () => { },
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
