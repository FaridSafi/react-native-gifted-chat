import type { ComponentProps } from 'react'
import * as Haptics from 'expo-haptics'
import { PlatformPressable } from 'expo-router/react-navigation'

// The tab bar hands its button the props of a PlatformPressable.
export function HapticTab (props: ComponentProps<typeof PlatformPressable>) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={ev => {
        if (process.env.EXPO_OS === 'ios')
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

        props.onPressIn?.(ev)
      }}
    />
  )
}
