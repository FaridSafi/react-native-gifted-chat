import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { LayoutChangeEvent } from 'react-native'
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, useAnimatedReaction, runOnJS } from 'react-native-reanimated'
import { Day } from '../../../Day'
import stylesCommon from '../../../styles'
import { DAY_HANDOFF_OFFSET, DAY_MARGIN_TOP, DAY_PIN_OFFSET, DAY_PUSH_GAP, dayPositionScreenTop } from '../dayLayout'
import { DAY_DEBUG, useDayDebugOverlay } from './debug'
import styles from './styles'
import { DayAnimatedProps } from './types'
import { useScrollGatedOpacity } from './useScrollGatedOpacity'

export * from './types'

export const DayAnimated = ({ scrolledY, daysPositions, listHeight, isScrollActive, floatingRenderedDate, renderDay, isLoading, ...rest }: DayAnimatedProps) => {
  const containerHeight = useSharedValue(0)
  const isLoadingAnim = useSharedValue(isLoading)

  // Telegram only shows the floating date while scrolling; this opacity fades in on
  // scroll start and out after the gesture fully ends.
  const opacity = useScrollGatedOpacity(isScrollActive)

  // Sort newest day first. Sorting by createdAt (stable) rather than measured y
  // keeps the order deterministic even while cells are (re)measured mid-scroll, so
  // the stuck-day selection below can't briefly jump to the wrong day.
  const daysPositionsArray = useDerivedValue(() => Object.values(daysPositions.value).sort((a, b) => {
    'worklet'

    return b.createdAt - a.createdAt
  }))

  const [createdAt, setCreatedAt] = useState<number | undefined>()

  // Telegram-style sticky day header (iOS section-header behaviour).
  //
  // The list is inverted: older days sit higher on screen, newer days lower.
  // `daysPositionsArray` is sorted by createdAt (newest first), so index 0 is the
  // newest day. Each separator's on-screen top edge is `dayPositionScreenTop`; the
  // separator's pill renders DAY_MARGIN_TOP below that, and the floating header
  // overrides that margin to 0, so its pinned pill (top = DAY_PIN_OFFSET) lines up
  // with an inline separator at separatorScreenTop === DAY_HANDOFF_OFFSET.
  //
  // A day becomes "stuck" (shown by the floating header) the instant its separator
  // reaches the handoff line. At that same pixel the inline separator hard-cuts off
  // (see Item) and the floating hard-cuts on - the date hands off floating<->inline
  // with no fade and no duplicate. The floating is then positioned off the next
  // (newer) day's separator so it slides pixel by pixel: down from the top edge as
  // an older day takes over (scrolling up), or up and off as a newer day rises
  // (scrolling down), keeping a DAY_PUSH_GAP margin between the two pills.
  const sticky = useDerivedValue(() => {
    'worklet'

    const days = daysPositionsArray.value
    const n = days.length
    if (n === 0)
      return { top: DAY_PIN_OFFSET, createdAt: undefined as number | undefined, curSep: NaN }

    const scrolledTop = listHeight.value + scrolledY.value

    let idx = n - 1
    for (let i = 0; i < n; i++)
      if (dayPositionScreenTop(scrolledTop, days[i]) <= DAY_HANDOFF_OFFSET) {
        idx = i
        break
      }

    const current = days[idx]
    const curSep = dayPositionScreenTop(scrolledTop, current)

    if (isLoadingAnim.value)
      return { top: -containerHeight.value, createdAt: current.createdAt, curSep }

    let top = DAY_PIN_OFFSET
    if (idx > 0) {
      const nextSep = dayPositionScreenTop(scrolledTop, days[idx - 1])
      top = Math.min(DAY_PIN_OFFSET, nextSep + DAY_MARGIN_TOP - containerHeight.value - DAY_PUSH_GAP)
    }

    return { top, createdAt: current.createdAt, curSep }
  }, [daysPositionsArray, listHeight, scrolledY, containerHeight, isLoadingAnim])

  const style = useAnimatedStyle(() => ({
    top: sticky.value.top,
  }), [sticky])

  const contentStyle = useAnimatedStyle(() => {
    // The scroll-gated fade (see useScrollGatedOpacity); DAY_DEBUG.forceOpacity pins
    // it to 1 so the slide/push can be studied without the fade.
    const fade = DAY_DEBUG.forceOpacity ? 1 : opacity.value

    // stuckGate hides the floating header when no day is actually stuck above the
    // pin - i.e. at the top of history, once the oldest day's own separator drops
    // back below the pin (e.g. the "Load earlier" button scrolls in). It is a hard
    // step (not a fade) so the date hands off floating->inline at the same pixel
    // with no fading duplicate over the loader, mirroring the inline separator's
    // hard cutoff.
    const stuckGate = sticky.value.curSep <= DAY_HANDOFF_OFFSET ? 1 : 0

    // renderGate hides the header while its rendered text hasn't caught up to the
    // worklet's current stuck day (the ~1-frame JS-thread lag after a day change).
    // The inline separator stays up during this frame and shows the correct date, so
    // the header never flashes the previous date when scrolling into a newer day.
    const renderGate = sticky.value.createdAt === floatingRenderedDate.value ? 1 : 0

    return { opacity: fade * stuckGate * renderGate }
  }, [opacity, sticky, floatingRenderedDate])

  const handleLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    containerHeight.value = nativeEvent.layout.height
  }, [containerHeight])

  useAnimatedReaction(
    () => sticky.value.createdAt,
    (value, prevValue) => {
      if (value && value !== prevValue)
        runOnJS(setCreatedAt)(value)
    },
    [sticky]
  )

  const debugOverlay = useDayDebugOverlay(() => {
    'worklet'

    const v = sticky.value
    return `top=${Math.round(v.top)} cur=${Math.round(v.curSep)} ch=${Math.round(containerHeight.value)} load=${isLoadingAnim.value ? 1 : 0}`
  }, [sticky, containerHeight, isLoadingAnim])

  useEffect(() => {
    isLoadingAnim.value = isLoading
  }, [isLoadingAnim, isLoading])

  // Publish the date the header is actually rendering so the inline separators (and
  // the header's own renderGate) know when the text has caught up to the worklet.
  useEffect(() => {
    floatingRenderedDate.value = createdAt
  }, [createdAt, floatingRenderedDate])

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
    return debugOverlay

  return (
    <>
      {debugOverlay}
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
    </>
  )
}
