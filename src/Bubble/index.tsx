import React, { useCallback } from 'react'
import {
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import { useChatContext } from '../GiftedChatContext'
import { QuickReplies } from '../QuickReplies'
import { MessageText } from '../MessageText'
import { MessageImage } from '../MessageImage'
import { MessageVideo } from '../MessageVideo'
import { MessageAudio } from '../MessageAudio'
import { Time } from '../Time'

import { isSameUser, isSameDay } from '../utils'
import { IMessage } from '../types'
import { BubbleProps } from './types'

import stylesCommon from '../styles'
import styles from './styles'

export * from './types'

const Bubble: React.FC<BubbleProps<IMessage>> = (props: BubbleProps<IMessage>) => {
  const {
    currentMessage,
    nextMessage,
    position,
    containerToNextStyle,
    previousMessage,
    containerToPreviousStyle,
    onQuickReply,
    renderQuickReplySend,
    quickReplyStyle,
    quickReplyTextStyle,
    quickReplyContainerStyle,
    containerStyle,
    wrapperStyle,
    bottomContainerStyle,
  } = props

  const context = useChatContext()

  const onPress = useCallback(() => {
    if (props.onPress)
      props.onPress(context, currentMessage)
  }, [context, props, currentMessage])

  const onLongPress = useCallback(() => {
    const {
      onLongPress,
      optionTitles,
    } = props

    if (onLongPress) {
      onLongPress(context, currentMessage)
      return
    }

    if (!optionTitles?.length)
      return

    const options = optionTitles
    const cancelButtonIndex = options.length - 1

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(context as any).actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex: number) => {
        console.log('onLongPress', { buttonIndex })
      }
    )
  }, [
    currentMessage,
    context,
    props,
  ])

  const styledBubbleToNext = useCallback(() => {
    if (
      currentMessage &&
      nextMessage &&
      position &&
      isSameUser(currentMessage, nextMessage) &&
      isSameDay(currentMessage, nextMessage)
    )
      return [
        styles[position].containerToNext,
        containerToNextStyle?.[position],
      ]

    return null
  }, [
    currentMessage,
    nextMessage,
    position,
    containerToNextStyle,
  ])

  const styledBubbleToPrevious = useCallback(() => {
    if (
      currentMessage &&
      previousMessage &&
      position &&
      isSameUser(currentMessage, previousMessage) &&
      isSameDay(currentMessage, previousMessage)
    )
      return [
        styles[position].containerToPrevious,
        containerToPreviousStyle && containerToPreviousStyle[position],
      ]

    return null
  }, [
    currentMessage,
    previousMessage,
    position,
    containerToPreviousStyle,
  ])

  const renderQuickReplies = useCallback(() => {
    if (currentMessage?.quickReplies) {
      const {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        containerStyle,
        wrapperStyle,
        /* eslint-enable @typescript-eslint/no-unused-vars */
        ...quickReplyProps
      } = props

      if (props.renderQuickReplies)
        return props.renderQuickReplies(quickReplyProps)

      return (
        <QuickReplies
          currentMessage={currentMessage}
          onQuickReply={onQuickReply}
          renderQuickReplySend={renderQuickReplySend}
          quickReplyStyle={quickReplyStyle}
          quickReplyTextStyle={quickReplyTextStyle}
          quickReplyContainerStyle={quickReplyContainerStyle}
          nextMessage={nextMessage}
        />
      )
    }

    return null
  }, [
    currentMessage,
    onQuickReply,
    renderQuickReplySend,
    quickReplyStyle,
    quickReplyTextStyle,
    quickReplyContainerStyle,
    nextMessage,
    props,
  ])

  const renderMessageText = useCallback(() => {
    if (currentMessage?.text) {
      const {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        containerStyle,
        wrapperStyle,
        optionTitles,
        /* eslint-enable @typescript-eslint/no-unused-vars */
        ...messageTextProps
      } = props

      if (props.renderMessageText)
        return props.renderMessageText(messageTextProps)

      return <MessageText {...messageTextProps} />
    }
    return null
  }, [props, currentMessage])

  const renderMessageImage = useCallback(() => {
    if (currentMessage?.image) {
      const {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        containerStyle,
        wrapperStyle,
        /* eslint-enable @typescript-eslint/no-unused-vars */
        ...messageImageProps
      } = props

      if (props.renderMessageImage)
        return props.renderMessageImage(messageImageProps)

      return <MessageImage {...messageImageProps} />
    }
    return null
  }, [props, currentMessage])

  const renderMessageVideo = useCallback(() => {
    if (!currentMessage?.video)
      return null

    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      wrapperStyle,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...messageVideoProps
    } = props

    if (props.renderMessageVideo)
      return props.renderMessageVideo(messageVideoProps)

    return <MessageVideo />
  }, [props, currentMessage])

  const renderMessageAudio = useCallback(() => {
    if (!currentMessage?.audio)
      return null

    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      wrapperStyle,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...messageAudioProps
    } = props

    if (props.renderMessageAudio)
      return props.renderMessageAudio(messageAudioProps)

    return <MessageAudio />
  }, [props, currentMessage])

  const renderTicks = useCallback(() => {
    const {
      renderTicks,
      user,
    } = props

    if (renderTicks && currentMessage)
      return renderTicks(currentMessage)

    if (
      user &&
      currentMessage?.user &&
      currentMessage.user._id !== user._id
    )
      return null

    if (
      currentMessage &&
      (currentMessage.sent || currentMessage.received || currentMessage.pending)
    )
      return (
        <View style={styles.content.tickView}>
          {!!currentMessage.sent && (
            <Text style={[styles.content.tick, props.tickStyle]}>
              {'✓'}
            </Text>
          )}
          {!!currentMessage.received && (
            <Text style={[styles.content.tick, props.tickStyle]}>
              {'✓'}
            </Text>
          )}
          {!!currentMessage.pending && (
            <Text style={[styles.content.tick, props.tickStyle]}>
              {'🕓'}
            </Text>
          )}
        </View>
      )

    return null
  }, [
    props,
    currentMessage,
  ])

  const renderTime = useCallback(() => {
    if (currentMessage?.createdAt) {
      const {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        containerStyle,
        wrapperStyle,
        textStyle,
        /* eslint-enable @typescript-eslint/no-unused-vars */
        ...timeProps
      } = props

      if (props.renderTime)
        return props.renderTime(timeProps)

      return <Time {...timeProps} />
    }
    return null
  }, [props, currentMessage])

  const renderUsername = useCallback(() => {
    const {
      user,
      renderUsername,
    } = props

    if (props.renderUsernameOnMessage && currentMessage) {
      if (user && currentMessage.user._id === user._id)
        return null

      if (renderUsername)
        return renderUsername(currentMessage.user)

      return (
        <View style={styles.content.usernameView}>
          <Text
            style={
              [styles.content.username, props.usernameStyle]
            }
          >
            {'~ '}
            {currentMessage.user.name}
          </Text>
        </View>
      )
    }

    return null
  }, [
    currentMessage,
    props,
  ])

  const renderCustomView = useCallback(() => {
    if (props.renderCustomView)
      return props.renderCustomView(props)

    return null
  }, [props])

  const renderBubbleContent = useCallback(() => {
    return (
      <View>
        {!props.isCustomViewBottom && renderCustomView()}
        {renderMessageImage()}
        {renderMessageVideo()}
        {renderMessageAudio()}
        {renderMessageText()}
        {props.isCustomViewBottom && renderCustomView()}
      </View>
    )
  }, [
    renderCustomView,
    renderMessageImage,
    renderMessageVideo,
    renderMessageAudio,
    renderMessageText,
    props.isCustomViewBottom,
  ])

  return (
    <View
      style={[
        stylesCommon.fill,
        styles[position].container,
        containerStyle && containerStyle[position],
      ]}
    >
      <View
        style={[
          styles[position].wrapper,
          styledBubbleToNext(),
          styledBubbleToPrevious(),
          wrapperStyle && wrapperStyle[position],
        ]}
      >
        <TouchableWithoutFeedback
          onPress={onPress}
          onLongPress={onLongPress}
          accessibilityRole='text'
          {...props.touchableProps}
        >
          <View>
            {renderBubbleContent()}
            <View
              style={[
                styles[position].bottom,
                bottomContainerStyle && bottomContainerStyle[position],
              ]}
            >
              {renderUsername()}
              {renderTime()}
              {renderTicks()}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
      {renderQuickReplies()}
    </View>
  )
}

export default Bubble
