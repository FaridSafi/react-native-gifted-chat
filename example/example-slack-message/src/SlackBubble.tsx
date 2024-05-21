/* eslint-disable no-underscore-dangle, no-use-before-define */

import PropTypes from 'prop-types'
import React, { useCallback, useMemo } from 'react'
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native'
import {
  MessageText,
  MessageImage,
  Time,
  utils,
  useChatContext,
} from 'react-native-gifted-chat'
import * as Clipboard from 'expo-clipboard'

const { isSameUser, isSameDay } = utils

interface Props {
  touchableProps: any
  onLongPress: (context: any, currentMessage: any) => void
  renderMessageImage: () => void
  renderMessageText: () => void
  renderCustomView: (props: Props) => void
  renderUsername: () => void
  renderTime: () => void
  renderTicks: () => void
  currentMessage: any
  nextMessage: any
  previousMessage: any
  user: any
  containerStyle: {
    left: StyleProp<ViewStyle>
    right: StyleProp<ViewStyle>
  }
  wrapperStyle: {
    left: StyleProp<ViewStyle>
    right: StyleProp<ViewStyle>
  }
  messageTextStyle: StyleProp<TextStyle>
  usernameStyle: StyleProp<TextStyle>
  tickStyle: StyleProp<TextStyle>
  containerToNextStyle: {
    left: StyleProp<ViewStyle>
    right: StyleProp<ViewStyle>
  }
  containerToPreviousStyle: {
    left: StyleProp<ViewStyle>
    right: StyleProp<ViewStyle>
  }
}

const Bubble = (props: Props) => {
  const {
    touchableProps,
    onLongPress,
    renderCustomView,
    currentMessage,
    nextMessage,
    previousMessage,
    user,
    containerStyle,
    wrapperStyle,
    messageTextStyle,
    usernameStyle,
    tickStyle,
    containerToNextStyle,
    containerToPreviousStyle,
  } = props

  const context = useChatContext()

  const handleLongPress = useCallback(() => {
    if (onLongPress) {
      onLongPress(context, currentMessage)
    } else {
      if (currentMessage.text) {
        const options = ['Copy Text', 'Cancel']
        const cancelButtonIndex = options.length - 1
        context.actionSheet().showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
          },
          buttonIndex => {
            switch (buttonIndex) {
              case 0:
                Clipboard.setStringAsync(currentMessage.text)
                break
            }
          },
        )
      }
    }
  }, [])

  const renderMessageText = useCallback(() => {
    if (currentMessage.text) {
      const {
        containerStyle,
        wrapperStyle,
        messageTextStyle,
        ...messageTextProps
      } = props

      if (props.renderMessageText)
        return props.renderMessageText(messageTextProps)

      return (
        <MessageText
          {...messageTextProps}
          textStyle={{
            left: [
              styles.standardFont,
              styles.slackMessageText,
              messageTexttextStyle,
              messageTextStyle,
            ],
          }}
        />
      )
    }

    return null
  }, [])

  const renderMessageImage = useCallback(() {
    if (currentMessage.image) {
      const { containerStyle, wrapperStyle, ...messageImageProps } = props
      if (props.renderMessageImage) {
        return props.renderMessageImage(messageImageProps)
      }
      return (
        <MessageImage
          {...messageImageProps}
          imageStyle={[styles.slackImage, messageImageimageStyle]}
        />
      )
    }

    return null
  }, [])

  const renderTicks = useCallback(() => {
    const { currentMessage } = props
    if (props.renderTicks) {
      return props.renderTicks(currentMessage)
    }
    if (currentMessage.user._id !== user._id) {
      return null
    }
    if (currentMessage.sent || currentMessage.received) {
      return (
        <View style={[styles.headerItem, styles.tickView]}>
          {currentMessage.sent && (
            <Text
              style={[styles.standardFont, styles.tick, tickStyle]}
            >
              ✓
            </Text>
          )}
          {currentMessage.received && (
            <Text
              style={[styles.standardFont, styles.tick, tickStyle]}
            >
              ✓
            </Text>
          )}
        </View>
      )
    }
    return null
  }, [])

  const renderUsername = useCallback(() => {
    const username = currentMessage.user.name
    if (username) {
      const { containerStyle, wrapperStyle, ...usernameProps } = props
      if (props.renderUsername) {
        return props.renderUsername(usernameProps)
      }
      return (
        <Text
          style={[
            styles.standardFont,
            styles.headerItem,
            styles.username,
            usernameStyle,
          ]}
        >
          {username}
        </Text>
      )
    }
    return null
  }, [])

  const renderTime = useCallback(() => {
    if (currentMessage.createdAt) {
      if (props.renderTime)
        return props.renderTime(timeProps)

      return (
        <Time
          {...timeProps}
          containerStyle={{ left: [styles.timeContainer] }}
          textStyle={{
            left: [
              styles.standardFont,
              styles.headerItem,
              styles.time,
              timetextStyle,
            ],
          }}
        />
      )
    }

    return null
  }, [])

  const isSameThread = useMemo(() =>
    isSameUser(currentMessage, previousMessage) &&
    isSameDay(currentMessage, previousMessage)
  , [])

  const messageHeader = useMemo(() => {
    if (isSameThread)
      return null

    return (
      <View style={styles.headerView}>
        {renderUsername()}
        {renderTime()}
        {renderTicks()}
      </View>
    )
  }, [isSameThread])

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        onLongPress={handleLongPress}
        accessibilityTraits='text'
        {...touchableProps}
      >
        <View style={[styles.wrapper, wrapperStyle]}>
          <View>
            {renderCustomView?.(props)}
            {messageHeader}
            {renderMessageImage()}
            {renderMessageText()}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

// Note: Everything is forced to be "left" positioned with this component.
// The "right" position is only used in the default Bubble.
const styles = StyleSheet.create({
  standardFont: {
    fontSize: 15,
  },
  slackMessageText: {
    marginLeft: 0,
    marginRight: 0,
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
  },
  wrapper: {
    marginRight: 60,
    minHeight: 20,
    justifyContent: 'flex-end',
  },
  username: {
    fontWeight: 'bold',
  },
  time: {
    textAlign: 'left',
    fontSize: 12,
  },
  timeContainer: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
  headerItem: {
    marginRight: 10,
  },
  headerView: {
    // Try to align it better with the avatar on Android.
    marginTop: Platform.OS === 'android' ? -2 : 0,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  /* eslint-disable react-native/no-color-literals */
  tick: {
    backgroundColor: 'transparent',
    color: 'white',
  },
  /* eslint-enable react-native/no-color-literals */
  tickView: {
    flexDirection: 'row',
  },
  slackImage: {
    borderRadius: 3,
    marginLeft: 0,
    marginRight: 0,
  },
})

export default Bubble

Bubble.contextTypes = {
  actionSheet: PropTypes.func,
}
