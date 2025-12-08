import React, { RefObject } from 'react'
import {
  FlatListProps,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import { DayProps } from '../Day'
import { LoadEarlierMessagesProps } from '../LoadEarlierMessages'
import { MessageProps } from '../Message'
import { MessageReplyProps } from '../MessageReply'
import { User, IMessage, Reply } from '../Models'
import { TypingIndicatorProps } from '../TypingIndicator/types'

export type ListProps<TMessage extends IMessage = IMessage> = Partial<FlatListProps<TMessage>>

export type AnimatedList<TMessage> = FlatList<TMessage>

export interface MessagesContainerProps<TMessage extends IMessage = IMessage>
  extends Omit<TypingIndicatorProps, 'style'> {
  /** Ref for the FlatList message container */
  forwardRef?: RefObject<AnimatedList<TMessage>>
  /** Messages to display */
  messages?: TMessage[]
  /** User sending the messages: { _id, name, avatar } */
  user?: User
  /** Additional props for FlatList */
  listProps?: ListProps<TMessage>
  /** Reverses display order of messages; default is true */
  isInverted?: boolean
  /** Controls whether or not the message bubbles appear at the top of the chat */
  isAlignedTop?: boolean
  /** Enables the isScrollToBottomEnabled Component */
  isScrollToBottomEnabled?: boolean
  /** Scroll to bottom wrapper style */
  scrollToBottomStyle?: StyleProp<ViewStyle>
  /** Distance from bottom before showing scroll to bottom button */
  scrollToBottomOffset?: number
  /** Custom component to render when messages are empty */
  renderChatEmpty?: () => React.ReactNode
  /** Custom footer component on the ListView, e.g. 'User is typing...' */
  renderFooter?: (props: MessagesContainerProps<TMessage>) => React.ReactNode
  /** Custom message container */
  renderMessage?: (props: MessageProps<TMessage>) => React.ReactElement
  /** Custom day above a message */
  renderDay?: (props: DayProps) => React.ReactNode
  /** Custom "Load earlier messages" button */
  renderLoadEarlier?: (props: LoadEarlierMessagesProps) => React.ReactNode
  /** Custom typing indicator */
  renderTypingIndicator?: () => React.ReactNode
  /** Scroll to bottom custom component */
  scrollToBottomComponent?: () => React.ReactNode
  /** Callback when quick reply is sent */
  onQuickReply?: (replies: Reply[]) => void
  /** Props to pass to the LoadEarlierMessages component. The LoadEarlierMessages button is only visible when isAvailable is true. Includes isAvailable (controls button visibility), isInfiniteScrollEnabled (infinite scroll up when reach the top of messages container, automatically call onPress function if it exists - not yet supported for web), onPress (callback when button is pressed), isLoading (display loading indicator), label (override default "Load earlier messages" text), and styling props (containerStyle, wrapperStyle, textStyle, activityIndicatorStyle, activityIndicatorColor, activityIndicatorSize). */
  loadEarlierMessagesProps?: LoadEarlierMessagesProps
  /** Style for TypingIndicator component */
  typingIndicatorStyle?: StyleProp<ViewStyle>
  /** Enable animated day label that appears on scroll; default is true */
  isDayAnimationEnabled?: boolean
  /** Enable swipe to reply on messages; default is false */
  isSwipeToReplyEnabled?: boolean
  /** Swipe direction for reply; default is 'right' (swipe left to reveal) */
  swipeToReplyDirection?: 'left' | 'right'
  /** Callback when swipe to reply is triggered */
  onSwipeToReply?: (message: TMessage) => void
  /** Custom render for swipe action indicator */
  renderSwipeToReplyAction?: (
    progress: any,
    dragX: any,
    position: 'left' | 'right'
  ) => React.ReactNode
  /** Style for the swipe action container */
  swipeToReplyActionContainerStyle?: StyleProp<ViewStyle>
  /** Custom render for message reply inside bubble */
  renderMessageReply?: (props: MessageReplyProps<TMessage>) => React.ReactNode
}

export interface State {
  showScrollBottom: boolean
  hasScrolled: boolean
}

interface ViewLayout {
  x: number
  y: number
  width: number
  height: number
}

export type DaysPositions = { [key: string]: ViewLayout & { createdAt: number } }
