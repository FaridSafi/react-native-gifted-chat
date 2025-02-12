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

  const containerHeight = useSharedValue(0)
  const dayTopOffset = useMemo(() => 10, [])
  const dayBottomMargin = useMemo(() => 10, [])
  const topOffset = useTopOffset(listHeight, scrolledY, daysPositions, containerHeight, dayBottomMargin, dayTopOffset)

  const handleLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
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

export default Item
