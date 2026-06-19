import React, { useState } from 'react'
import { StyleSheet, Text } from 'react-native'
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated'

// Debug switches for the animated day header. All OFF/1 for production - flip them
// here when working on the animation.
export const DAY_DEBUG = {
  // Multiply the fade durations/delay so the fades can be captured frame-by-frame.
  timeScale: 1,
  // Keep the floating header at full opacity (ignore the scroll fade) so the
  // slide/push geometry can be studied independently of the fade.
  forceOpacity: false,
  // Render an on-screen readout of the sticky worklet values.
  overlay: false,
}

// On-screen readout for the header, driven by a worklet `select` that returns the
// readout string. Returns null (and runs nothing) when DAY_DEBUG.overlay is off.
export function useDayDebugOverlay (select: () => string, deps: unknown[]): React.ReactElement | null {
  const [text, setText] = useState('')

  useAnimatedReaction(
    () => (DAY_DEBUG.overlay ? select() : ''),
    value => {
      if (value)
        runOnJS(setText)(value)
    },
    deps
  )

  if (!DAY_DEBUG.overlay)
    return null

  return <Text style={styles.overlay}>{text}</Text>
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 2,
    left: 4,
    fontSize: 11,
    color: 'red',
    zIndex: 9999,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
})
