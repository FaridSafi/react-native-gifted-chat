import React, { useCallback, useMemo } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'

import { Avatar } from '../Avatar'
import { Bubble } from '../Bubble'
import { Color } from '../Color'
import { IMessage } from '../Models'
import { getStyleWithPosition } from '../styles'
import { SystemMessage } from '../SystemMessage'
import { isSameUser, renderComponentOrElement } from '../utils'
import styles from './styles'
import { MessageProps } from './types'

export * from './types'

const ReplyIcon = () => (
  <View style={localStyles.replyIconContainer}>
    <View style={localStyles.replyIcon}>
      <View style={localStyles.replyIconArrow} />
      <View style={localStyles.replyIconLine} />
    </View>
  </View>
)

export const Message = <TMessage extends IMessage = IMessage>(props: MessageProps<TMessage>) => {
  const {
    currentMessage,
    renderBubble: renderBubbleProp,
    renderSystemMessage: renderSystemMessageProp,
    onMessageLayout,
    nextMessage,
    position,
    containerStyle,
    user,
    isUserAvatarVisible,
    isSwipeToReplyEnabled = false,
    swipeToReplyDirection = 'right',
    onSwipeToReply,
    renderSwipeToReplyAction: renderSwipeToReplyActionProp,
    swipeToReplyActionContainerStyle,
  } = props

  const renderBubble = useCallback(() => {
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      onMessageLayout,
      isSwipeToReplyEnabled,
      swipeToReplyDirection,
      onSwipeToReply,
      renderSwipeToReplyAction,
      swipeToReplyActionContainerStyle,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...rest
    } = props

    if (renderBubbleProp)
      return renderComponentOrElement(renderBubbleProp, rest)

    return <Bubble {...rest} />
  }, [props, renderBubbleProp])

  const renderSystemMessage = useCallback(() => {
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      onMessageLayout,
      isSwipeToReplyEnabled,
      swipeToReplyDirection,
      onSwipeToReply,
      renderSwipeToReplyAction,
      swipeToReplyActionContainerStyle,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...rest
    } = props

    if (renderSystemMessageProp)
      return renderComponentOrElement(renderSystemMessageProp, rest)

    return <SystemMessage {...rest} />
  }, [props, renderSystemMessageProp])

  const renderAvatar = useCallback(() => {
    if (
      user?._id &&
      currentMessage?.user &&
      user._id === currentMessage.user._id &&
      !isUserAvatarVisible
    )
      return null

    if (currentMessage?.user?.avatar === null)
      return null

    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      onMessageLayout,
      isSwipeToReplyEnabled,
      swipeToReplyDirection,
      onSwipeToReply,
      renderSwipeToReplyAction,
      swipeToReplyActionContainerStyle,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...rest
    } = props

    return <Avatar {...rest} />
  }, [
    props,
    user,
    currentMessage,
    isUserAvatarVisible,
  ])

  const renderSwipeAction = useCallback((
    progress: Animated.AnimatedInterpolation<string | number>,
    dragX: Animated.AnimatedInterpolation<string | number>
  ) => {
    if (renderSwipeToReplyActionProp)
      return renderSwipeToReplyActionProp(progress, dragX, position)

    const scale = progress.interpolate({
      inputRange: [0, 1, 100],
      outputRange: [0, 1, 1],
    })

    const translateX = progress.interpolate({
      inputRange: [0, 1, 2],
      outputRange: swipeToReplyDirection === 'right' ? [0, -12, -20] : [0, 12, 20],
    })

    return (
      <Animated.View
        style={[
          localStyles.swipeActionContainer,
          swipeToReplyActionContainerStyle,
          {
            transform: [{ scale }, { translateX }],
            marginLeft: position === 'left' ? 0 : 16,
            marginRight: position === 'right' ? 0 : 16,
          },
        ]}
      >
        <ReplyIcon />
      </Animated.View>
    )
  }, [position, renderSwipeToReplyActionProp, swipeToReplyDirection, swipeToReplyActionContainerStyle])

  const handleSwipeableOpen = useCallback((_direction: 'left' | 'right', swipeable: Swipeable) => {
    swipeable.close()
  }, [])

  const handleSwipeableWillOpen = useCallback(() => {
    if (onSwipeToReply && currentMessage)
      onSwipeToReply(currentMessage)
  }, [onSwipeToReply, currentMessage])

  const sameUser = useMemo(() =>
    isSameUser(currentMessage, nextMessage!)
  , [currentMessage, nextMessage])

  const messageContent = useMemo(() => {
    if (currentMessage?.system)
      return renderSystemMessage()

    return (
      <View
        style={[
          getStyleWithPosition(styles, 'container', position),
          { marginBottom: sameUser ? 2 : 10 },
          !props.isInverted && { marginBottom: 2 },
          containerStyle?.[position],
        ]}
      >
        {position === 'left' && renderAvatar()}
        {renderBubble()}
        {position === 'right' && renderAvatar()}
      </View>
    )
  }, [
    currentMessage?.system,
    renderSystemMessage,
    position,
    sameUser,
    props.isInverted,
    containerStyle,
    renderAvatar,
    renderBubble,
  ])

  if (!currentMessage)
    return null

  // Don't wrap system messages in Swipeable
  if (currentMessage.system || !isSwipeToReplyEnabled)
    return (
      <View onLayout={onMessageLayout}>
        {messageContent}
      </View>
    )

  return (
    <View onLayout={onMessageLayout}>
      <Swipeable
        friction={2}
        overshootFriction={8}
        renderRightActions={swipeToReplyDirection === 'right' ? renderSwipeAction : undefined}
        renderLeftActions={swipeToReplyDirection === 'left' ? renderSwipeAction : undefined}
        onSwipeableOpen={handleSwipeableOpen}
        onSwipeableWillOpen={handleSwipeableWillOpen}
      >
        {messageContent}
      </Swipeable>
    </View>
  )
}

const localStyles = StyleSheet.create({
  swipeActionContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 12,
  },
  replyIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Color.defaultBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyIcon: {
    width: 14,
    height: 10,
    transform: [{ scaleX: -1 }],
  },
  replyIconArrow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderTopColor: 'transparent',
    borderBottomWidth: 5,
    borderBottomColor: 'transparent',
    borderRightWidth: 6,
    borderRightColor: Color.white,
  },
  replyIconLine: {
    position: 'absolute',
    top: 3,
    left: 5,
    width: 9,
    height: 4,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopColor: Color.white,
    borderRightColor: Color.white,
    borderTopRightRadius: 4,
  },
})
