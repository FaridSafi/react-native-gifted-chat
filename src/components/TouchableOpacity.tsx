import React, { useCallback } from 'react'
import { Pressable } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export interface TouchableOpacityProps extends React.ComponentProps<typeof AnimatedPressable> {
  activeOpacity?: number
}

export function TouchableOpacity({
  children,
  style,
  activeOpacity = 0.2,
  ...rest
}: TouchableOpacityProps) {
  const opacity = useSharedValue(1)

  const handlePressIn = useCallback(() => {
    opacity.value = withTiming(activeOpacity, { duration: 150 })
  }, [activeOpacity, opacity])

  const handlePressOut = useCallback(() => {
    opacity.value = withTiming(1, { duration: 150 })
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  )
}
