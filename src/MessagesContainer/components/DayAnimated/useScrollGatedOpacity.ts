import { useCallback } from 'react'
import { runOnJS, useAnimatedReaction, useSharedValue, withTiming } from 'react-native-reanimated'
import { DAY_DEBUG } from './debug'

const FADE_IN_DURATION = 150
const FADE_OUT_DURATION = 300
const FADE_OUT_DELAY = 600

// Opacity (0..1) that follows the scroll gesture, Telegram-style: the floating date
// header is hidden at rest, fades in fast when scrolling starts, stays fully opaque
// for the whole gesture (drag + momentum, including slow drags and short pauses),
// and fades out a short delay after scrolling fully stops. Driven by the
// `isScrollActive` flag (begin/end drag + momentum) rather than per-scroll-delta
// idle timers, so a pause mid-drag doesn't flicker it out and back in.
export function useScrollGatedOpacity (isScrollActive: { value: boolean }) {
  const opacity = useSharedValue(0)
  const fadeOutTimeoutId = useSharedValue<ReturnType<typeof setTimeout> | undefined>(undefined)

  const fadeOut = useCallback(() => {
    'worklet'

    opacity.value = withTiming(0, { duration: FADE_OUT_DURATION * DAY_DEBUG.timeScale })
  }, [opacity])

  const scheduleFadeOut = useCallback(() => {
    clearTimeout(fadeOutTimeoutId.value)

    fadeOutTimeoutId.value = setTimeout(fadeOut, FADE_OUT_DELAY * DAY_DEBUG.timeScale)
  }, [fadeOut, fadeOutTimeoutId])

  useAnimatedReaction(
    () => isScrollActive.value,
    (active, prevActive) => {
      if (active === prevActive)
        return

      if (active) {
        clearTimeout(fadeOutTimeoutId.value)
        opacity.value = withTiming(1, { duration: FADE_IN_DURATION * DAY_DEBUG.timeScale })
      } else {
        runOnJS(scheduleFadeOut)()
      }
    },
    [isScrollActive, scheduleFadeOut, fadeOutTimeoutId]
  )

  return opacity
}
