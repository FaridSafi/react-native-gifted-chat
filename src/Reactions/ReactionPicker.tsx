import React, { useCallback } from 'react'
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { IMessage } from '../Models'
import { ReactionPickerProps } from './types'

const PICKER_HEIGHT = 54
const EMOJI_BUTTON_SIZE = 46
const PICKER_PADDING_H = 8
const PICKER_VERTICAL_OFFSET = 8

/**
 * Lightweight quick-picker shown on long-press: a floating row of emojis
 * anchored to the pressed bubble. For a full emoji browser, pass a custom
 * component via `reactions.renderReactionPicker` (see the example app).
 */
export const ReactionPicker = <TMessage extends IMessage = IMessage>(
  props: ReactionPickerProps<TMessage>
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
  } = props

  const { width: screenWidth } = Dimensions.get('window')

  const pickerWidth = emojis.length * EMOJI_BUTTON_SIZE + PICKER_PADDING_H * 2

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
      <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />

      <View
        style={[
          styles.picker,
          {
            top: pickerTop,
            left: pickerLeft,
            width: pickerWidth,
          },
          pickerContainerStyle,
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
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
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
})
