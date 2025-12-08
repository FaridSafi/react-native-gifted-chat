import React, { ComponentProps } from 'react'
import {
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Pressable,
} from 'react-native'
import { MessageImageProps } from '../MessageImage'
import { MessageReplyProps } from '../MessageReply'
import { MessageTextProps } from '../MessageText'
import {
  User,
  IMessage,
  LeftRightStyle,
  Reply,
  ReplyMessage,
  Omit,
  MessageVideoProps,
  MessageAudioProps,
} from '../Models'
import { QuickRepliesProps } from '../QuickReplies'
import { TimeProps } from '../Time'


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


export interface BubbleProps<TMessage extends IMessage> {
  user?: User
  touchableProps?: ComponentProps<typeof Pressable>
  isUsernameVisible?: boolean
  isCustomViewBottom?: boolean
  isInverted?: boolean
  position: 'left' | 'right'
  currentMessage: TMessage
  nextMessage?: TMessage
  previousMessage?: TMessage
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
  messageTextProps?: Partial<MessageTextProps<TMessage>>
  onPressMessage?: (context?: unknown, message?: unknown) => void
  onLongPressMessage?: (context?: unknown, message?: unknown) => void
  onQuickReply?: (replies: Reply[]) => void
  renderMessageImage?: (
    props: RenderMessageImageProps<TMessage>
  ) => React.ReactNode
  renderMessageVideo?: (
    props: RenderMessageVideoProps<TMessage>
  ) => React.ReactNode
  renderMessageAudio?: (
    props: RenderMessageAudioProps<TMessage>
  ) => React.ReactNode
  renderMessageText?: (props: RenderMessageTextProps<TMessage>) => React.ReactNode
  renderCustomView?: (bubbleProps: BubbleProps<TMessage>) => React.ReactNode
  renderTime?: (timeProps: TimeProps<TMessage>) => React.ReactNode
  renderTicks?: (currentMessage: TMessage) => React.ReactNode
  renderUsername?: (user?: TMessage['user']) => React.ReactNode
  renderQuickReplySend?: () => React.ReactNode
  renderQuickReplies?: (
    quickReplies: QuickRepliesProps<TMessage>
  ) => React.ReactNode
  /** Custom render for message reply; rendered on top of message content */
  renderMessageReply?: (
    props: MessageReplyProps<TMessage>
  ) => React.ReactNode
  /** Callback when message reply is pressed */
  onPressMessageReply?: (replyMessage: ReplyMessage) => void
  /** Style for message reply container */
  messageReplyContainerStyle?: LeftRightStyle<ViewStyle>
  /** Style for message reply content container */
  messageReplyContentContainerStyle?: LeftRightStyle<ViewStyle>
  /** Style for message reply image */
  messageReplyImageStyle?: StyleProp<ImageStyle>
  /** Style for message reply username */
  messageReplyUsernameStyle?: StyleProp<TextStyle>
  /** Style for message reply text */
  messageReplyTextStyle?: StyleProp<TextStyle>
}
