import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import {
  Dimensions,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import EmojiPicker from 'react-native-emoji-chooser'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window')
const SHEET_HEIGHT = WINDOW_HEIGHT * 0.8
const SAFE_BOTTOM_PADDING = Platform.OS === 'ios' ? 24 : 16
const SWIPE_CLOSE_THRESHOLD = 80

export interface EmojiPickerSearchBarProps {
  placeholderTextColor?: string
  [key: string]: unknown
}

export interface EmojiPickerThemeMode {
  searchbar?: {
    container?: StyleProp<ViewStyle>
    textInput?: StyleProp<TextStyle>
  }
  toolbar?: {
    container?: StyleProp<ViewStyle>
  }
}

export interface FullEmojiPickerTheme {
  light?: EmojiPickerThemeMode
  dark?: EmojiPickerThemeMode
}

/** Imperative handle so the parent picker can slide the sheet in/out */
export interface FullEmojiPickerRef {
  expand: () => void
  close: () => void
}

export interface FullEmojiPickerProps {
  onSelect: (emoji: string) => void
  onClose: () => void
  mode?: 'light' | 'dark'
  lang?: string
  columnCount?: number
  theme?: FullEmojiPickerTheme
  searchBarProps?: EmojiPickerSearchBarProps
}

export const FullEmojiPicker = forwardRef<FullEmojiPickerRef, FullEmojiPickerProps>(
  (props, ref) => {
    const {
      onSelect,
      onClose,
      mode = 'light',
      lang = 'en',
      columnCount = 6,
      theme = {},
      searchBarProps,
    } = props

    const [isMounted, setIsMounted] = useState(false)

    const translateY = useSharedValue(SHEET_HEIGHT)
    const backdropOpacity = useSharedValue(0)

    const close = useCallback(() => {
      translateY.value = withTiming(SHEET_HEIGHT, { duration: 250 })
      backdropOpacity.value = withTiming(0, { duration: 250 }, finished => {
        if (finished)
          runOnJS(onClose)()
      })
    }, [backdropOpacity, onClose, translateY])

    const expand = useCallback(() => {
      setIsMounted(true)
    }, [])

    // Trigger the entrance animation once the component is mounted in the tree
    useEffect(() => {
      if (!isMounted)
        return

      translateY.value = withTiming(0, { duration: 300 })
      backdropOpacity.value = withTiming(0.6, { duration: 300 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted])

    useImperativeHandle(ref, () => ({ expand, close }), [expand, close])

    // Swipe-to-dismiss gesture
    const panGesture = Gesture.Pan()
      .onUpdate(e => {
        translateY.value = Math.max(0, e.translationY)
      })
      .onEnd(e => {
        if (e.translationY > SWIPE_CLOSE_THRESHOLD)
          runOnJS(close)()
        else
          translateY.value = withSpring(0, { damping: 22, stiffness: 110 })
      })

    const sheetStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }))

    const backdropStyle = useAnimatedStyle(() => ({
      opacity: backdropOpacity.value,
    }))

    if (!isMounted)
      return null

    const lightOverrides = theme.light ?? {}
    const darkOverrides = theme.dark ?? {}

    const emojiPickerTheme: Record<string, any> = {
      light: {
        searchbar: {
          ...(lightOverrides.searchbar as Record<string, unknown>),
          placeholderColor: searchBarProps?.placeholderTextColor,
        },
        toolbar: {
          container: {
            paddingBottom: SAFE_BOTTOM_PADDING,
            ...(lightOverrides.toolbar?.container as Record<string, unknown>),
          },
        },
      },
      dark: {
        searchbar: {
          ...(darkOverrides.searchbar as Record<string, unknown>),
          placeholderColor: searchBarProps?.placeholderTextColor,
        },
        toolbar: {
          container: {
            paddingBottom: SAFE_BOTTOM_PADDING,
            ...(darkOverrides.toolbar?.container as Record<string, unknown>),
          },
        },
      },
    }

    const bgColor = mode === 'dark' ? '#111827' : '#ffffff'
    const handleColor = mode === 'dark' ? '#4b5563' : '#d1d5db'

    return (
      <>
        {/* Semi-transparent backdrop - tap to dismiss */}
        <Pressable style={StyleSheet.absoluteFill} onPress={close}>
          <Animated.View
            style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}
            pointerEvents='none'
          />
        </Pressable>

        {/* Slide-up sheet */}
        <Animated.View
          style={[
            styles.sheet,
            { height: SHEET_HEIGHT, width: WINDOW_WIDTH, backgroundColor: bgColor },
            sheetStyle,
          ]}
        >
          {/* Drag handle - pan gesture attached here */}
          <GestureDetector gesture={panGesture}>
            <View style={styles.handleContainer}>
              <View style={[styles.handle, { backgroundColor: handleColor }]} />
            </View>
          </GestureDetector>

          <EmojiPicker
            onSelect={(emoji: string) => {
              onSelect(emoji)
              close()
            }}
            mode={mode}
            lang={lang}
            columnCount={columnCount}
            theme={emojiPickerTheme}
            searchBarProps={searchBarProps}
          />
        </Animated.View>
      </>
    )
  }
)

FullEmojiPicker.displayName = 'FullEmojiPicker'

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: '#000000',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
})
