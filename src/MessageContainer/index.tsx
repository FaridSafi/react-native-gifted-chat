import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  View,
  Pressable,
  Text,
  Platform,
  LayoutChangeEvent,
  ListRenderItemInfo,
  FlatList,
  CellRendererProps,
} from 'react-native'
import Animated, { runOnJS, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { ReanimatedScrollEvent } from '../reanimatedCompat'
import DayAnimated from './components/DayAnimated'
import Item from './components/Item'

import { LoadEarlier } from '../LoadEarlier'
import { IMessage } from '../types'
import TypingIndicator from '../TypingIndicator'
import { MessageContainerProps, DaysPositions } from './types'
import { ItemProps } from './components/Item/types'

import { warning } from '../logging'
import stylesCommon from '../styles'
import styles from './styles'
import { isSameDay, useCallbackThrottled } from '../utils'

export * from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as React.ComponentType<any>

function MessageContainer<TMessage extends IMessage = IMessage> (props: MessageContainerProps<TMessage>) {
  const {
    messages = [],
    user,
    isTyping = false,
    renderChatEmpty: renderChatEmptyProp,
    onLoadEarlier,
    inverted = true,
    loadEarlier = false,
    listProps,
    invertibleScrollViewProps,
    extraData,
    isScrollToBottomEnabled = false,
    scrollToBottomOffset = 200,
    alignTop = false,
    scrollToBottomStyle,
    infiniteScroll = false,
    isLoadingEarlier = false,
    renderTypingIndicator: renderTypingIndicatorProp,
    renderFooter: renderFooterProp,
    renderLoadEarlier: renderLoadEarlierProp,
    forwardRef,
    handleOnScroll: handleOnScrollProp,
    scrollToBottomComponent: scrollToBottomComponentProp,
    renderDay: renderDayProp,
  } = props

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

    return <TypingIndicator isTyping={isTyping} />
  }, [isTyping, renderTypingIndicatorProp])

  const ListFooterComponent = useMemo(() => {
    if (renderFooterProp)
      return renderFooterProp(props)

    return renderTypingIndicator()
  }, [renderFooterProp, renderTypingIndicator, props])

  const renderLoadEarlier = useCallback(() => {
    if (loadEarlier) {
      if (renderLoadEarlierProp)
        return renderLoadEarlierProp(props)

      return <LoadEarlier {...props} />
    }

    return null
  }, [loadEarlier, renderLoadEarlierProp, props])

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

    if (inverted)
      scrollTo({ offset: 0, animated })
    else if (forwardRef?.current)
      forwardRef.current.scrollToEnd({ animated })
  }, [forwardRef, inverted, scrollTo, isScrollingDown, changeScrollToBottomVisibility])

  const handleOnScroll = useCallback((event: ReanimatedScrollEvent) => {
    handleOnScrollProp?.(event)

    const {
      contentOffset: { y: contentOffsetY },
      contentSize: { height: contentSizeHeight },
      layoutMeasurement: { height: layoutMeasurementHeight },
    } = event

    isScrollingDown.value =
      (inverted && lastScrolledY.value > contentOffsetY) ||
      (!inverted && lastScrolledY.value < contentOffsetY)

    lastScrolledY.value = contentOffsetY

    if (inverted)
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
  }, [handleOnScrollProp, inverted, scrollToBottomOffset, changeScrollToBottomVisibility, isScrollingDown, lastScrolledY])

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
        (inverted ? messages[index + 1] : messages[index - 1]) || {}
      const nextMessage =
        (inverted ? messages[index - 1] : messages[index + 1]) || {}

      const messageProps: ItemProps<TMessage> = {
        ...restProps,
        currentMessage: messageItem,
        previousMessage,
        nextMessage,
        position: messageItem.user._id === user._id ? 'right' : 'left',
        scrolledY,
        daysPositions,
        listHeight,
      }

      return (
        <Item<TMessage> {...messageProps} />
      )
    }

    return null
  }, [messages, restProps, inverted, scrolledY, daysPositions, listHeight, user])

  const emptyContent = useMemo(() => {
    if (!renderChatEmptyProp)
      return null

    return renderChatEmptyProp()
  }, [renderChatEmptyProp])

  const renderChatEmpty = useCallback(() => {
    if (renderChatEmptyProp)
      return inverted
        ? (
          emptyContent
        )
        : (
          <View style={[stylesCommon.fill, styles.emptyChatContainer]}>
            {emptyContent}
          </View>
        )

    return <View style={stylesCommon.fill} />
  }, [inverted, renderChatEmptyProp, emptyContent])

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
      !inverted &&
      messages?.length &&
      isScrollToBottomEnabled
    )
      setTimeout(() => {
        doScrollToBottom(false)
      }, 500)

    listProps?.onLayout?.(event)
  }, [inverted, messages, doScrollToBottom, listHeight, listProps, isScrollToBottomEnabled])

  const onEndReached = useCallback(() => {
    if (
      infiniteScroll &&
      loadEarlier &&
      onLoadEarlier &&
      !isLoadingEarlier &&
      Platform.OS !== 'web'
    )
      onLoadEarlier()
  }, [infiniteScroll, loadEarlier, onLoadEarlier, isLoadingEarlier])

  const keyExtractor = useCallback((item: unknown) => (item as TMessage)._id.toString(), [])

  const renderCell = useCallback((props: CellRendererProps<unknown>) => {
    const { item, onLayout: onLayoutProp, children } = props
    const id = (item as IMessage)._id.toString()

    const handleOnLayout = (event: LayoutChangeEvent) => {
      onLayoutProp?.(event)

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
          if (isSameDay(newValue.createdAt, item.createdAt) && (inverted ? item.y <= newValue.y : item.y >= newValue.y)) {
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
  }, [daysPositions, inverted])

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrolledY.value = event.contentOffset.y

      runOnJS(handleOnScroll)(event)
    },
  }, [handleOnScroll])

  // removes unrendered days positions when messages are added/removed
  useEffect(() => {
    Object.keys(daysPositions.value).forEach(key => {
      const messageIndex = messages.findIndex(m => m._id.toString() === key)
      let shouldRemove = messageIndex === -1

      if (!shouldRemove) {
        const prevMessage = messages[messageIndex + (inverted ? 1 : -1)]
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
  }, [messages, daysPositions, inverted])

  return (
    <View
      style={[
        styles.contentContainerStyle,
        alignTop ? styles.containerAlignTop : stylesCommon.fill,
      ]}
    >
      <AnimatedFlatList
        extraData={extraData}
        ref={forwardRef}
        keyExtractor={keyExtractor}
        data={messages}
        renderItem={renderItem}
        inverted={inverted}
        automaticallyAdjustContentInsets={false}
        style={stylesCommon.fill}
        {...invertibleScrollViewProps}
        ListEmptyComponent={renderChatEmpty}
        ListFooterComponent={
          inverted ? ListHeaderComponent : ListFooterComponent
        }
        ListHeaderComponent={
          inverted ? ListFooterComponent : ListHeaderComponent
        }
        onScroll={scrollHandler}
        scrollEventThrottle={1}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        {...listProps}
        onLayout={onLayoutList}
        CellRendererComponent={renderCell}
      />
      <ScrollToBottomWrapper />
      <DayAnimated
        scrolledY={scrolledY}
        daysPositions={daysPositions}
        listHeight={listHeight}
        renderDay={renderDayProp}
        messages={messages}
        isLoadingEarlier={isLoadingEarlier}
      />
    </View>
  )
}

export default MessageContainer
