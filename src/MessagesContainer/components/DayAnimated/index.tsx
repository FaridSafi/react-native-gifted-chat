import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { LayoutChangeEvent, Text } from 'react-native'
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, useAnimatedReaction, withTiming, runOnJS } from 'react-native-reanimated'
import { Day } from '../../../Day'
import stylesCommon from '../../../styles'
import { DAY_HANDOFF_OFFSET, DAY_MARGIN_TOP, DAY_PIN_OFFSET, DAY_PUSH_GAP } from '../dayLayout'
import styles from './styles'
import { DayAnimatedProps } from './types'

export * from './types'

// --- Debug switches (all OFF/1 for production) ---------------------------------
// Multiply fade durations/delay so the fades can be captured frame-by-frame.
const DEBUG_TIME_SCALE = 1
// Keep the floating header at full opacity (ignore the scroll fade) so the push
// geometry can be studied independently of the fade.
const DEBUG_FORCE_OPACITY = false
// Render an on-screen readout of the sticky worklet values.
const DEBUG_OVERLAY = false
// -------------------------------------------------------------------------------

const FADE_IN_DURATION = 150 * DEBUG_TIME_SCALE
const FADE_OUT_DURATION = 300 * DEBUG_TIME_SCALE
const FADE_OUT_DELAY = 600 * DEBUG_TIME_SCALE

export const DayAnimated = ({ scrolledY, daysPositions, listHeight, isScrollActive, floatingRenderedDate, renderDay, isLoading, ...rest }: DayAnimatedProps) => {
  const opacity = useSharedValue(0)
  const fadeOutOpacityTimeoutId = useSharedValue<ReturnType<typeof setTimeout> | undefined>(undefined)
  const containerHeight = useSharedValue(0)

  const isLoadingAnim = useSharedValue(isLoading)

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
  // `daysPositionsArray` is sorted ascending by y, so index 0 is the newest day.
  //
  // For each day separator the on-screen Y of its top edge is:
  //   separatorScreenTop = (listHeight + scrolledY) - (day.y + day.height)
  // and the separator's pill renders DAY_MARGIN_TOP below that (Day's container
  // marginTop). The floating header overrides that margin to 0, so when it is
  // pinned at DAY_PIN_OFFSET its pill lines up with an inline separator whose
  // separatorScreenTop === DAY_HANDOFF_OFFSET (= DAY_PIN_OFFSET - DAY_MARGIN_TOP).
  //
  // A day becomes "stuck" (shown by the floating header) the instant its separator
  // reaches the handoff line (separatorScreenTop <= DAY_HANDOFF_OFFSET). At that same
  // pixel the inline separator hard-cuts off (see Item) and the floating hard-cuts
  // on, so the date hands off floating<->inline with no fade and no duplicate. The
  // floating is then positioned by the next (newer) day's separator so it slides
  // pixel by pixel:
  //   top = min(DAY_PIN_OFFSET, nextSeparatorScreenTop + DAY_MARGIN_TOP - headerHeight - DAY_PUSH_GAP)
  // so the outgoing pill keeps a DAY_PUSH_GAP margin above the rising pill.
  const sticky = useDerivedValue(() => {
    'worklet'

    const days = daysPositionsArray.value
    const n = days.length
    if (n === 0)
      return { top: DAY_PIN_OFFSET, createdAt: undefined as number | undefined, curSep: NaN }

    const scrolledTop = listHeight.value + scrolledY.value

    // The stuck day is the newest day whose separator has reached/passed the
    // handoff line (DAY_HANDOFF_OFFSET). The floating header shows its date.
    let idx = n - 1
    for (let i = 0; i < n; i++) {
      const separatorScreenTop = scrolledTop - (days[i].y + days[i].height)
      if (separatorScreenTop <= DAY_HANDOFF_OFFSET) {
        idx = i
        break
      }
    }

    const current = days[idx]
    const curSep = scrolledTop - (current.y + current.height)

    if (isLoadingAnim.value)
      return { top: -containerHeight.value, createdAt: current.createdAt, curSep }

    // Scroll-driven slide: the floating header is positioned off the next (newer)
    // day's separator. When that separator is far below, the header rests at the
    // pin. As it rises/descends near the pin the header slides with it pixel by
    // pixel - sliding down from the top edge as an older day takes over (scrolling
    // up), or being pushed up and off as a newer day rises (scrolling down) - while
    // keeping a DAY_PUSH_GAP margin between the two date pills.
    let top = DAY_PIN_OFFSET
    if (idx > 0) {
      const nextSep = scrolledTop - (days[idx - 1].y + days[idx - 1].height)
      top = Math.min(DAY_PIN_OFFSET, nextSep + DAY_MARGIN_TOP - containerHeight.value - DAY_PUSH_GAP)
    }

    return { top, createdAt: current.createdAt, curSep }
  }, [daysPositionsArray, listHeight, scrolledY, containerHeight, isLoadingAnim])

  const style = useAnimatedStyle(() => ({
    top: sticky.value.top,
  }), [sticky])

  const contentStyle = useAnimatedStyle(() => {
    // Telegram only shows the sticky date while scrolling; that fade is driven by
    // the scroll reaction below.
    const fade = DEBUG_FORCE_OPACITY ? 1 : opacity.value

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

  // Telegram keeps the date header visible for the whole gesture: it fades in when
  // scrolling starts and only fades out once scrolling fully stops (finger up AND
  // momentum finished). Driving this from the scroll-active flag - rather than per
  // scroll-delta idle timers - keeps it at full opacity during slow drags and short
  // pauses instead of flickering out and back in.
  useAnimatedReaction(
    () => isScrollActive.value,
    (active, prevActive) => {
      if (active === prevActive)
        return

      if (active) {
        clearTimeout(fadeOutOpacityTimeoutId.value)
        opacity.value = withTiming(1, { duration: FADE_IN_DURATION })
      } else {
        runOnJS(scheduleFadeOut)()
      }
    },
    [isScrollActive, scheduleFadeOut, fadeOutOpacityTimeoutId]
  )

  useAnimatedReaction(
    () => sticky.value.createdAt,
    (value, prevValue) => {
      if (value && value !== prevValue)
        runOnJS(setCreatedAt)(value)
    },
    [sticky]
  )

  const [dbg, setDbg] = useState('')
  useAnimatedReaction(
    () => sticky.value,
    v => {
      if (DEBUG_OVERLAY)
        runOnJS(setDbg)(`top=${Math.round(v.top)} cur=${Math.round(v.curSep)} ch=${Math.round(containerHeight.value)} load=${isLoadingAnim.value ? 1 : 0}`)
    },
    [sticky, containerHeight, isLoadingAnim]
  )

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

  const debugOverlay = DEBUG_OVERLAY
    ? (
      <Text style={{ position: 'absolute', top: 2, left: 4, fontSize: 11, color: 'red', zIndex: 9999, backgroundColor: 'rgba(255,255,255,0.8)' }}>{dbg}</Text>
    )
    : null

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
