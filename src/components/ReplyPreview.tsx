import React, { useEffect } from 'react'
import {
  Image,
  ImageStyle,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated'

import { useColorScheme } from '../hooks/useColorScheme'
import { ReplyMessage } from '../Models'

const ANIMATION_DURATION = 200
const ANIMATION_EASING = Easing.bezier(0.25, 0.1, 0.25, 1)
const DEFAULT_HEIGHT = 68

export interface ReplyPreviewProps {
  /** The reply message to preview */
  replyMessage: ReplyMessage
  /** Callback to clear the reply */
  onClearReply?: () => void
  /** Container style */
  containerStyle?: StyleProp<ViewStyle>
  /** Text style */
  textStyle?: StyleProp<TextStyle>
  /** Image style */
  imageStyle?: StyleProp<ImageStyle>
}

const styles = StyleSheet.create({
  borderIndicator: {
    backgroundColor: '#0084ff',
    borderTopLeftRadius: 4,
    height: '100%',
    width: 4,
  },
  clearButton: {
    alignItems: 'center',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  clearButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  container: {
    borderRadius: 8,
    flexDirection: 'row',
    marginBottom: 8,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  containerDark: {
    backgroundColor: '#2c2c2e',
  },
  containerLight: {
    backgroundColor: '#e9e9eb',
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  image: {
    borderRadius: 4,
    height: 40,
    marginRight: 8,
    width: 40,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 14,
  },
  textDark: {
    color: '#fff',
  },
  textLight: {
    color: '#333',
  },
  username: {
    color: '#0084ff',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  wrapper: {
    overflow: 'hidden',
  },
})

export function ReplyPreview ({
  replyMessage,
  onClearReply,
  containerStyle,
  textStyle,
  imageStyle,
}: ReplyPreviewProps) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  const animationProgress = useSharedValue(0)
  const contentHeight = useSharedValue(DEFAULT_HEIGHT)

  // Animate in on mount
  useEffect(() => {
    animationProgress.value = withTiming(1, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    })
  }, [animationProgress])

  const handleClear = () => {
    'worklet'
    animationProgress.value = withTiming(0, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    }, finished => {
      if (finished && onClearReply)
        runOnJS(onClearReply)()
    })
  }

  const wrapperAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      animationProgress.value,
      [0, 1],
      [0, contentHeight.value]
    )

    const opacity = interpolate(
      animationProgress.value,
      [0, 0.5, 1],
      [0, 0.5, 1]
    )

    const translateY = interpolate(
      animationProgress.value,
      [0, 1],
      [10, 0]
    )

    return {
      height,
      opacity,
      transform: [{ translateY }],
    }
  })

  const displayName = replyMessage.user?.name || 'Unknown'

  return (
    <Animated.View style={[styles.wrapper, wrapperAnimatedStyle]}>
      <View
        style={[
          styles.container,
          isDark ? styles.containerDark : styles.containerLight,
          containerStyle,
        ]}
        onLayout={e => {
          const newHeight = e.nativeEvent.layout.height + 8
          // Animate height change smoothly when content changes
          contentHeight.value = withTiming(newHeight, {
            duration: ANIMATION_DURATION,
            easing: ANIMATION_EASING,
          })
        }}
      >
        <View style={styles.borderIndicator} />
        <View style={styles.content}>
          <View style={styles.row}>
            {replyMessage.image && (
              <Image
                source={{ uri: replyMessage.image }}
                style={[styles.image, imageStyle]}
              />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.username} numberOfLines={1}>
                Replying to {displayName}
              </Text>
              {replyMessage.text && (
                <Text
                  style={[
                    styles.text,
                    isDark ? styles.textDark : styles.textLight,
                    textStyle,
                  ]}
                  numberOfLines={2}
                >
                  {replyMessage.text}
                </Text>
              )}
            </View>
          </View>
        </View>
        <Pressable
          style={styles.clearButton}
          onPress={handleClear}
          hitSlop={8}
        >
          <Text
            style={[
              styles.clearButtonText,
              isDark ? styles.textDark : styles.textLight,
            ]}
          >
            ×
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  )
}
