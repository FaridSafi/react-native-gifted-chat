import React, { useCallback, useMemo, useRef } from 'react'
import { View, StyleSheet } from 'react-native'
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable'
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated'

import { Avatar } from '../Avatar'
import { Bubble } from '../Bubble'
import { Color } from '../Color'
import { IMessage } from '../Models'
import { SwipeToReplyProps } from '../Reply'
import { getStyleWithPosition } from '../styles'
import { SystemMessage } from '../SystemMessage'
import { isSameUser, renderComponentOrElement } from '../utils'
import styles from './styles'
import { MessageProps } from './types'

export * from './types'

interface ReplyIconProps {
  progress: SharedValue<number>
  translation: SharedValue<number>
  direction: 'left' | 'right'
  position: 'left' | 'right'
  style?: SwipeToReplyProps<IMessage>['actionContainerStyle']
}

const ReplyIcon = ({ progress, direction, position, style }: ReplyIconProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    'worklet'

    const scale = Math.min(progress.value, 1)
    // When swiping left (icon on right), icon should move left (negative)
    // When swiping right (icon on left), icon should move right (positive)
    const translateX = direction === 'left'
      ? Math.min(progress.value * -12, -12)
      : Math.max(progress.value * 12, 12)

    return {
      transform: [{ scale }, { translateX }],
      marginLeft: position === 'left' ? 0 : 16,
      marginRight: position === 'right' ? 0 : 16,
    }
  })

  return (
    <Animated.View style={[localStyles.swipeActionContainer, animatedStyle, style]}>
      <View style={localStyles.replyIconContainer}>
        <View style={localStyles.replyIcon}>
          <View style={localStyles.replyIconArrow} />
          <View style={localStyles.replyIconLine} />
        </View>
      </View>
    </Animated.View>
  )
}

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
    swipeToReply,
  } = props

  // Extract swipe props
  const isSwipeToReplyEnabled = swipeToReply?.isEnabled ?? false
  const swipeToReplyDirection = swipeToReply?.direction ?? 'left'
  const onSwipeToReply = swipeToReply?.onSwipe
  const renderSwipeToReplyActionProp = swipeToReply?.renderAction
  const swipeToReplyActionContainerStyle = swipeToReply?.actionContainerStyle

  const swipeableRef = useRef<SwipeableMethods>(null)

  const renderBubble = useCallback(() => {
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      onMessageLayout,
      swipeToReply,
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
      swipeToReply,
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
      swipeToReply,
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
    progress: SharedValue<number>,
    translation: SharedValue<number>
  ) => {
    if (renderSwipeToReplyActionProp)
      return renderSwipeToReplyActionProp(progress, translation, position)

    return (
      <ReplyIcon
        progress={progress}
        translation={translation}
        direction={swipeToReplyDirection}
        position={position}
        style={swipeToReplyActionContainerStyle}
      />
    )
  }, [position, renderSwipeToReplyActionProp, swipeToReplyDirection, swipeToReplyActionContainerStyle])

  const handleSwipeableOpen = useCallback(() => {
    swipeableRef.current?.close()
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
      <ReanimatedSwipeable
        ref={swipeableRef}
        friction={2}
        overshootFriction={8}
        renderRightActions={swipeToReplyDirection === 'left' ? renderSwipeAction : undefined}
        renderLeftActions={swipeToReplyDirection === 'right' ? renderSwipeAction : undefined}
        onSwipeableOpen={handleSwipeableOpen}
        onSwipeableWillOpen={handleSwipeableWillOpen}
      >
        {messageContent}
      </ReanimatedSwipeable>
    </View>
  )
}

const localStyles = StyleSheet.create({
  swipeActionContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
