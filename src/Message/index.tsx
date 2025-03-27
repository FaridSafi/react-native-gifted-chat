import React, { memo, useCallback } from 'react'
import { View } from 'react-native'
import isEqual from 'lodash.isequal'

import { Avatar } from '../Avatar'
import Bubble from '../Bubble'
import { SystemMessage } from '../SystemMessage'

import { isSameUser } from '../utils'
import { IMessage } from '../types'
import { MessageProps } from './types'
import styles from './styles'

export * from './types'

let Message: React.FC<MessageProps<IMessage>> = (props: MessageProps<IMessage>) => {
  const {
    currentMessage,
    renderBubble: renderBubbleProp,
    renderSystemMessage: renderSystemMessageProp,
    onMessageLayout,
    nextMessage,
    position,
    containerStyle,
    user,
    showUserAvatar,
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
      return renderBubbleProp(rest)

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
      return renderSystemMessageProp(rest)

    return <SystemMessage {...rest} />
  }, [props, renderSystemMessageProp])

  const renderAvatar = useCallback(() => {
    if (
      user?._id &&
      currentMessage?.user &&
      user._id === currentMessage.user._id &&
      !showUserAvatar
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
    showUserAvatar,
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
              styles[position].container,
              { marginBottom: sameUser ? 2 : 10 },
              !props.inverted && { marginBottom: 2 },
              containerStyle?.[position],
            ]}
          >
            {position === 'left' ? renderAvatar() : null}
            {renderBubble()}
            {position === 'right' ? renderAvatar() : null}
          </View>
        )}
    </View>
  )
}

Message = memo(Message, (props, nextProps) => {
  const shouldUpdate =
    props.shouldUpdateMessage?.(props, nextProps) ||
    !isEqual(props.currentMessage!, nextProps.currentMessage!) ||
    !isEqual(props.previousMessage, nextProps.previousMessage) ||
    !isEqual(props.nextMessage, nextProps.nextMessage)

  if (shouldUpdate)
    return false

  return true
})

export default Message
