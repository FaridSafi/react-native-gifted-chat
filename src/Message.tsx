import PropTypes from 'prop-types'
import React from 'react'
import { View, StyleSheet, ViewStyle, LayoutChangeEvent } from 'react-native'
import isEqual from 'lodash.isequal'

import { Avatar, AvatarProps } from './Avatar'
import Bubble from './Bubble'
import { SystemMessage, SystemMessageProps } from './SystemMessage'
import { Day, DayProps } from './Day'

import { StylePropType, isSameUser } from './utils'
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

export default class Message<
  TMessage extends IMessage = IMessage,
> extends React.Component<MessageProps<TMessage>> {
  static defaultProps = {
    renderAvatar: undefined,
    renderBubble: null,
    renderDay: null,
    renderSystemMessage: null,
    position: 'left',
    currentMessage: {},
    nextMessage: {},
    previousMessage: {},
    user: {},
    containerStyle: {},
    showUserAvatar: false,
    inverted: true,
    shouldUpdateMessage: undefined,
    onMessageLayout: undefined,
  }

  static propTypes = {
    renderAvatar: PropTypes.func,
    showUserAvatar: PropTypes.bool,
    renderBubble: PropTypes.func,
    renderDay: PropTypes.func,
    renderSystemMessage: PropTypes.func,
    position: PropTypes.oneOf(['left', 'right']),
    currentMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    user: PropTypes.object,
    inverted: PropTypes.bool,
    containerStyle: PropTypes.shape({
      left: StylePropType,
      right: StylePropType,
    }),
    shouldUpdateMessage: PropTypes.func,
    onMessageLayout: PropTypes.func,
  }

  shouldComponentUpdate (nextProps: MessageProps<TMessage>) {
    const next = nextProps.currentMessage!
    const current = this.props.currentMessage!
    const { previousMessage, nextMessage } = this.props
    const nextPropsMessage = nextProps.nextMessage
    const nextPropsPreviousMessage = nextProps.previousMessage

    let shouldUpdate =
      this.props.shouldUpdateMessage?.(this.props, nextProps) || false

    shouldUpdate =
      shouldUpdate ||
      !isEqual(current, next) ||
      !isEqual(previousMessage, nextPropsPreviousMessage) ||
      !isEqual(nextMessage, nextPropsMessage)

    return shouldUpdate
  }

  renderDay () {
    if (this.props.currentMessage && this.props.currentMessage.createdAt) {
      const {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        containerStyle,
        onMessageLayout,
        /* eslint-enable @typescript-eslint/no-unused-vars */
        ...props
      } = this.props

      if (this.props.renderDay)
        return this.props.renderDay(props)

      return <Day {...props} />
    }
    return null
  }

  renderBubble () {
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      onMessageLayout,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...props
    } = this.props

    if (this.props.renderBubble)
      return this.props.renderBubble(props)

    return <Bubble {...props} />
  }

  renderSystemMessage () {
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      onMessageLayout,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...props
    } = this.props

    if (this.props.renderSystemMessage)
      return this.props.renderSystemMessage(props)

    return <SystemMessage {...props} />
  }

  renderAvatar () {
    const { user, currentMessage, showUserAvatar } = this.props

    if (
      user &&
      user._id &&
      currentMessage &&
      currentMessage.user &&
      user._id === currentMessage.user._id &&
      !showUserAvatar
    )
      return null

    if (
      currentMessage &&
      currentMessage.user &&
      currentMessage.user.avatar === null
    )
      return null

    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      onMessageLayout,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...props
    } = this.props

    return <Avatar {...props} />
  }

  render () {
    const {
      currentMessage,
      onMessageLayout,
      nextMessage,
      position,
      containerStyle,
    } = this.props
    if (currentMessage) {
      const sameUser = isSameUser(currentMessage, nextMessage!)
      return (
        <View onLayout={onMessageLayout}>
          {this.renderDay()}
          {currentMessage.system
            ? (
              this.renderSystemMessage()
            )
            : (
              <View
                style={[
                  styles[position].container,
                  { marginBottom: sameUser ? 2 : 10 },
                  !this.props.inverted && { marginBottom: 2 },
                  containerStyle && containerStyle[position],
                ]}
              >
                {this.props.position === 'left' ? this.renderAvatar() : null}
                {this.renderBubble()}
                {this.props.position === 'right' ? this.renderAvatar() : null}
              </View>
            )}
        </View>
      )
    }
    return null
  }
}
