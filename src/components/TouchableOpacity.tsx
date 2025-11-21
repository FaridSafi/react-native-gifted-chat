import React, { useCallback } from 'react'
import { BaseButton } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

export type TouchableOpacityProps = Omit<React.ComponentProps<typeof BaseButton>, 'onPress'> & {
  activeOpacity?: number
  onPress?: () => void
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

  const handleActiveStateChange = useCallback((isActive: boolean) => {
    if (isActive)
      handlePressIn()
    else
      handlePressOut()
  }, [handlePressIn, handlePressOut])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  const handlePress = useCallback(() => {
    onPress?.()
  }, [onPress])

  return (
    <BaseButton
      {...rest}
      onPress={handlePress}
      onActiveStateChange={handleActiveStateChange}
    >
      <Animated.View
        style={[style, animatedStyle]}
      >
        {children}
      </Animated.View>
    </BaseButton>
  )
}
