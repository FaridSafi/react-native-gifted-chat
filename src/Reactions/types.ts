import React from 'react'
import { StyleProp, TextStyle, ViewStyle } from 'react-native'

import { IMessage, MessageReaction } from '../Models'

/** Props passed to the default (or custom) reactions-display component rendered below each bubble */
export interface MessageReactionsDisplayProps<TMessage extends IMessage> {
  message: TMessage
  reactions: MessageReaction[]
  currentUserId?: string | number
  position: 'left' | 'right'
  onReactionPress?: (emoji: string) => void
  containerStyle?: StyleProp<ViewStyle>
  reactionStyle?: StyleProp<ViewStyle>
  reactionActiveStyle?: StyleProp<ViewStyle>
  reactionTextStyle?: StyleProp<TextStyle>
  reactionCountStyle?: StyleProp<TextStyle>
}

/** Props passed to the default (or custom) reaction-picker component shown on long-press */
export interface ReactionPickerProps<TMessage extends IMessage> {
  visible: boolean
  message: TMessage
  emojis: string[]
  onSelect: (emoji: string) => void
  onDismiss: () => void
  position: 'left' | 'right'
  /** Horizontal screen-coordinate of the bubble's top-left corner */
  pageX?: number
  /** Vertical screen-coordinate of the bubble's top edge */
  pageY?: number
  /** Measured width of the bubble container */
  bubbleWidth?: number
  /** Measured height of the bubble container */
  bubbleHeight?: number
  pickerContainerStyle?: StyleProp<ViewStyle>
  pickerEmojiStyle?: StyleProp<TextStyle>
}

/**
 * Top-level emoji-reactions configuration.
 * Pass this as the `reactions` prop to `<GiftedChat />`.
 */
export interface ReactionsProps<TMessage extends IMessage> {
  /**
   * Enable emoji reactions on messages.
   * @default false
   */
  isEnabled?: boolean
  /**
   * Emoji options shown in the quick picker.
   * @default ['👍', '❤️', '😂', '😮', '😢', '👎']
   */
  emojis?: string[]
  /**
   * Called when the user selects an emoji in the picker or taps an existing
   * reaction pill.  Toggle logic is left to the consumer.
   */
  onReactionPress?: (message: TMessage, emoji: string) => void
  /** Override the reactions-display component rendered below the bubble */
  renderReactions?: (props: MessageReactionsDisplayProps<TMessage>) => React.ReactNode
  /**
   * Override the emoji-picker component shown on long-press.
   * Use this to provide a richer picker (e.g. a full emoji browser).
   * See the example app for a `react-native-emoji-chooser` integration.
   */
  renderReactionPicker?: (props: ReactionPickerProps<TMessage>) => React.ReactNode
  /** Style for the container wrapping all reaction pills */
  containerStyle?: StyleProp<ViewStyle>
  /** Style applied to every inactive reaction pill */
  reactionStyle?: StyleProp<ViewStyle>
  /** Style applied to the current-user's active reaction pill */
  reactionActiveStyle?: StyleProp<ViewStyle>
  /** Style for the emoji text inside each pill */
  reactionTextStyle?: StyleProp<TextStyle>
  /** Style for the count label inside each pill */
  reactionCountStyle?: StyleProp<TextStyle>
  /** Style for the floating quick-picker panel */
  pickerContainerStyle?: StyleProp<ViewStyle>
  /** Style for each emoji button inside the quick picker */
  pickerEmojiStyle?: StyleProp<TextStyle>
}
