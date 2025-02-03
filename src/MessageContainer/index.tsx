import React, { useCallback, useState } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  ListRenderItemInfo,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native'
import { FlashList } from '@shopify/flash-list'

import { LoadEarlier } from '../LoadEarlier'
import Message from '../Message'
import { IMessage } from '../Models'
import TypingIndicator from '../TypingIndicator'
import { MessageContainerProps } from './types'

import { warning } from '../logging'
import styles from './styles'

export * from './types'

function MessageContainer<TMessage extends IMessage = IMessage> (props: MessageContainerProps<TMessage>) {
  const {
    messages = [],
    user = {},
    isTyping = false,
    renderChatEmpty: renderChatEmptyProp,
    renderMessage: renderMessageProp,
    onLoadEarlier,
    inverted = true,
    loadEarlier = false,
    listViewProps = {},
    invertibleScrollViewProps = {},
    extraData = null,
    scrollToBottom = false,
    scrollToBottomOffset = 200,
    alignTop = false,
    scrollToBottomStyle = {},
    infiniteScroll = false,
    isLoadingEarlier = false,
    renderTypingIndicator: renderTypingIndicatorProp,
    renderFooter: renderFooterProp,
    renderLoadEarlier: renderLoadEarlierProp,
    forwardRef,
    handleOnScroll: handleOnScrollProp,
    scrollToBottomComponent: scrollToBottomComponentProp
  } = props

  const [isScrollToBottomVisible, setIsScrollToBottomVisible] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  const renderTypingIndicator = useCallback(() => {
    if (renderTypingIndicatorProp)
      return renderTypingIndicatorProp()

    return <TypingIndicator isTyping={isTyping || false} />
  }, [isTyping, renderTypingIndicatorProp])

  const renderFooter = useCallback(() => {
    if (renderFooterProp)
      return renderFooterProp(props)

    return renderTypingIndicator()
  }, [renderFooterProp, renderTypingIndicator, props])

  const renderLoadEarlier = useCallback(() => {
    if (loadEarlier === true) {
      if (renderLoadEarlierProp)
        return renderLoadEarlierProp(props)

      return <LoadEarlier {...props} />
    }

    return null
  }, [loadEarlier, renderLoadEarlierProp, props])

  const scrollTo = useCallback((options: { animated?: boolean, offset: number }) => {
    if (forwardRef?.current && options)
      forwardRef.current.scrollToOffset(options)
  }, [forwardRef])

  const doScrollToBottom = useCallback((animated: boolean = true) => {
    if (inverted)
      scrollTo({ offset: 0, animated })
    else if (forwardRef?.current)
      forwardRef.current.scrollToEnd({ animated })
  }, [forwardRef, inverted, scrollTo])

  const handleOnScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    handleOnScrollProp?.(event)

    const {
      nativeEvent: {
        contentOffset: { y: contentOffsetY },
        contentSize: { height: contentSizeHeight },
        layoutMeasurement: { height: layoutMeasurementHeight },
      },
    } = event

    if (inverted)
      if (contentOffsetY > scrollToBottomOffset!)
        setIsScrollToBottomVisible(true)
      else
        setIsScrollToBottomVisible(false)
    else if (
      contentOffsetY < scrollToBottomOffset! &&
      contentSizeHeight - layoutMeasurementHeight > scrollToBottomOffset!
    )
      setIsScrollToBottomVisible(true)
    else
      setIsScrollToBottomVisible(false)

    setHasScrolled(true)
  }, [handleOnScrollProp, inverted, scrollToBottomOffset])

  const renderRow = useCallback(({ item, index }: ListRenderItemInfo<TMessage>): React.ReactElement | null => {
    if (!item._id && item._id !== 0)
      warning('GiftedChat: `_id` is missing for message', JSON.stringify(item))

    if (!item.user) {
      if (!item.system)
        warning(
          'GiftedChat: `user` is missing for message',
          JSON.stringify(item)
        )

      item.user = { _id: 0 }
    }

    const { messages, ...restProps } = props

    if (messages && user) {
      const previousMessage =
        (inverted ? messages[index + 1] : messages[index - 1]) || {}
      const nextMessage =
        (inverted ? messages[index - 1] : messages[index + 1]) || {}

      const messageProps: Message['props'] = {
        ...restProps,
        currentMessage: item,
        previousMessage,
        nextMessage,
        position: item.user._id === user._id ? 'right' : 'left',
      }

      if (renderMessageProp)
        return renderMessageProp(messageProps)

      return (
        <Message
          key={item._id.toString()}
          {...messageProps}
        />
      )
    }
    return null
  }, [props, renderMessageProp, user, inverted])

  const renderChatEmpty = useCallback(() => {
    if (renderChatEmptyProp)
      return inverted
        ? (
          renderChatEmptyProp()
        )
        : (
          <View style={styles.emptyChatContainer}>
            {renderChatEmptyProp()}
          </View>
        )

    return <View style={styles.container} />
  }, [inverted, renderChatEmptyProp])

  const renderHeaderWrapper = useCallback(() => (
    <View style={styles.headerWrapper}>{renderLoadEarlier()}</View>
  ), [renderLoadEarlier])

  const renderScrollBottomComponent = useCallback(() => {
    if (scrollToBottomComponentProp)
      return scrollToBottomComponentProp()

    return <Text>{'V'}</Text>
  }, [scrollToBottomComponentProp])

  const renderScrollToBottomWrapper = useCallback(() => {
    return (
      <View style={[styles.scrollToBottomStyle, scrollToBottomStyle]}>
        <TouchableOpacity
          onPress={() => doScrollToBottom()}
          hitSlop={{ top: 5, left: 5, right: 5, bottom: 5 }}
        >
          {renderScrollBottomComponent()}
        </TouchableOpacity>
      </View>
    )
  }, [scrollToBottomStyle, renderScrollBottomComponent, doScrollToBottom])

  const onLayoutList = useCallback(() => {
    if (
      !inverted &&
      messages?.length
    )
      setTimeout(
        () => doScrollToBottom(false),
        15 * messages.length
      )
  }, [inverted, messages, doScrollToBottom])

  const onEndReached = useCallback(() => {
    if (
      infiniteScroll &&
      hasScrolled &&
      loadEarlier &&
      onLoadEarlier &&
      !isLoadingEarlier &&
      Platform.OS !== 'web'
    )
      onLoadEarlier()
  }, [hasScrolled, infiniteScroll, loadEarlier, onLoadEarlier, isLoadingEarlier])

  const keyExtractor = useCallback((item: TMessage) => `${item._id}`, [])

  return (
    <View
      style={
        alignTop ? styles.containerAlignTop : styles.container
      }
    >
      <FlashList
        ref={forwardRef}
        extraData={[extraData, isTyping]}
        keyExtractor={keyExtractor}
        automaticallyAdjustContentInsets={false}
        inverted={inverted}
        data={messages}
        style={styles.listStyle}
        contentContainerStyle={styles.contentContainerStyle}
        renderItem={renderRow}
        {...invertibleScrollViewProps}
        ListEmptyComponent={renderChatEmpty}
        ListFooterComponent={
          inverted ? renderHeaderWrapper : renderFooter
        }
        ListHeaderComponent={
          inverted ? renderFooter : renderHeaderWrapper
        }
        onScroll={handleOnScroll}
        scrollEventThrottle={100}
        onLayout={onLayoutList}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        {...listViewProps}
      />
      {isScrollToBottomVisible && scrollToBottom
        ? renderScrollToBottomWrapper()
        : null}
    </View>
  )
}

export default MessageContainer
