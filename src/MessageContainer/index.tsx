import React, { forwardRef, useCallback, useDebugValue, useEffect, useMemo, useState } from 'react'
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
import { Day, DayProps } from '../Day'
import { isSameDay } from '../utils'

export * from './types'

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList)

interface ViewLayout {
  x: number
  y: number
  width: number
  height: number
}

type DaysPositions = { [key: string]: ViewLayout & { createdAt: number } }

interface DayAnimatedProps extends Omit<DayProps, 'createdAt'> {
  scrolledY: { value: number }
  daysPositions: { value: DaysPositions }
  listHeight: { value: number }
  renderDay?: (props: DayProps) => React.ReactNode
  messages: IMessage[]
  isLoadingEarlier: boolean
}

const useScrolledPosition = (listHeight: { value: number }, scrolledY: { value: number }, containerHeight: { value: number }, dayBottomMargin: number, dayTopOffset: number) => {
  const scrolledPosition = useDerivedValue(() =>
    listHeight.value + scrolledY.value - containerHeight.value - dayBottomMargin - dayTopOffset
  , [listHeight, scrolledY, containerHeight, dayBottomMargin, dayTopOffset])

  return scrolledPosition
}

const useTopOffset = (
  listHeight: { value: number },
  scrolledY: { value: number },
  daysPositions: { value: DaysPositions },
  containerHeight: { value: number },
  dayBottomMargin: number,
  dayTopOffset: number
) => {
  const scrolledPosition = useScrolledPosition(listHeight, scrolledY, containerHeight, dayBottomMargin, dayTopOffset)

  const daysPositionsArray = useDerivedValue(() => Object.values(daysPositions.value).sort((a, b) => a.y - b.y))

  const currentDayPosition = useDerivedValue(() =>
    daysPositionsArray.value.find((day, index) => {
      const dayPosition = day.y + day.height
      return (scrolledPosition.value < dayPosition) || index === daysPositionsArray.value.length - 1
    })
  , [daysPositionsArray, scrolledPosition])

  const topOffset = useDerivedValue(() => {
    const scrolledBottomY = listHeight.value + scrolledY.value - (currentDayPosition.value?.height ?? 0) - 5 // 5 is marginTop in Day component.
    const dateBottomY = currentDayPosition.value?.y ?? 0

    const topOffset = scrolledBottomY - dateBottomY

    return topOffset
  }, [listHeight, scrolledY, currentDayPosition])

  return topOffset
}

const DayAnimated = ({ scrolledY, daysPositions, listHeight, renderDay, messages, isLoadingEarlier, ...rest }: DayAnimatedProps) => {
  const opacity = useSharedValue(0)
  const fadeOutOpacityTimeoutId = useSharedValue<ReturnType<typeof setTimeout> | null>(null)
  const containerHeight = useSharedValue(0)

  const isScrolledOnMount = useSharedValue(false)
  const isLoadingEarlierAnim = useSharedValue(isLoadingEarlier)

  const daysPositionsArray = useDerivedValue(() => Object.values(daysPositions.value).sort((a, b) => a.y - b.y))

  const [createdAt, setCreatedAt] = useState<number | undefined>()

  const dayTopOffset = useMemo(() => 10, [])
  const dayBottomMargin = useMemo(() => 10, [])
  const scrolledPosition = useScrolledPosition(listHeight, scrolledY, containerHeight, dayBottomMargin, dayTopOffset)
  const topOffset = useTopOffset(listHeight, scrolledY, daysPositions, containerHeight, dayBottomMargin, dayTopOffset)

  const messagesDates = useMemo(() => {
    const messagesDates: number[] = []

    for (let i = 1; i < messages.length; i++) {
      const previousMessage = messages[i - 1]
      const message = messages[i]

      if (!isSameDay(previousMessage, message) || !messagesDates.includes(new Date(message.createdAt).getTime()))
        messagesDates.push(new Date(message.createdAt).getTime())
    }

    return messagesDates
  }, [messages])

  const createdAtDate = useDerivedValue(() => {
    for (let i = 0; i < daysPositionsArray.value.length; i++) {
      const day = daysPositionsArray.value[i]
      const dayPosition = day.y + day.height - containerHeight.value - dayBottomMargin

      if (scrolledPosition.value < dayPosition)
        return day.createdAt
    }

    return messagesDates[messagesDates.length - 1]
  }, [daysPositionsArray, scrolledPosition, messagesDates, containerHeight, dayBottomMargin])

  const style = useAnimatedStyle(() => ({
    top: interpolate(
      topOffset.value,
      [-dayTopOffset, -0.0001, 0, isLoadingEarlierAnim.value ? 0 : containerHeight.value + dayTopOffset],
      [dayTopOffset, dayTopOffset, -containerHeight.value, isLoadingEarlierAnim.value ? -containerHeight.value : dayTopOffset],
      'clamp'
    ),
  }), [topOffset, containerHeight, dayTopOffset, isLoadingEarlierAnim])

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
      if (!isScrolledOnMount.value) {
        isScrolledOnMount.value = true
        return
      }

      if (value[0] === prevValue?.[0])
        return

      opacity.value = withTiming(1, { duration: 500 })

      runOnJS(scheduleFadeOut)()
    },
    [scrolledY, scheduleFadeOut, daysPositionsArray]
  )

  useAnimatedReaction(
    () => createdAtDate.value,
    (value, prevValue) => {
      if (value && value !== prevValue)
        runOnJS(setCreatedAt)(value)
    },
    [createdAtDate]
  )

  useEffect(() => {
    isLoadingEarlierAnim.value = isLoadingEarlier
  }, [isLoadingEarlier])

  if (!createdAt)
    return null

  return (
    <Animated.View
      style={[stylesCommon.centerItems, styles.dayAnimated, style]}
      onLayout={handleLayout}
    >
      <Animated.View
        style={contentStyle}
        pointerEvents='none'
      >
        {
          renderDay
            ? renderDay({ ...rest, createdAt })
            : <Day
              {...rest}
              containerStyle={[styles.dayAnimatedDayContainerStyle, rest.containerStyle]}
              createdAt={createdAt}
            />
        }
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
          ? renderDayProp({ ...rest, createdAt: currentMessage.createdAt })
          : <Day {...rest} createdAt={currentMessage.createdAt} />
      }
    </View>
  )
})

interface ItemProps extends MessageContainerProps<IMessage> {
  onRefDayWrapper: (ref: any, id: string | number, createdAt: number) => void
  currentMessage: IMessage
  previousMessage?: IMessage
  nextMessage?: IMessage
  position: 'left' | 'right'
  scrolledY: { value: number }
  daysPositions: { value: DaysPositions }
  listHeight: { value: number }
}

const Item = (props: ItemProps) => {
  const {
    onRefDayWrapper,
    renderMessage: renderMessageProp,
    scrolledY,
    daysPositions,
    listHeight,
    ...rest
  } = props

  const containerHeight = useSharedValue(0)
  const dayTopOffset = useMemo(() => 10, [])
  const dayBottomMargin = useMemo(() => 10, [])
  const topOffset = useTopOffset(listHeight, scrolledY, daysPositions, containerHeight, dayBottomMargin, dayTopOffset)

  const handleLayout = useCallback(({ nativeEvent }) => {
    containerHeight.value = nativeEvent.layout.height
  }, [containerHeight])

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(
      topOffset.value,
      [-dayTopOffset, -0.0001, 0, containerHeight.value + dayTopOffset],
      [0, 0, 1, 1],
      'clamp'
    ),
  }), [topOffset, containerHeight, dayTopOffset])

  const handleRef = useCallback((ref: any) => {
    onRefDayWrapper(
      ref,
      props.currentMessage._id,
      props.currentMessage.createdAt instanceof Date
        ? props.currentMessage.createdAt.getTime()
        : props.currentMessage.createdAt
    )
  }, [onRefDayWrapper, props.currentMessage])

  return (
    <View key={props.currentMessage._id.toString()}>
      <Animated.View style={style} onLayout={handleLayout}>
        <DayWrapper
          {...rest as MessageProps<IMessage>}
          ref={handleRef}
        />
      </Animated.View>
      {
        renderMessageProp
          ? renderMessageProp(rest as MessageProps<IMessage>)
          : <Message {...rest as MessageProps<IMessage>} />
      }
    </View>
  )
}

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
