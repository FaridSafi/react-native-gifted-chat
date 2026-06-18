import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, useAnimatedReaction, withTiming, runOnJS } from 'react-native-reanimated'
import { Day } from '../../../Day'
import stylesCommon from '../../../styles'
import { DAY_HANDOFF_OFFSET, DAY_MARGIN_TOP, DAY_PIN_OFFSET } from '../dayLayout'
import styles from './styles'
import { DayAnimatedProps } from './types'

export * from './types'

// Set to a value > 1 to slow down the fade in/out animations so they can be
// captured frame-by-frame while debugging (e.g. 20). Keep at 1 for production.
const DEBUG_TIME_SCALE = 1

const FADE_IN_DURATION = 150 * DEBUG_TIME_SCALE
const FADE_OUT_DURATION = 300 * DEBUG_TIME_SCALE
const FADE_OUT_DELAY = 600 * DEBUG_TIME_SCALE

export const DayAnimated = ({ scrolledY, daysPositions, listHeight, renderDay, isLoading, ...rest }: DayAnimatedProps) => {
  const opacity = useSharedValue(0)
  const fadeOutOpacityTimeoutId = useSharedValue<ReturnType<typeof setTimeout> | undefined>(undefined)
  const containerHeight = useSharedValue(0)

  const isScrolledOnMount = useSharedValue(false)
  const isLoadingAnim = useSharedValue(isLoading)

  const daysPositionsArray = useDerivedValue(() => Object.values(daysPositions.value).sort((a, b) => {
    'worklet'

    return a.y - b.y
  }))

  const [createdAt, setCreatedAt] = useState<number | undefined>()

  // Telegram-style sticky day header (iOS section-header behaviour).
  //
  // The list is inverted: older days sit higher on screen, newer days lower.
  // `daysPositionsArray` is sorted ascending by y, so index 0 is the newest day.
  //
  // For each day separator the on-screen Y of its top edge is:
  //   separatorScreenTop = (listHeight + scrolledY) - (day.y + day.height)
  // and the separator's pill renders DAY_MARGIN_TOP below that (Day's container
  // marginTop). The floating header overrides that margin to 0, so when it is
  // pinned at DAY_PIN_OFFSET its pill lines up with an inline separator whose
  // separatorScreenTop === DAY_HANDOFF_OFFSET (= DAY_PIN_OFFSET - DAY_MARGIN_TOP).
  //
  // The "stuck" day is the newest day whose separator has reached/passed that
  // handoff line. The floating header shows its date pinned at DAY_PIN_OFFSET,
  // and the next (newer) day's separator, still below, pushes it up as it rises:
  //   top = min(DAY_PIN_OFFSET, nextSeparatorScreenTop + DAY_MARGIN_TOP - headerHeight)
  // so the floating pill's bottom rests exactly on the rising separator's pill.
  // The rising separator is the visible *incoming* header during the push (it is
  // rendered inline and hands off at the same pixel), so there is no duplicate
  // and no jump.
  const sticky = useDerivedValue(() => {
    'worklet'

    const days = daysPositionsArray.value
    const n = days.length
    if (n === 0)
      return { top: DAY_PIN_OFFSET, createdAt: undefined as number | undefined }

    const scrolledTop = listHeight.value + scrolledY.value

    let idx = n - 1
    for (let i = 0; i < n; i++) {
      const separatorScreenTop = scrolledTop - (days[i].y + days[i].height)
      if (separatorScreenTop <= DAY_HANDOFF_OFFSET) {
        idx = i
        break
      }
    }

    const current = days[idx]

    // While loading earlier messages the top is occupied by the spinner; keep the
    // header tucked away above the screen.
    if (isLoadingAnim.value)
      return { top: -containerHeight.value, createdAt: current.createdAt }

    let top = DAY_PIN_OFFSET
    if (idx > 0) {
      const next = days[idx - 1]
      const nextSeparatorScreenTop = scrolledTop - (next.y + next.height)
      top = Math.min(DAY_PIN_OFFSET, nextSeparatorScreenTop + DAY_MARGIN_TOP - containerHeight.value)
    }

    return { top, createdAt: current.createdAt }
  }, [daysPositionsArray, listHeight, scrolledY, containerHeight, isLoadingAnim])

  const style = useAnimatedStyle(() => ({
    top: sticky.value.top,
  }), [sticky])

  const contentStyle = useAnimatedStyle(() => ({
    // Telegram only shows the sticky date while scrolling; the fade is driven by
    // the scroll reaction below. The push (above) prevents overlap with the inline
    // separator, so no extra opacity gate is needed.
    opacity: opacity.value,
  }), [opacity])

  const fadeOut = useCallback(() => {
    'worklet'

    opacity.value = withTiming(0, { duration: FADE_OUT_DURATION })
  }, [opacity])

  const scheduleFadeOut = useCallback(() => {
    clearTimeout(fadeOutOpacityTimeoutId.value)

    fadeOutOpacityTimeoutId.value = setTimeout(fadeOut, FADE_OUT_DELAY)
  }, [fadeOut, fadeOutOpacityTimeoutId])

  const handleLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
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

      opacity.value = withTiming(1, { duration: FADE_IN_DURATION })

      runOnJS(scheduleFadeOut)()
    },
    [scrolledY, scheduleFadeOut, daysPositionsArray]
  )

  useAnimatedReaction(
    () => sticky.value.createdAt,
    (value, prevValue) => {
      if (value && value !== prevValue)
        runOnJS(setCreatedAt)(value)
    },
    [sticky]
  )

  useEffect(() => {
    isLoadingAnim.value = isLoading
  }, [isLoadingAnim, isLoading])

  const dayContent = useMemo(() => {
    if (!createdAt)
      return null

    return renderDay
      ? renderDay({ ...rest, createdAt, isAnimated: true })
      : <Day
        {...rest}
        containerStyle={[styles.dayAnimatedDayContainerStyle, rest.containerStyle]}
        createdAt={createdAt}
        isAnimated
      />
  }, [createdAt, renderDay, rest])

  if (!createdAt)
    return null

  return (
    <Animated.View
      style={[stylesCommon.centerItems, styles.dayAnimated, style]}
      onLayout={handleLayout}
      pointerEvents='none'
    >
      <Animated.View
        style={contentStyle}
        pointerEvents='none'
      >
        {dayContent}
      </Animated.View>
    </Animated.View>
  )
}
