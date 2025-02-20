import React, { forwardRef, useCallback, useMemo } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import { IMessage } from '../../../types'
import Message, { MessageProps } from '../../../Message'
import Animated, { interpolate, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated'
import { DaysPositions } from '../../types'
import { Day } from '../../../Day'
import { isSameDay } from '../../../utils'
import { ItemProps } from './types'

export * from './types'

// y-position of current scroll position relative to the bottom of the day container. (since we have inverted list it is bottom)
export const useScrolledPosition = (listHeight: { value: number }, scrolledY: { value: number }, containerHeight: { value: number }, dayBottomMargin: number, dayTopOffset: number) => {
  const scrolledPosition = useDerivedValue(() =>
    listHeight.value + scrolledY.value - containerHeight.value - dayBottomMargin - dayTopOffset
  , [listHeight, scrolledY, containerHeight, dayBottomMargin, dayTopOffset])

  return scrolledPosition
}

export const useTopOffset = (
  listHeight: { value: number },
  scrolledY: { value: number },
  daysPositions: { value: DaysPositions },
  containerHeight: { value: number },
  dayBottomMargin: number,
  dayTopOffset: number,
  createdAt?: number
) => {
  const scrolledPosition = useScrolledPosition(listHeight, scrolledY, containerHeight, dayBottomMargin, dayTopOffset)

  // sorted array of days positions by y
  const daysPositionsArray = useDerivedValue(() => Object.values(daysPositions.value).sort((a, b) => a.y - b.y))

  // find current day position by scrolled position
  const currentDayPosition = useDerivedValue(() => {
    if (createdAt != null) {
      const currentDayPosition = daysPositionsArray.value.find(day => day.createdAt === createdAt)
      if (currentDayPosition)
        return currentDayPosition
    }

    return daysPositionsArray.value.find((day, index) => {
      const dayPosition = day.y + day.height
      return (scrolledPosition.value < dayPosition) || index === daysPositionsArray.value.length - 1
    })
  }, [daysPositionsArray, scrolledPosition, createdAt])

  const topOffset = useDerivedValue(() => {
    const scrolledBottomY = listHeight.value + scrolledY.value - (currentDayPosition.value?.height ?? 0) - 5 // 5 is marginTop in Day component.
    const dateBottomY = currentDayPosition.value?.y ?? 0

    const topOffset = scrolledBottomY - dateBottomY

    return topOffset
  }, [listHeight, scrolledY, currentDayPosition])

  return topOffset
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

const Item = (props: ItemProps) => {
  const {
    onRefDayWrapper,
    renderMessage: renderMessageProp,
    scrolledY,
    daysPositions,
    listHeight,
    ...rest
  } = props

  const dayContainerHeight = useSharedValue(0)
  const dayTopOffset = useMemo(() => 10, [])
  const dayBottomMargin = useMemo(() => 10, [])

  const createdAt = useMemo(() =>
    new Date(props.currentMessage.createdAt).getTime()
  , [props.currentMessage.createdAt])

  const topOffset = useTopOffset(listHeight, scrolledY, daysPositions, dayContainerHeight, dayBottomMargin, dayTopOffset, createdAt)
  const scrolledPosition = useScrolledPosition(listHeight, scrolledY, dayContainerHeight, dayBottomMargin, dayTopOffset)

  const scrolledPositionStyle = useAnimatedStyle(() => ({
    bottom: scrolledPosition.value,
  }), [scrolledPosition])

  const handleLayoutDayContainer = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    dayContainerHeight.value = nativeEvent.layout.height
  }, [dayContainerHeight])

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(
      topOffset.value,
      [
        -dayTopOffset,
        -0.0001,
        0,
        dayContainerHeight.value + dayTopOffset,
      ],
      [
        0,
        0,
        1,
        1,
      ],
      'clamp'
    ),
  }), [topOffset, dayContainerHeight, dayTopOffset])

  const handleRef = useCallback((ref: unknown) => {
    onRefDayWrapper(
      ref,
      props.currentMessage._id,
      new Date(props.currentMessage.createdAt).getTime()
    )
  }, [onRefDayWrapper, props.currentMessage])

  return (
    <View key={props.currentMessage._id.toString()}>
      <Animated.View
        style={style}
        onLayout={handleLayoutDayContainer}
      >
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

export default Item
