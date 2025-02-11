import React, { useCallback, useState } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import Animated, { runOnJS, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { ReanimatedScrollEvent } from 'react-native-reanimated/lib/typescript/hook/commonTypes'
import DayAnimated from './components/DayAnimated'
import Item from './components/Item'

import { LoadEarlier } from '../LoadEarlier'
import { IMessage } from '../Models'
import TypingIndicator from '../TypingIndicator'
import { MessageContainerProps, DaysPositions } from './types'

import { warning } from '../logging'
import stylesCommon from '../styles'
import styles from './styles'

export * from './types'

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList)

function MessageContainer<TMessage extends IMessage = IMessage> (props: MessageContainerProps<TMessage>) {
  const {
    messages = [],
    user = {},
    isTyping = false,
    renderChatEmpty: renderChatEmptyProp,
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
    scrollToBottomComponent: scrollToBottomComponentProp,
  } = props

  const [isScrollToBottomVisible, setIsScrollToBottomVisible] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  const daysPositions = useSharedValue<DaysPositions>({})
  const listHeight = useSharedValue(0)
  const scrolledY = useSharedValue(0)

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

  const handleOnScroll = useCallback((event: ReanimatedScrollEvent) => {
    handleOnScrollProp?.(event)

    const {
      contentOffset: { y: contentOffsetY },
      contentSize: { height: contentSizeHeight },
      layoutMeasurement: { height: layoutMeasurementHeight },
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

  const handleLayoutDayWrapper = useCallback((ref: any, id: string | number, createdAt: number) => {
    setTimeout(() => { // do not delete "setTimeout". It's necessary for get correct layout.
      const itemLayout = forwardRef?.current?.recyclerlistview_unsafe?.getLayout(messages.findIndex(m => m._id === id))

      if (ref && itemLayout) {
        daysPositions.value = {
          ...daysPositions.value,
          [id]: {
            ...itemLayout,
            createdAt,
          },
        }
      } else if (daysPositions.value[id] != null) {
        const nextDaysPositions = { ...daysPositions.value }
        delete nextDaysPositions[id]
        daysPositions.value = nextDaysPositions
      }
    }, 100)
  }, [messages, daysPositions, forwardRef])

  const renderItem = useCallback(({ item, index }: ListRenderItemInfo<TMessage>): React.ReactElement | null => {
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

      return (
        <Item
          {...messageProps}
          onRefDayWrapper={handleLayoutDayWrapper}
          scrolledY={scrolledY}
          daysPositions={daysPositions}
          listHeight={listHeight}
        />
      )
    }

    return null
  }, [props, user, inverted, handleLayoutDayWrapper, scrolledY, daysPositions, listHeight])

  const renderChatEmpty = useCallback(() => {
    if (renderChatEmptyProp)
      return inverted
        ? (
          renderChatEmptyProp()
        )
        : (
          <View style={[stylesCommon.fill, styles.emptyChatContainer]}>
            {renderChatEmptyProp()}
          </View>
        )

    return <View style={stylesCommon.fill} />
  }, [inverted, renderChatEmptyProp])

  const renderHeaderWrapper = useCallback(() => {
    const content = renderLoadEarlier()

    if (!content)
      return null

    return (
      <View style={stylesCommon.fill}>{content}</View>
    )
  }, [renderLoadEarlier])

  const renderScrollBottomComponent = useCallback(() => {
    if (scrollToBottomComponentProp)
      return scrollToBottomComponentProp()

    return <Text>{'V'}</Text>
  }, [scrollToBottomComponentProp])

  const renderScrollToBottomWrapper = useCallback(() => {
    return (
      <View style={[stylesCommon.centerItems, styles.scrollToBottomStyle, scrollToBottomStyle]}>
        <TouchableOpacity
          onPress={() => doScrollToBottom()}
          hitSlop={{ top: 5, left: 5, right: 5, bottom: 5 }}
        >
          {renderScrollBottomComponent()}
        </TouchableOpacity>
      </View>
    )
  }, [scrollToBottomStyle, renderScrollBottomComponent, doScrollToBottom])

  const onLayoutList = useCallback(({ nativeEvent }) => {
    listHeight.value = nativeEvent.layout.height

    if (
      !inverted &&
      messages?.length
    )
      setTimeout(() => {
        doScrollToBottom(false)
      }, 500)

    listViewProps?.onLayout?.(nativeEvent)
  }, [inverted, messages, doScrollToBottom, listHeight, listViewProps])

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

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrolledY.value = event.contentOffset.y

      runOnJS(handleOnScroll)(event)
    },
  }, [handleOnScroll])

  return (
    <View
      style={[
        styles.contentContainerStyle,
        alignTop ? styles.containerAlignTop : stylesCommon.fill,
      ]}
    >
      <AnimatedFlashList
        ref={forwardRef}
        extraData={[extraData, isTyping]}
        keyExtractor={keyExtractor}
        automaticallyAdjustContentInsets={false}
        inverted={inverted}
        data={messages}
        style={stylesCommon.fill}
        renderItem={renderItem}
        {...invertibleScrollViewProps}
        ListEmptyComponent={renderChatEmpty}
        ListFooterComponent={
          inverted ? renderHeaderWrapper : renderFooter
        }
        ListHeaderComponent={
          inverted ? renderFooter : renderHeaderWrapper
        }
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        estimatedItemSize={100}
        {...listViewProps}
        onLayout={onLayoutList}
      />
      {isScrollToBottomVisible && scrollToBottom
        ? renderScrollToBottomWrapper()
        : null}
      <DayAnimated
        scrolledY={scrolledY}
        daysPositions={daysPositions}
        listHeight={listHeight}
        messages={messages}
        isLoadingEarlier={isLoadingEarlier}
      />
    </View>
  )
}

export default MessageContainer
