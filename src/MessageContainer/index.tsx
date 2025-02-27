import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  LayoutChangeEvent,
  ListRenderItemInfo,
  FlatList,
  CellRendererProps,
} from 'react-native'
import Animated, { runOnJS, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { ReanimatedScrollEvent } from 'react-native-reanimated/lib/typescript/hook/commonTypes'
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
import { isSameDay } from '../utils'

export * from './types'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

function MessageContainer<TMessage extends IMessage = IMessage> (props: MessageContainerProps<TMessage>) {
  const {
    messages = [],
    user,
    isTyping = false,
    renderChatEmpty: renderChatEmptyProp,
    onLoadEarlier,
    inverted = true,
    loadEarlier = false,
    listViewProps,
    invertibleScrollViewProps,
    extraData = null,
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
  } = props

  const scrollToBottomOpacity = useSharedValue(0)
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
      return <>{renderFooterProp(props)}</>

    return <>{renderTypingIndicator()}</>
  }, [renderFooterProp, renderTypingIndicator, props])

  const renderLoadEarlier = useCallback(() => {
    if (loadEarlier) {
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

    const duration = 250

    const makeScrollToBottomVisible = () => {
      setIsScrollToBottomVisible(true)
      scrollToBottomOpacity.value = withTiming(1, { duration })
    }

    const makeScrollToBottomHidden = () => {
      scrollToBottomOpacity.value = withTiming(0, { duration }, isFinished => {
        if (isFinished)
          runOnJS(setIsScrollToBottomVisible)(false)
      })
    }

    if (inverted)
      if (contentOffsetY > scrollToBottomOffset!)
        makeScrollToBottomVisible()
      else
        makeScrollToBottomHidden()
    else if (
      contentOffsetY < scrollToBottomOffset! &&
      contentSizeHeight - layoutMeasurementHeight > scrollToBottomOffset!
    )
      makeScrollToBottomVisible()
    else
      makeScrollToBottomHidden()
  }, [handleOnScrollProp, inverted, scrollToBottomOffset, scrollToBottomOpacity])

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

    const { messages, ...restProps } = props

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
  }, [props, inverted, scrolledY, daysPositions, listHeight, user])

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

  const renderScrollToBottomWrapper = useCallback(() => {
    if (!isScrollToBottomVisible)
      return null

    return (
      <Animated.View
        style={[
          stylesCommon.centerItems,
          styles.scrollToBottomStyle,
          scrollToBottomStyle,
          scrollToBottomStyleAnim,
        ]}
      >
        <TouchableOpacity
          onPress={() => doScrollToBottom()}
          hitSlop={{ top: 5, left: 5, right: 5, bottom: 5 }}
        >
          {renderScrollBottomComponent()}
        </TouchableOpacity>
      </Animated.View>
    )
  }, [scrollToBottomStyle, renderScrollBottomComponent, doScrollToBottom, scrollToBottomStyleAnim, isScrollToBottomVisible])

  const onLayoutList = useCallback((event: LayoutChangeEvent) => {
    listHeight.value = event.nativeEvent.layout.height

    if (
      !inverted &&
      messages?.length
    )
      setTimeout(() => {
        doScrollToBottom(false)
      }, 500)

    listViewProps?.onLayout?.(event)
  }, [inverted, messages, doScrollToBottom, listHeight, listViewProps])

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
    const handleOnLayout = (event: LayoutChangeEvent) => {
      const prevMessage = messages[props.index + (inverted ? 1 : -1)]
      if (prevMessage && isSameDay(props.item as IMessage, prevMessage))
        return

      const { y, height } = event.nativeEvent.layout

      const newValue = {
        y,
        height,
        createdAt: new Date((props.item as IMessage).createdAt).getTime(),
      }

      daysPositions.modify(value => {
        'worklet'

        // @ts-expect-error: https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue#remarks
        value[props.item._id] = newValue
        return value
      })
    }

    return (
      <Animated.View
        {...props}
        onLayout={handleOnLayout}
      />
    )
  }, [daysPositions, messages, inverted])

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrolledY.value = event.contentOffset.y

      runOnJS(handleOnScroll)(event)
    },
  }, [handleOnScroll])

  // removes unrendered days positions when messages are added/removed
  useEffect(() => {
    Object.keys(daysPositions.value).forEach(key => {
      const messageIndex = messages.findIndex(m => m._id === key)
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
        ref={forwardRef as React.Ref<FlatList<unknown>>}
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
          inverted ? ListHeaderComponent : ListFooterComponent
        }
        ListHeaderComponent={
          inverted ? ListFooterComponent : ListHeaderComponent
        }
        onScroll={scrollHandler}
        scrollEventThrottle={1}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        {...listViewProps}
        onLayout={onLayoutList}
        CellRendererComponent={renderCell}
      />
      {isScrollToBottomEnabled
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
