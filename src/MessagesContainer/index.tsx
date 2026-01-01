import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  View,
  LayoutChangeEvent,
  ListRenderItemInfo,
  CellRendererProps,
} from 'react-native'
import { Pressable, Text } from 'react-native-gesture-handler'
import Animated, { runOnJS, ScrollEvent, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { LoadEarlierMessages } from '../LoadEarlierMessages'
import { warning } from '../logging'
import { IMessage } from '../Models'
import stylesCommon from '../styles'
import { TypingIndicator } from '../TypingIndicator'
import { isSameDay, useCallbackThrottled } from '../utils'
import { DayAnimated } from './components/DayAnimated'

import { Item } from './components/Item'
import { ItemProps } from './components/Item/types'
import styles from './styles'
import { MessagesContainerProps, DaysPositions } from './types'

export * from './types'

export const MessagesContainer = <TMessage extends IMessage>(props: MessagesContainerProps<TMessage>) => {
  const {
    messages = [],
    user,
    isTyping = false,
    renderChatEmpty: renderChatEmptyProp,
    isInverted = true,
    listProps,
    isScrollToBottomEnabled = false,
    scrollToBottomOffset = 200,
    isAlignedTop = false,
    scrollToBottomStyle,
    loadEarlierMessagesProps,
    renderTypingIndicator: renderTypingIndicatorProp,
    renderFooter: renderFooterProp,
    renderLoadEarlier: renderLoadEarlierProp,
    forwardRef,
    scrollToBottomComponent: scrollToBottomComponentProp,
    renderDay: renderDayProp,
    isDayAnimationEnabled = true,
  } = props

  const listPropsOnScrollProp = listProps?.onScroll

  const scrollToBottomOpacity = useSharedValue(0)
  const isScrollingDown = useSharedValue(false)
  const lastScrolledY = useSharedValue(0)
  const [isScrollToBottomVisible, setIsScrollToBottomVisible] = useState(false)
  const scrollToBottomStyleAnim = useAnimatedStyle(() => ({
    opacity: scrollToBottomOpacity.value,
  }), [scrollToBottomOpacity])

  const daysPositions = useSharedValue<DaysPositions>({})
  const listHeight = useSharedValue(0)
  const scrolledY = useSharedValue(0)

  const renderTypingIndicator = useCallback(() => {
    if (renderTypingIndicatorProp)
      return renderTypingIndicatorProp()

    return <TypingIndicator isTyping={isTyping} style={props.typingIndicatorStyle} />
  }, [isTyping, renderTypingIndicatorProp, props.typingIndicatorStyle])

  const ListFooterComponent = useMemo(() => {
    if (renderFooterProp)
      return renderFooterProp(props)

    return renderTypingIndicator()
  }, [renderFooterProp, renderTypingIndicator, props])

  const renderLoadEarlier = useCallback(() => {
    if (loadEarlierMessagesProps?.isAvailable) {
      if (renderLoadEarlierProp)
        return renderLoadEarlierProp(loadEarlierMessagesProps)

      return <LoadEarlierMessages {...loadEarlierMessagesProps} />
    }

    return null
  }, [loadEarlierMessagesProps, renderLoadEarlierProp])

  const changeScrollToBottomVisibility: (isVisible: boolean) => void = useCallbackThrottled((isVisible: boolean) => {
    if (isScrollingDown.value && isVisible)
      return

    if (isVisible)
      setIsScrollToBottomVisible(true)

    scrollToBottomOpacity.value = withTiming(isVisible ? 1 : 0, { duration: 250 }, isFinished => {
      if (isFinished && !isVisible)
        runOnJS(setIsScrollToBottomVisible)(false)
    })
  }, [scrollToBottomOpacity, isScrollingDown], 50)

  const scrollTo = useCallback((options: { animated?: boolean, offset: number }) => {
    if (options)
      forwardRef?.current?.scrollToOffset(options)
  }, [forwardRef])

  const doScrollToBottom = useCallback((animated: boolean = true) => {
    isScrollingDown.value = true
    changeScrollToBottomVisibility(false)

    if (isInverted)
      scrollTo({ offset: 0, animated })
    else if (forwardRef?.current)
      forwardRef.current.scrollToEnd({ animated })
  }, [forwardRef, isInverted, scrollTo, isScrollingDown, changeScrollToBottomVisibility])

  const handleOnScroll = useCallback((event: ScrollEvent) => {
    listPropsOnScrollProp?.(event)

    const {
      contentOffset: { y: contentOffsetY },
      contentSize: { height: contentSizeHeight },
      layoutMeasurement: { height: layoutMeasurementHeight },
    } = event

    isScrollingDown.value =
      (isInverted && lastScrolledY.value > contentOffsetY) ||
      (!isInverted && lastScrolledY.value < contentOffsetY)

    lastScrolledY.value = contentOffsetY

    if (isInverted)
      if (contentOffsetY > scrollToBottomOffset!)
        changeScrollToBottomVisibility(true)
      else
        changeScrollToBottomVisibility(false)
    else if (
      contentOffsetY < scrollToBottomOffset! &&
      contentSizeHeight - layoutMeasurementHeight > scrollToBottomOffset!
    )
      changeScrollToBottomVisibility(false)
    else
      changeScrollToBottomVisibility(false)
  }, [isInverted, scrollToBottomOffset, changeScrollToBottomVisibility, isScrollingDown, lastScrolledY, listPropsOnScrollProp])

  const restProps = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { messages: _, ...rest } = props
    return rest
  }, [props])

  const renderItem = useCallback(({ item, index }: ListRenderItemInfo<unknown>): React.ReactElement | null => {
    const messageItem = item as TMessage

    if (!messageItem._id && messageItem._id !== 0)
      warning('GiftedChat: `_id` is missing for message', JSON.stringify(item))

    if (!messageItem.user) {
      if (!messageItem.system)
        warning(
          'GiftedChat: `user` is missing for message',
          JSON.stringify(messageItem)
        )

      messageItem.user = { _id: 0 }
    }

    if (messages && user) {
      const previousMessage =
        (isInverted ? messages[index + 1] : messages[index - 1]) || {}
      const nextMessage =
        (isInverted ? messages[index - 1] : messages[index + 1]) || {}

      const messageProps: ItemProps<TMessage> = {
        ...restProps,
        currentMessage: messageItem,
        previousMessage,
        nextMessage,
        position: messageItem.user._id === user._id ? 'right' : 'left',
        scrolledY,
        daysPositions,
        listHeight,
        isDayAnimationEnabled,
      }

      return (
        <Item<TMessage> {...messageProps} />
      )
    }

    return null
  }, [messages, restProps, isInverted, scrolledY, daysPositions, listHeight, isDayAnimationEnabled, user])

  const emptyContent = useMemo(() => {
    if (!renderChatEmptyProp)
      return null

    return renderChatEmptyProp()
  }, [renderChatEmptyProp])

  const renderChatEmpty = useCallback(() => {
    if (renderChatEmptyProp)
      return isInverted
        ? (
          emptyContent
        )
        : (
          <View style={[stylesCommon.fill, styles.emptyChatContainer]}>
            {emptyContent}
          </View>
        )

    return <View style={stylesCommon.fill} />
  }, [isInverted, renderChatEmptyProp, emptyContent])

  const ListHeaderComponent = useMemo(() => {
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

  const handleScrollToBottomPress = useCallback(() => {
    doScrollToBottom()
  }, [doScrollToBottom])

  const scrollToBottomContent = useMemo(() => {
    return (
      <Animated.View
        style={[
          stylesCommon.centerItems,
          styles.scrollToBottomContent,
          scrollToBottomStyle,
          scrollToBottomStyleAnim,
        ]}
      >
        {renderScrollBottomComponent()}
      </Animated.View>
    )
  }, [scrollToBottomStyle, scrollToBottomStyleAnim, renderScrollBottomComponent])

  const ScrollToBottomWrapper = useCallback(() => {
    if (!isScrollToBottomEnabled)
      return null

    if (!isScrollToBottomVisible)
      return null

    return (
      <Pressable
        style={styles.scrollToBottom}
        onPress={handleScrollToBottomPress}
      >
        {scrollToBottomContent}
      </Pressable>
    )
  }, [isScrollToBottomEnabled, isScrollToBottomVisible, handleScrollToBottomPress, scrollToBottomContent])

  const onLayoutList = useCallback((event: LayoutChangeEvent) => {
    listHeight.value = event.nativeEvent.layout.height

    if (
      !isInverted &&
      messages?.length &&
      isScrollToBottomEnabled
    )
      setTimeout(() => {
        doScrollToBottom(false)
      }, 500)

    listProps?.onLayout?.(event)
  }, [isInverted, messages, doScrollToBottom, listHeight, listProps, isScrollToBottomEnabled])

  const onEndReached = useCallback(() => {
    if (
      loadEarlierMessagesProps &&
      loadEarlierMessagesProps.isAvailable &&
      loadEarlierMessagesProps.isInfiniteScrollEnabled &&
      !loadEarlierMessagesProps.isLoading
    )
      loadEarlierMessagesProps.onPress()
  }, [loadEarlierMessagesProps])

  const keyExtractor = useCallback((item: unknown) => (item as TMessage)._id.toString(), [])

  const renderCell = useCallback((props: CellRendererProps<unknown>) => {
    const { item, onLayout: onLayoutProp, children } = props
    const id = (item as IMessage)._id.toString()

    const handleOnLayout = (event: LayoutChangeEvent) => {
      onLayoutProp?.(event)

      // Only track positions when day animation is enabled
      if (!isDayAnimationEnabled)
        return

      const { y, height } = event.nativeEvent.layout

      const newValue = {
        y,
        height,
        createdAt: new Date((item as IMessage).createdAt).getTime(),
      }

      daysPositions.modify(value => {
        'worklet'

        const isSameDay = (date1: number, date2: number) => {
          const d1 = new Date(date1)
          const d2 = new Date(date2)

          return (
            d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear()
          )
        }

        for (const [key, item] of Object.entries(value))
          if (isSameDay(newValue.createdAt, item.createdAt) && (isInverted ? item.y <= newValue.y : item.y >= newValue.y)) {
            delete value[key]
            break
          }

        // @ts-expect-error: https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue#remarks
        value[id] = newValue
        return value
      })
    }

    return (
      <View
        {...props}
        onLayout={handleOnLayout}
      >
        {children}
      </View>
    )
  }, [daysPositions, isInverted, isDayAnimationEnabled])

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrolledY.value = event.contentOffset.y

      runOnJS(handleOnScroll)(event)
    },
  }, [handleOnScroll])

  // removes unrendered days positions when messages are added/removed
  useEffect(() => {
    // Skip cleanup when day animation is disabled
    if (!isDayAnimationEnabled)
      return

    Object.keys(daysPositions.value).forEach(key => {
      const messageIndex = messages.findIndex(m => m._id.toString() === key)
      let shouldRemove = messageIndex === -1

      if (!shouldRemove) {
        const prevMessage = messages[messageIndex + (isInverted ? 1 : -1)]
        const message = messages[messageIndex]
        shouldRemove = !!prevMessage && isSameDay(message, prevMessage)
      }

      if (shouldRemove)
        daysPositions.modify(value => {
          'worklet'

          delete value[key]
          return value
        })
    })
  }, [messages, daysPositions, isInverted, isDayAnimationEnabled])

  return (
    <View
      style={[
        styles.contentContainerStyle,
        isAlignedTop ? styles.containerAlignTop : stylesCommon.fill,
      ]}
    >
      <Animated.FlatList
        ref={forwardRef}
        keyExtractor={keyExtractor}
        data={messages}
        renderItem={renderItem}
        inverted={isInverted}
        automaticallyAdjustContentInsets={false}
        style={stylesCommon.fill}
        contentContainerStyle={styles.messagesContainer}
        ListEmptyComponent={renderChatEmpty}
        ListFooterComponent={
          isInverted ? ListHeaderComponent : ListFooterComponent
        }
        ListHeaderComponent={
          isInverted ? ListFooterComponent : ListHeaderComponent
        }
        scrollEventThrottle={1}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        keyboardDismissMode='interactive'
        keyboardShouldPersistTaps='handled'
        {...listProps}
        onScroll={scrollHandler}
        onLayout={onLayoutList}
        CellRendererComponent={renderCell}
      />
      <ScrollToBottomWrapper />
      {isDayAnimationEnabled && (
        <DayAnimated
          scrolledY={scrolledY}
          daysPositions={daysPositions}
          listHeight={listHeight}
          renderDay={renderDayProp}
          messages={messages}
          isLoading={loadEarlierMessagesProps?.isLoading ?? false}
        />
      )}
    </View>
  )
}
