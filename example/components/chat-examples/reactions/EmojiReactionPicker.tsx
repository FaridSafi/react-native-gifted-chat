import React, { useCallback, useRef } from 'react'
import {
  Dimensions,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { IMessage, ReactionPickerProps } from 'react-native-gifted-chat'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import {
  EmojiPickerSearchBarProps,
  FullEmojiPicker,
  FullEmojiPickerRef,
  FullEmojiPickerTheme,
} from './FullEmojiPicker'

const PICKER_HEIGHT = 54
const EMOJI_BUTTON_SIZE = 46
const PICKER_PADDING_H = 8
const PICKER_VERTICAL_OFFSET = 8
const QUICK_PICKER_ANIMATE_DURATION = 200

/**
 * Example picker that extends the built-in quick picker with a "+" button
 * opening a full emoji browser (react-native-emoji-chooser). Wire it through
 * `reactions.renderReactionPicker`. This lives in the example - the core
 * library ships only the lightweight quick picker.
 */
export interface EmojiReactionPickerProps<TMessage extends IMessage>
  extends ReactionPickerProps<TMessage> {
  pickerContainerStyle?: StyleProp<ViewStyle>
  pickerEmojiStyle?: StyleProp<TextStyle>
  isFullPickerEnabled?: boolean
  mode?: 'light' | 'dark'
  fullPickerLang?: string
  fullPickerColumnCount?: number
  fullPickerTheme?: FullEmojiPickerTheme
  fullPickerSearchBarProps?: EmojiPickerSearchBarProps
}

export const EmojiReactionPicker = <TMessage extends IMessage = IMessage>(
  props: EmojiReactionPickerProps<TMessage>
): React.ReactElement | null => {
  const {
    visible,
    emojis,
    onSelect,
    onDismiss,
    position,
    pageX = 0,
    pageY = 0,
    bubbleWidth = 0,
    bubbleHeight = 0,
    pickerContainerStyle,
    pickerEmojiStyle,
    isFullPickerEnabled,
    mode = 'light',
    fullPickerLang,
    fullPickerColumnCount,
    fullPickerTheme,
    fullPickerSearchBarProps,
  } = props

  const { width: screenWidth } = Dimensions.get('window')

  const fullPickerRef = useRef<FullEmojiPickerRef>(null)

  const pickerScale = useSharedValue(1)

  const quickPickerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pickerScale.value }],
  }))

  const pickerWidth = emojis.length * EMOJI_BUTTON_SIZE + PICKER_PADDING_H * 2
    + (isFullPickerEnabled ? EMOJI_BUTTON_SIZE : 0)

  const showAbove = pageY >= PICKER_HEIGHT + PICKER_VERTICAL_OFFSET
  const pickerTop = showAbove
    ? pageY - PICKER_HEIGHT - PICKER_VERTICAL_OFFSET
    : pageY + bubbleHeight + PICKER_VERTICAL_OFFSET

  let pickerLeft: number
  if (position === 'right')
    pickerLeft = pageX + bubbleWidth - pickerWidth
  else
    pickerLeft = pageX

  pickerLeft = Math.max(8, Math.min(pickerLeft, screenWidth - pickerWidth - 8))

  const handleSelect = useCallback(
    (emoji: string) => {
      onSelect(emoji)
      onDismiss()
    },
    [onSelect, onDismiss]
  )

  const openFullPicker = useCallback(() => {
    fullPickerRef.current?.expand()
  }, [])

  const handleOpenFullPicker = useCallback(() => {
    pickerScale.value = withTiming(
      0,
      { duration: QUICK_PICKER_ANIMATE_DURATION },
      finished => {
        if (finished)
          runOnJS(openFullPicker)()
      }
    )
  }, [openFullPicker, pickerScale])

  if (!visible)
    return null

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onDismiss}
      animationType='fade'
      statusBarTranslucent
    >
      {/* GestureHandlerRootView is required inside the Modal so the
          FullEmojiPicker's pan-to-dismiss gesture is recognised. */}
      <GestureHandlerRootView style={styles.gestureRoot}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />

        {/* Quick-picker bar - scales away before the full picker opens */}
        <Animated.View
          style={[
            styles.picker,
            {
              top: pickerTop,
              left: pickerLeft,
              width: pickerWidth,
            },
            pickerContainerStyle,
            quickPickerStyle,
          ]}
        >
          {emojis.map(emoji => (
            <Pressable
              key={emoji}
              onPress={() => handleSelect(emoji)}
              style={({ pressed }) => [
                styles.emojiButton,
                pressed && styles.emojiButtonPressed,
              ]}
            >
              <Text style={[styles.emoji, pickerEmojiStyle]}>{emoji}</Text>
            </Pressable>
          ))}

          {isFullPickerEnabled && (
            <>
              <View style={styles.divider} />
              <Pressable
                onPress={handleOpenFullPicker}
                style={({ pressed }) => [
                  styles.emojiButton,
                  styles.plusButton,
                  pressed && styles.emojiButtonPressed,
                ]}
              >
                <Text style={[styles.plusText, pickerEmojiStyle]}>{'+'}</Text>
              </Pressable>
            </>
          )}
        </Animated.View>

        {isFullPickerEnabled && (
          <FullEmojiPicker
            ref={fullPickerRef}
            onSelect={onSelect}
            onClose={onDismiss}
            mode={mode}
            lang={fullPickerLang}
            columnCount={fullPickerColumnCount}
            theme={fullPickerTheme}
            searchBarProps={fullPickerSearchBarProps}
          />
        )}
      </GestureHandlerRootView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  picker: {
    position: 'absolute',
    height: PICKER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: PICKER_HEIGHT / 2,
    paddingHorizontal: PICKER_PADDING_H,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  emojiButton: {
    width: EMOJI_BUTTON_SIZE,
    height: EMOJI_BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: EMOJI_BUTTON_SIZE / 2,
  },
  emojiButtonPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
    transform: [{ scale: 1.2 }],
  },
  emoji: {
    fontSize: 26,
    lineHeight: 32,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginHorizontal: 2,
  },
  plusButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  plusText: {
    fontSize: 22,
    lineHeight: 26,
    color: '#374151',
    fontWeight: '500',
  },
})
