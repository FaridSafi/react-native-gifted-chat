import React, { useCallback, useMemo } from 'react'
import {
  View,
  Pressable,
} from 'react-native'

import { Text } from 'react-native-gesture-handler'
import { useChatContext } from '../GiftedChatContext'
import { MessageAudio } from '../MessageAudio'
import { MessageImage } from '../MessageImage'
import { MessageReply } from '../MessageReply'
import { MessageText } from '../MessageText'
import { MessageVideo } from '../MessageVideo'
import { IMessage } from '../Models'
import { QuickReplies } from '../QuickReplies'

import { getStyleWithPosition } from '../styles'
import { Time } from '../Time'

import { isSameUser, isSameDay, renderComponentOrElement } from '../utils'
import styles from './styles'
import { BubbleProps, RenderMessageTextProps } from './types'

export * from './types'

export const Bubble = <TMessage extends IMessage = IMessage>(props: BubbleProps<TMessage>): React.ReactElement => {
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
    onPressMessage: onPressMessageProp,
    onLongPressMessage: onLongPressMessageProp,
  } = props

  const context = useChatContext()

  const onPress = useCallback(() => {
    onPressMessageProp?.(context, currentMessage)
  }, [onPressMessageProp, context, currentMessage])

  const onLongPress = useCallback(() => {
    onLongPressMessageProp?.(context, currentMessage)
  }, [
    currentMessage,
    context,
    onLongPressMessageProp,
  ])

  const styledBubbleToNext = useMemo(() => {
    if (
      currentMessage &&
      nextMessage &&
      position &&
      isSameUser(currentMessage, nextMessage) &&
      isSameDay(currentMessage, nextMessage)
    )
      return [
        getStyleWithPosition(styles, 'containerToNext', position),
        containerToNextStyle?.[position],
      ]

    return null
  }, [
    currentMessage,
    nextMessage,
    position,
    containerToNextStyle,
  ])

  const styledBubbleToPrevious = useMemo(() => {
    if (
      currentMessage &&
      previousMessage &&
      position &&
      isSameUser(currentMessage, previousMessage) &&
      isSameDay(currentMessage, previousMessage)
    )
      return [
        getStyleWithPosition(styles, 'containerToPrevious', position),
        containerToPreviousStyle?.[position],
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
        return renderComponentOrElement(props.renderQuickReplies, quickReplyProps)

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
        messageTextProps,
        /* eslint-enable @typescript-eslint/no-unused-vars */
        ...messageTextPropsRest
      } = props

      const combinedProps = {
        ...messageTextPropsRest,
        ...messageTextProps,
      } as RenderMessageTextProps<TMessage>

      if (props.renderMessageText)
        return renderComponentOrElement(props.renderMessageText, combinedProps)

      return <MessageText {...combinedProps as any} />
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
        return renderComponentOrElement(props.renderMessageImage, messageImageProps)

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
      return renderComponentOrElement(props.renderMessageVideo, messageVideoProps)

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
      return renderComponentOrElement(props.renderMessageAudio, messageAudioProps)

    return <MessageAudio />
  }, [props, currentMessage])

  const renderTicks = useCallback(() => {
    const {
      renderTicks,
      user,
    } = props

    if (renderTicks && currentMessage)
      return renderComponentOrElement(renderTicks, currentMessage)

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
        <View style={styles.messageStatusContainer}>
          {!!currentMessage.sent && (
            <Text style={[styles.messageStatus, props.tickStyle]}>
              {'✓'}
            </Text>
          )}
          {!!currentMessage.received && (
            <Text style={[styles.messageStatus, props.tickStyle]}>
              {'✓'}
            </Text>
          )}
          {!!currentMessage.pending && (
            <Text style={[styles.messageStatus, props.tickStyle]}>
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
        return renderComponentOrElement(props.renderTime, timeProps)

      return <Time {...timeProps} />
    }

    return null
  }, [props, currentMessage])

  const renderUsername = useCallback(() => {
    const {
      user,
      renderUsername,
    } = props

    if (props.isUsernameVisible && currentMessage) {
      if (user && currentMessage.user._id === user._id)
        return null

      if (renderUsername)
        return renderComponentOrElement(renderUsername, currentMessage.user)

      return (
        <View style={styles.usernameContainer}>
          <Text
            style={[styles.username, props.usernameStyle]}
          >
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
      return renderComponentOrElement(props.renderCustomView, props)

    return null
  }, [props])

  const renderMessageReply = useCallback(() => {
    if (!currentMessage?.replyMessage)
      return null

    const messageReplyProps = {
      currentMessage,
      position,
      onPress: props.onPressMessageReply,
      containerStyle: props.messageReplyContainerStyle,
      contentContainerStyle: props.messageReplyContentContainerStyle,
      imageStyle: props.messageReplyImageStyle,
      usernameStyle: props.messageReplyUsernameStyle,
      textStyle: props.messageReplyTextStyle,
    }

    if (props.renderMessageReply)
      return renderComponentOrElement(props.renderMessageReply, messageReplyProps)

    return <MessageReply {...messageReplyProps} />
  }, [
    props.renderMessageReply,
    props.onPressMessageReply,
    props.messageReplyContainerStyle,
    props.messageReplyContentContainerStyle,
    props.messageReplyImageStyle,
    props.messageReplyUsernameStyle,
    props.messageReplyTextStyle,
    currentMessage,
    position,
  ])

  const renderBubbleContent = useCallback(() => {
    return (
      <>
        {!props.isCustomViewBottom && renderCustomView()}
        {renderMessageReply()}
        {renderMessageImage()}
        {renderMessageVideo()}
        {renderMessageAudio()}
        {renderMessageText()}
        {props.isCustomViewBottom && renderCustomView()}
      </>
    )
  }, [
    renderMessageReply,
    renderCustomView,
    renderMessageImage,
    renderMessageVideo,
    renderMessageAudio,
    renderMessageText,
    props.isCustomViewBottom,
  ])

  return (
    <View style={containerStyle?.[position]}>
      <View
        style={[
          getStyleWithPosition(styles, 'wrapper', position),
          styledBubbleToNext,
          styledBubbleToPrevious,
          wrapperStyle?.[position],
        ]}
      >
        <Pressable
          onPress={onPress}
          onLongPress={onLongPress}
          {...props.touchableProps}
        >
          {renderBubbleContent()}
          <View
            style={[
              styles.bottom,
              bottomContainerStyle?.[position],
            ]}
          >
            {renderUsername()}
            <View style={styles.messageTimeAndStatusContainer}>
              {renderTime()}
              {renderTicks()}
            </View>
          </View>
        </Pressable>
      </View>
      {renderQuickReplies()}
    </View>
  )
}
