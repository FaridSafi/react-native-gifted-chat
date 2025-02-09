import React, { forwardRef, useCallback, useMemo, useState } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'

import { LoadEarlier } from '../LoadEarlier'
import Message, { MessageProps } from '../Message'
import { IMessage } from '../Models'
import TypingIndicator from '../TypingIndicator'
import { MessageContainerProps } from './types'

import { warning } from '../logging'
import stylesCommon from '../styles'
import styles from './styles'
import Animated, { interpolate, runOnJS, useAnimatedReaction, useAnimatedScrollHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated'
import { ReanimatedScrollEvent } from 'react-native-reanimated/lib/typescript/hook/commonTypes'
import { Day } from '../Day'
import { isSameDay } from '../utils'

export * from './types'

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList)

interface ViewLayout {
  x: number
  y: number
  width: number
  height: number
}

const DayAnimated = ({ scrolledY, daysPositions, offsetY }: {
  scrolledY: { value: number }
  daysPositions: { value: { [key: string]: ViewLayout } }
  offsetY: { value: number }
}) => {
  const opacity = useSharedValue(0)
  const fadeOutOpacityTimeoutId = useSharedValue<ReturnType<typeof setTimeout> | null>(null)
  const containerHeight = useSharedValue(0)

  const top = useSharedValue(10)

  const isScrolledOnMount = useSharedValue(false)

  const daysPositionsArray = useDerivedValue(() => Object.values(daysPositions.value).sort((a, b) => a.y - b.y))

  const topOffset = useDerivedValue(() => {
    const currentDayPosition = daysPositionsArray.value.find((day, index) => {
      const scrolledPosition = offsetY.value + scrolledY.value - containerHeight.value - 10 - 10 // 10 - margin bottom, 10 - top offset
      const dayPosition = day.y + day.height

      return (scrolledPosition < dayPosition) || index === daysPositionsArray.value.length - 1
    })

    const scrolledBottomY = offsetY.value + scrolledY.value - (currentDayPosition?.height ?? 0) - 10 // 10 is marginBottom in Day component. TODO: render Day component here
    const dateBottomY = currentDayPosition?.y ?? 0

    const topOffset = scrolledBottomY - dateBottomY

    console.log('topOffset', currentDayPosition)

    return topOffset
  }, [offsetY, scrolledY, daysPositionsArray, containerHeight])

  const style = useAnimatedStyle(() => ({
    top: interpolate(
      topOffset.value,
      [-10, -0.0001, 0, containerHeight.value + 10],
      [10, 10, -containerHeight.value, 10],
      'clamp'
    ),
  }), [topOffset, containerHeight])

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }), [opacity])

  const fadeOut = useCallback(() => {
    'worklet'

    opacity.value = withTiming(0, { duration: 500 })
  }, [opacity])

  const scheduleFadeOut = useCallback(() => {
    if (fadeOutOpacityTimeoutId.value)
      clearTimeout(fadeOutOpacityTimeoutId.value)

    fadeOutOpacityTimeoutId.value = setTimeout(fadeOut, 2000)
  }, [fadeOut, fadeOutOpacityTimeoutId])

  const handleLayout = useCallback(({ nativeEvent }) => {
    containerHeight.value = nativeEvent.layout.height
  }, [containerHeight])

  useAnimatedReaction(
    () => [scrolledY.value, daysPositionsArray],
    (value, prevValue) => {
      // console.log('DayAnimated: daysPositions', daysPositions.value)

      if (!isScrolledOnMount.value) {
        isScrolledOnMount.value = true
        return
      }

      if (value[0] === prevValue?.[0])
        return

      opacity.value = withTiming(1, { duration: 500 })

      runOnJS(scheduleFadeOut)()

      // const scrolledBottomY = offsetY.value + scrolledY.value - (daysPositionsArray.value[0]?.height ?? 0) - 10 // 10 is marginBottom in Day component. TODO: render Day component here
      // const dateBottomY = daysPositionsArray.value[0]?.y ?? 0

      // console.log('!', scrolledBottomY, dateBottomY, scrolledBottomY - dateBottomY, daysPositionsArray.value)
    },
    [scrolledY, scheduleFadeOut, daysPositionsArray]
  )

  return (
    <Animated.View
      style={[stylesCommon.centerItems, styles.dayAnimated, style]}
      onLayout={handleLayout}
    >
      <Animated.View
        style={[styles.dayAnimatedContent, contentStyle]}
        pointerEvents='none'
      >
        <Text style={styles.dayAnimatedText}>{'Today'}</Text>
        {/* TODO */}
        {/* renderDay || <Day {...rest} /> */}
      </Animated.View>
    </Animated.View>
  )
}

const DayWrapper = forwardRef<View, MessageProps<IMessage>>((props, ref) => {
  const {
    renderDay: renderDayProp,
    currentMessage,
    previousMessage,
  } = props

  if (!currentMessage?.createdAt || isSameDay(currentMessage, previousMessage))
    return null

  const {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    containerStyle,
    onMessageLayout,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ...rest
  } = props

  return (
    <View ref={ref}>
      {
        renderDayProp
          ? renderDayProp(rest)
          : <Day {...rest} />
      }
    </View>
  )
})

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
    scrollToBottomComponent: scrollToBottomComponentProp,
  } = props

  const [isScrollToBottomVisible, setIsScrollToBottomVisible] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  const daysPositions = useSharedValue<{ [key: string]: ViewLayout }>({})
  const listHeight = useSharedValue(0)

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

  const handleLayoutItem = useCallback((id: string | number, ref) => {
    const itemLayout = forwardRef?.current?.recyclerlistview_unsafe?.getLayout(messages.findIndex(m => m._id === id))
    if (ref && itemLayout) {
      daysPositions.value = {
        ...daysPositions.value,
        [id]: { ...itemLayout },
      }
    } else if (daysPositions.value[id] != null) {
      const nextDaysPositions = { ...daysPositions.value }
      delete nextDaysPositions[id]
      daysPositions.value = nextDaysPositions
    }
  }, [messages, daysPositions, forwardRef])

  // const handleLayoutDayRef: HandleLayoutDayRef = useCallback((id, ref) => {
  //   handleLayoutItem(id)

  //   // 'worklet'

  //   // if (ref) {
  //   //   // ref?.measure((_x: number, _y: number, _width: number, _height: number, _pageX: number, pageY: number) => {
  //   //   ref?.measureInWindow((_x: number, _y: number, _width: number, _height: number) => {
  //   //     // 'worklet'

  //   //     // daysPositions.value = {
  //   //     //   ...daysPositions.value,
  //   //     //   [id]: pageY,
  //   //     // }

  //   //     // console.log('item: measureInWindow-1', id, _x, _y, _width, _height)
  //   //     console.log('item: measureInWindow-2', id, messages.findIndex(item => item._id === id), forwardRef?.current?.recyclerlistview_unsafe?.getLayout(messages.findIndex(item => item._id === id)))
  //   //   })
  //   // } else if (daysPositions.value[id] != null) {
  //   //   const nextDaysPositions = { ...daysPositions.value }
  //   //   delete nextDaysPositions[id]
  //   //   daysPositions.value = nextDaysPositions
  //   // }
  // }, [daysPositions, forwardRef, messages, handleLayoutItem])

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

      if (renderMessageProp)
        return renderMessageProp(messageProps)

      return (
        <View key={item._id.toString()}>
          <DayWrapper
            {...messageProps}
            ref={(ref) => handleLayoutItem(item._id, ref)}
          />
          <Message {...messageProps} />
        </View>
      )
    }

    return null
  }, [props, renderMessageProp, user, inverted, handleLayoutItem])

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

  const renderHeaderWrapper = useCallback(() => (
    <View style={stylesCommon.fill}>{renderLoadEarlier()}</View>
  ), [renderLoadEarlier])

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
    // console.log('onLayoutList', nativeEvent)

    listHeight.value = nativeEvent.layout.height

    if (
      !inverted &&
      messages?.length
    )
      // setTimeout(
      //   () => doScrollToBottom(false),
      //   15 * messages.length
      // )
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

  const scrolledY = useSharedValue(0)

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrolledY.value = event.contentOffset.y
      // console.log('onScroll', event.contentOffset.y)

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
        offsetY={listHeight}
      />
    </View>
  )
}

export default MessageContainer
