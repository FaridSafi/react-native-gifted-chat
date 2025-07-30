import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { View } from 'react-native'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { TypingIndicatorProps } from './types'

import stylesCommon from '../styles'
import styles from './styles'

export * from './types'

const DotsAnimation = () => {
  const dot1 = useSharedValue(0)
  const dot2 = useSharedValue(0)
  const dot3 = useSharedValue(0)

  const topY = useMemo(() => -5, [])
  const bottomY = useMemo(() => 5, [])
  const duration = useMemo(() => 500, [])

  const dot1Style = useAnimatedStyle(() => ({
    transform: [{
      translateY: dot1.value,
    }],
  }), [dot1])

  const dot2Style = useAnimatedStyle(() => ({
    transform: [{
      translateY: dot2.value,
    }],
  }), [dot2])

  const dot3Style = useAnimatedStyle(() => ({
    transform: [{
      translateY: dot3.value,
    }],
  }), [dot3])

  useEffect(() => {
    dot1.value = withRepeat(
      withSequence(
        withTiming(topY, { duration }),
        withTiming(bottomY, { duration })
      ),
      0,
      true
    )
  }, [dot1, topY, bottomY, duration])

  useEffect(() => {
    dot2.value = withDelay(100,
      withRepeat(
        withSequence(
          withTiming(topY, { duration }),
          withTiming(bottomY, { duration })
        ),
        0,
        true
      )
    )
  }, [dot2, topY, bottomY, duration])

  useEffect(() => {
    dot3.value = withDelay(200,
      withRepeat(
        withSequence(
          withTiming(topY, { duration }),
          withTiming(bottomY, { duration })
        ),
        0,
        true
      )
    )
  }, [dot3, topY, bottomY, duration])

  return (
    <View style={[stylesCommon.fill, stylesCommon.centerItems, styles.dots]}>
      <Animated.View style={[styles.dot, dot1Style]} />
      <Animated.View style={[styles.dot, dot2Style]} />
      <Animated.View style={[styles.dot, dot3Style]} />
    </View>
  )
}

const TypingIndicator = ({ isTyping, containerStyle }: TypingIndicatorProps) => {
  const yCoords = useSharedValue(200)
  const heightScale = useSharedValue(0)
  const marginScale = useSharedValue(0)

  const [isVisible, setIsVisible] = useState(isTyping)

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: yCoords.value,
      },
    ],
    height: heightScale.value,
    marginBottom: marginScale.value,
  }), [yCoords, heightScale, marginScale])

  const slideIn = useCallback(() => {
    const duration = 250

    yCoords.value = withTiming(0, { duration })
    heightScale.value = withTiming(35, { duration })
    marginScale.value = withTiming(8, { duration })
  }, [yCoords, heightScale, marginScale])

  const slideOut = useCallback(() => {
    const duration = 250

    yCoords.value = withTiming(200, { duration }, isFinished => {
      if (isFinished)
        runOnJS(setIsVisible)(false)
    })
    heightScale.value = withTiming(0, { duration })
    marginScale.value = withTiming(0, { duration })
  }, [yCoords, heightScale, marginScale])

  useEffect(() => {
    if (isVisible)
      if (isTyping)
        slideIn()
      else
        slideOut()
  }, [isVisible, isTyping, slideIn, slideOut])

  useEffect(() => {
    if (isTyping)
      setIsVisible(true)
  }, [isTyping])

  if (!isVisible)
    return null

  return (
    <Animated.View
      style={[
        styles.container,
        animatedContainerStyle,
        containerStyle,
      ]}
    >
      <DotsAnimation />
    </Animated.View>
  )
}

export default TypingIndicator
