/* eslint-disable no-underscore-dangle, no-use-before-define */

import PropTypes from 'prop-types'
import React, { useCallback, useMemo } from 'react'
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native'

import { Avatar, Day, utils } from 'react-native-gifted-chat'
import Bubble from './SlackBubble'

const { isSameUser, isSameDay } = utils

interface Props {
  renderAvatar: () => {},
  renderBubble: () => {},
  renderDay: () => {},
  currentMessage: any,
  nextMessage: any,
  previousMessage: any,
  user: any,
  containerStyle?: {
    left: StyleProp<ViewStyle>,
    right: StyleProp<ViewStyle>,
  },
}

const Message = (props: Props) => {
  const {
    currentMessage,
    nextMessage,
    previousMessage,
    user,
    containerStyle,
  } = props

  const getInnerComponentProps = useCallback(() => {
    return {
      ...props,
      position: 'left',
      isSameUser,
      isSameDay,
    }
  }, [props])

  const renderDay = useCallback(() => {
    if (currentMessage.createdAt) {
      const dayProps = getInnerComponentProps()
      if (props.renderDay) {
        return props.renderDay(dayProps)
      }
      return <Day {...dayProps} />
    }
    return null
  }, [])

  const renderBubble = useCallback(() => {
    const bubbleProps = getInnerComponentProps()
    if (props.renderBubble) {
      return props.renderBubble(bubbleProps)
    }
    return <Bubble {...bubbleProps} />
  }, [])

  const renderAvatar = useCallback(() => {
    let extraStyle
    if (
      isSameUser(currentMessage, previousMessage) &&
      isSameDay(currentMessage, previousMessage)
    ) {
      // Set the invisible avatar height to 0, but keep the width, padding, etc.
      extraStyle = { height: 0 }
    }

    const avatarProps = getInnerComponentProps()

    if (props.renderAvatar)
      return props.renderAvatar(avatarProps)

    return (
      <Avatar
        {...avatarProps}
        imageStyle={{
          left: [styles.slackAvatar, avatarProps.imageStyle, extraStyle],
        }}
      />
    )
  }, [])

  const marginBottom = useMemo(() =>
    isSameUser(
      currentMessage,
      nextMessage,
    )
      ? 2
      : 10
  , [currentMessage, nextMessage])

  return (
    <View>
      {renderDay()}
      <View
        style={[
          styles.container,
          { marginBottom },
          containerStyle,
        ]}
      >
        {renderAvatar()}
        {renderBubble()}
      </View>
    </View>
  )
}

export default Message

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginLeft: 8,
    marginRight: 0,
  },
  slackAvatar: {
    // The bottom should roughly line up with the first line of message text.
    height: 40,
    width: 40,
    borderRadius: 3,
  },
})
