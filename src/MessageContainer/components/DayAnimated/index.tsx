import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Animated, { interpolate, useAnimatedStyle, useDerivedValue, useSharedValue, useAnimatedReaction, withTiming, runOnJS } from 'react-native-reanimated'
import { Day } from '../../../Day'
import { isSameDay } from '../../../utils'
import { useScrolledPosition, useTopOffset } from '../Item'
import { DayAnimatedProps } from './types'

import stylesCommon from '../../../styles'
import styles from './styles'

export * from './types'

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

    fadeOutOpacityTimeoutId.value = setTimeout(fadeOut, 500)
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
  }, [isLoadingEarlierAnim, isLoadingEarlier])

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

export default DayAnimated
