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
  touchableProps: object
  onLongPress?: (context: unknown, currentMessage: object) => void
  renderMessageImage?: (props: Props) => React.ReactNode
  renderMessageText?: (props: Props) => React.ReactNode
  renderCustomView?: (props: Props) => React.ReactNode
  renderUsername?: (props: Props) => React.ReactNode
  renderTime?: (props: Props) => React.ReactNode
  renderTicks?: (currentMessage: object) => React.ReactNode
  currentMessage: object
  nextMessage: object
  previousMessage: object
  user: object
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
  imageStyle?: StyleProp<ViewStyle>
  textStyle: StyleProp<TextStyle>
  position: 'left' | 'right'
}

const Bubble = (props: Props) => {
  const {
    touchableProps,
    onLongPress,
    renderCustomView,
    currentMessage,
    previousMessage,
    user,
    containerStyle,
    wrapperStyle,
    usernameStyle,
    tickStyle,
    position,
  } = props

  const context = useChatContext()

  const handleLongPress = useCallback(() => {
    if (onLongPress) {
      onLongPress(context, currentMessage)
      return
    }

    if (!currentMessage.text)
      return

    const options = ['Copy Text', 'Cancel']
    const cancelButtonIndex = options.length - 1
    context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex: number) => {
        switch (buttonIndex) {
          case 0:
            Clipboard.setStringAsync(currentMessage.text)
            break
        }
      }
    )
  }, [])

  const renderMessageText = useCallback(() => {
    if (currentMessage.text) {
      if (props.renderMessageText)
        return props.renderMessageText(props)

      return (
        <MessageText
          {...props}
          textStyle={{
            left: [
              styles.standardFont,
              styles.slackMessageText,
              props.textStyle,
              props.messageTextStyle,
            ],
          }}
        />
      )
    }

    return null
  }, [])

  const renderMessageImage = useCallback(() => {
    if (currentMessage.image) {
      if (props.renderMessageImage)
        return props.renderMessageImage(props)

      return (
        <MessageImage
          {...props}
          imageStyle={[styles.slackImage, props.imageStyle]}
        />
      )
    }

    return null
  }, [])

  const renderTicks = useCallback(() => {
    const { currentMessage } = props

    if (props.renderTicks)
      return props.renderTicks(currentMessage)

    if (currentMessage.user._id !== user._id)
      return null

    if (currentMessage.sent || currentMessage.received)
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

    return null
  }, [])

  const renderUsername = useCallback(() => {
    const username = currentMessage.user.name
    if (username) {
      if (props.renderUsername)
        return props.renderUsername(props)

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
        return props.renderTime(props)

      return (
        <Time
          {...props}
          containerStyle={{ left: [styles.timeContainer] }}
          textStyle={{
            left: [
              styles.standardFont,
              styles.headerItem,
              styles.time,
              props.textStyle,
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
  , [currentMessage, previousMessage])

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
  }, [isSameThread, renderUsername, renderTime, renderTicks])

  return (
    <View style={[styles.container, containerStyle?.[position]]}>
      <TouchableOpacity
        onLongPress={handleLongPress}
        accessibilityTraits='text'
        {...touchableProps}
      >
        <View style={[styles.wrapper, wrapperStyle?.[position]]}>
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
  tick: {
    backgroundColor: 'transparent',
    color: 'white',
  },
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
