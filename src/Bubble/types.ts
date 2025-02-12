import React from 'react'
import {
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { QuickRepliesProps } from '../QuickReplies'
import { MessageTextProps } from '../MessageText'
import { MessageImageProps } from '../MessageImage'
import { TimeProps } from '../Time'
import {
  User,
  IMessage,
  LeftRightStyle,
  Reply,
  Omit,
  MessageVideoProps,
  MessageAudioProps,
} from '../types'

/* eslint-disable no-use-before-define */
export type RenderMessageImageProps<TMessage extends IMessage> = Omit<
  BubbleProps<TMessage>,
  'containerStyle' | 'wrapperStyle'
> &
  MessageImageProps<TMessage>

export type RenderMessageVideoProps<TMessage extends IMessage> = Omit<
  BubbleProps<TMessage>,
  'containerStyle' | 'wrapperStyle'
> &
  MessageVideoProps<TMessage>

export type RenderMessageAudioProps<TMessage extends IMessage> = Omit<
  BubbleProps<TMessage>,
  'containerStyle' | 'wrapperStyle'
> &
  MessageAudioProps<TMessage>

export type RenderMessageTextProps<TMessage extends IMessage> = Omit<
  BubbleProps<TMessage>,
  'containerStyle' | 'wrapperStyle'
> &
  MessageTextProps<TMessage>
/* eslint-enable no-use-before-define */

export interface BubbleProps<TMessage extends IMessage> {
  user?: User
  touchableProps?: object
  renderUsernameOnMessage?: boolean
  isCustomViewBottom?: boolean
  inverted?: boolean
  position: 'left' | 'right'
  currentMessage: TMessage
  nextMessage?: TMessage
  previousMessage?: TMessage
  optionTitles?: string[]
  containerStyle?: LeftRightStyle<ViewStyle>
  wrapperStyle?: LeftRightStyle<ViewStyle>
  textStyle?: LeftRightStyle<TextStyle>
  bottomContainerStyle?: LeftRightStyle<ViewStyle>
  tickStyle?: StyleProp<TextStyle>
  containerToNextStyle?: LeftRightStyle<ViewStyle>
  containerToPreviousStyle?: LeftRightStyle<ViewStyle>
  usernameStyle?: TextStyle
  quickReplyStyle?: StyleProp<ViewStyle>
  quickReplyTextStyle?: StyleProp<TextStyle>
  quickReplyContainerStyle?: StyleProp<ViewStyle>
  onPress?(context?: unknown, message?: unknown): void
  onLongPress?(context?: unknown, message?: unknown): void
  onQuickReply?(replies: Reply[]): void
  renderMessageImage?(
    props: RenderMessageImageProps<TMessage>,
  ): React.ReactNode
  renderMessageVideo?(
    props: RenderMessageVideoProps<TMessage>,
  ): React.ReactNode
  renderMessageAudio?(
    props: RenderMessageAudioProps<TMessage>,
  ): React.ReactNode
  renderMessageText?(props: RenderMessageTextProps<TMessage>): React.ReactNode
  renderCustomView?(bubbleProps: BubbleProps<TMessage>): React.ReactNode
  renderTime?(timeProps: TimeProps<TMessage>): React.ReactNode
  renderTicks?(currentMessage: TMessage): React.ReactNode
  renderUsername?(user?: TMessage['user']): React.ReactNode
  renderQuickReplySend?(): React.ReactNode
  renderQuickReplies?(
    quickReplies: QuickRepliesProps<TMessage>,
  ): React.ReactNode
}
