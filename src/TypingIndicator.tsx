import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import Color from './Color'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

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
    <View style={styles.dots}>
      <Animated.View style={[styles.dot, dot1Style]} />
      <Animated.View style={[styles.dot, dot2Style]} />
      <Animated.View style={[styles.dot, dot3Style]} />
    </View>
  )
}

interface Props {
  isTyping?: boolean
}

const TypingIndicator = ({ isTyping }: Props) => {
  const yCoords = useSharedValue(200)
  const heightScale = useSharedValue(0)
  const marginScale = useSharedValue(0)

  const [isVisible, setIsVisible] = useState(isTyping)

  const containerStyle = useAnimatedStyle(() => ({
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

  // side effect
  const slideOut = useCallback(() => {
    const duration = 250

    yCoords.value = withTiming(200, { duration })
    heightScale.value = withTiming(0, { duration })
    marginScale.value = withTiming(0, { duration }, isFinished => {
      if (isFinished)
        runOnJS(setIsVisible)(false)
    })
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
        containerStyle,
      ]}
    >
      <DotsAnimation />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 8,
    width: 45,
    borderRadius: 15,
    backgroundColor: Color.leftBubbleBackground,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  dot: {
    marginLeft: 2,
    marginRight: 2,
    borderRadius: 4,
    width: 8,
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
  },
})

export default TypingIndicator
