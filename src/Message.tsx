import PropTypes from 'prop-types'
import React from 'react'
import { View, StyleSheet, ViewStyle, LayoutChangeEvent } from 'react-native'

import { Avatar, AvatarProps } from './Avatar'
import Bubble from './Bubble'
import { SystemMessage, SystemMessageProps } from './SystemMessage'
import { Day, DayProps } from './Day'

import { StylePropType, isSameUser } from './utils'
import { IMessage, User, LeftRightStyle } from './Models'

const commonStyles = {
  defaultLeftMessageStyle: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingLeft: 22,
  } as const,
}
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
  startingStyle: {
    ...commonStyles.defaultLeftMessageStyle,
    paddingTop: 22,
    borderRadius: 20,
  },
  middleStyle: {
    ...commonStyles.defaultLeftMessageStyle,
    paddingVertical: 10,
    marginTop: -5,
  },
  endingStyle: {
    ...commonStyles.defaultLeftMessageStyle,
    marginTop: -5,
    paddingTop: 15,
    paddingBottom: 22,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
}

export interface MessageProps<TMessage extends IMessage> {
  key: any
  showUserAvatar?: boolean
  position: 'left' | 'right'
  currentMessage?: TMessage
  nextMessage?: TMessage
  previousMessage?: TMessage
  isStartingMessage?: boolean
  isEndingMessage?: boolean
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
  TMessage extends IMessage = IMessage
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
    isStartingMessage: true,
    isEndingMessage: false,
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
    isStartingMessage: PropTypes.bool,
    isEndingMessage: PropTypes.bool,
    user: PropTypes.object,
    inverted: PropTypes.bool,
    containerStyle: PropTypes.shape({
      left: StylePropType,
      right: StylePropType,
    }),
    shouldUpdateMessage: PropTypes.func,
    onMessageLayout: PropTypes.func,
  }

  shouldComponentUpdate(nextProps: MessageProps<TMessage>) {
    const next = nextProps.currentMessage!
    const current = this.props.currentMessage!
    const { previousMessage, nextMessage } = this.props
    const nextPropsMessage = nextProps.nextMessage
    const nextPropsPreviousMessage = nextProps.previousMessage

    const shouldUpdate =
      (this.props.shouldUpdateMessage &&
        this.props.shouldUpdateMessage(this.props, nextProps)) ||
      false

    return (
      next.sent !== current.sent ||
      next.received !== current.received ||
      next.pending !== current.pending ||
      next.createdAt !== current.createdAt ||
      next.text !== current.text ||
      next.image !== current.image ||
      next.video !== current.video ||
      next.audio !== current.audio ||
      previousMessage !== nextPropsPreviousMessage ||
      nextMessage !== nextPropsMessage ||
      shouldUpdate
    )
  }

  renderDay() {
    if (this.props.currentMessage && this.props.currentMessage.createdAt) {
      const { containerStyle, onMessageLayout, ...props } = this.props
      if (this.props.renderDay) {
        return this.props.renderDay(props)
      }
      return <Day {...props} />
    }
    return null
  }

  renderBubble() {
    const { containerStyle, onMessageLayout, ...props } = this.props
    if (this.props.renderBubble) {
      return this.props.renderBubble(props)
    }
    // @ts-ignore
    return <Bubble {...props} />
  }

  renderSystemMessage() {
    const { containerStyle, onMessageLayout, ...props } = this.props

    if (this.props.renderSystemMessage) {
      return this.props.renderSystemMessage(props)
    }
    return <SystemMessage {...props} />
  }

  renderAvatar() {
    const { user, currentMessage, showUserAvatar } = this.props

    if (
      user &&
      user._id &&
      currentMessage &&
      currentMessage.user &&
      user._id === currentMessage.user._id &&
      !showUserAvatar
    ) {
      return null
    }

    if (
      currentMessage &&
      currentMessage.user &&
      currentMessage.user.avatar === null
    ) {
      return null
    }

    const { containerStyle, onMessageLayout, ...props } = this.props
    return <Avatar {...props} />
  }
  getBubbleStyle() {
    const { isStartingMessage, isEndingMessage } = this.props
    if (isStartingMessage) {
      return {
        ...styles.startingStyle,
        borderBottomLeftRadius: isEndingMessage ? 20 : 0,
        borderBottomRightRadius: isEndingMessage ? 20 : 0,
        paddingBottom: isEndingMessage ? 22 : 0,
      }
    } else if (isEndingMessage) {
      return styles.endingStyle
    } else {
      return styles.middleStyle
    }
  }
  render() {
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
          {currentMessage.system ? (
            this.renderSystemMessage()
          ) : (
            <View
              style={[
                styles[position].container,
                { marginBottom: sameUser ? 2 : 10 },
                !this.props.inverted && { marginBottom: 2 },
                containerStyle && containerStyle[position],
              ]}
            >
              {position === 'left' ? (
                // Container for left position
                <View style={this.getBubbleStyle()}>
                  {this.renderAvatar()}
                  {this.renderBubble()}
                </View>
              ) : (
                // No container for right position
                <>
                  {this.renderBubble()}
                  {this.renderAvatar()}
                </>
              )}
            </View>
          )}
        </View>
      )
    }
    return null
  }
}
