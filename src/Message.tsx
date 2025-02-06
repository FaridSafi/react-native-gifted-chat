import React, { memo, useCallback } from 'react'
import { View, StyleSheet, ViewStyle, LayoutChangeEvent } from 'react-native'
import isEqual from 'lodash.isequal'

import { Avatar, AvatarProps } from './Avatar'
import Bubble from './Bubble'
import { SystemMessage, SystemMessageProps } from './SystemMessage'
import { Day, DayProps } from './Day'

import { isSameUser } from './utils'
import { IMessage, User, LeftRightStyle } from './Models'

const styles = {
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginLeft: 8,
      marginRight: 0,
    },
  }),
  right: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      marginLeft: 0,
      marginRight: 8,
    },
  }),
}

export interface MessageProps<TMessage extends IMessage> {
  showUserAvatar?: boolean
  position: 'left' | 'right'
  currentMessage: TMessage
  nextMessage?: TMessage
  previousMessage?: TMessage
  user: User
  inverted?: boolean
  containerStyle?: LeftRightStyle<ViewStyle>
  renderBubble?(props: Bubble['props']): React.ReactNode
  renderDay?(props: DayProps<TMessage>): React.ReactNode
  renderSystemMessage?(props: SystemMessageProps<TMessage>): React.ReactNode
  renderAvatar?(props: AvatarProps<TMessage>): React.ReactNode
  shouldUpdateMessage?(
    props: MessageProps<IMessage>,
    nextProps: MessageProps<IMessage>,
  ): boolean
  onMessageLayout?(event: LayoutChangeEvent): void
}

let Message: React.FC<MessageProps<IMessage>> = (props) => {
  const {
    currentMessage,
    renderDay: renderDayProp,
    renderBubble: renderBubbleProp,
    renderSystemMessage: renderSystemMessageProp,
    onMessageLayout,
    nextMessage,
    position,
    containerStyle,
  } = props

  const renderDay = useCallback(() => {
    if (!currentMessage?.createdAt)
      return null

    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      onMessageLayout,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...rest
    } = props

    if (renderDayProp)
      return renderDayProp(rest)

    return <Day {...rest} />
  }, [currentMessage, props, renderDayProp])

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
    const {
      user,
      currentMessage,
      showUserAvatar,
    } = props

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
  }, [props])

  if (currentMessage) {
    const sameUser = isSameUser(currentMessage, nextMessage!)

    return (
      <View onLayout={onMessageLayout}>
        {renderDay()}
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
                containerStyle && containerStyle[position],
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

  return null
}

Message = memo(Message, (props, nextProps) => {
  const next = nextProps.currentMessage!
  const current = props.currentMessage!
  const { previousMessage, nextMessage } = props
  const nextPropsMessage = nextProps.nextMessage
  const nextPropsPreviousMessage = nextProps.previousMessage

  let shouldUpdate =
    props.shouldUpdateMessage?.(props, nextProps) || false

  shouldUpdate =
    shouldUpdate ||
    !isEqual(current, next) ||
    !isEqual(previousMessage, nextPropsPreviousMessage) ||
    !isEqual(nextMessage, nextPropsMessage)

  return shouldUpdate
})

export default Message
