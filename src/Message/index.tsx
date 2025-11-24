import React, { useCallback } from 'react'
import { View } from 'react-native'

import { Avatar } from '../Avatar'
import { Bubble } from '../Bubble'
import { IMessage } from '../Models'
import { getStyleWithPosition } from '../styles'
import { SystemMessage } from '../SystemMessage'
import { isSameUser, renderComponentOrElement } from '../utils'
import styles from './styles'
import { MessageProps } from './types'

export * from './types'

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
  } = props

  const renderBubble = useCallback(() => {
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      onMessageLayout,
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

  if (!currentMessage)
    return null

  const sameUser = isSameUser(currentMessage, nextMessage!)

  return (
    <View onLayout={onMessageLayout}>
      {currentMessage.system
        ? (
          renderSystemMessage()
        )
        : (
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
        )}
    </View>
  )
}
