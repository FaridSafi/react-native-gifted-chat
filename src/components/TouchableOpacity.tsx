import React, { useCallback } from 'react'
import { Pressable } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

export type TouchableOpacityProps = React.ComponentProps<typeof Pressable> & {
  activeOpacity?: number
} & React.ComponentProps<typeof Animated.View>

export const TouchableOpacity: React.FC<TouchableOpacityProps> = ({
  children,
  style,
  activeOpacity = 0.2,
  onPress,
  ...rest
}) => {
  const opacity = useSharedValue(1)
  const isAnimationInFinished = useSharedValue(false)

  const handlePressIn = useCallback(() => {
    opacity.value = withTiming(activeOpacity, { duration: 150 }, () => {
      isAnimationInFinished.value = true
    })
  }, [activeOpacity, opacity, isAnimationInFinished])

  const handlePressOut = useCallback(() => {
    setTimeout(() => {
      'worklet'

      opacity.value = withTiming(1, { duration: 150 })
      isAnimationInFinished.value = false
    }, isAnimationInFinished.value ? 0 : 150)
  }, [opacity, isAnimationInFinished])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View
        {...rest}
        style={[style, animatedStyle]}
      >
        {children}
      </Animated.View>
    </Pressable>
  )
}
