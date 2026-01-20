import { RefObject } from 'react'
import {
  FlatListProps,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import Animated, { ScrollEvent } from 'react-native-reanimated'

import { MessageReplyProps } from '../components/MessageReply'
import { DayProps } from '../Day'
import { LoadEarlierMessagesProps } from '../LoadEarlierMessages'
import { MessageProps } from '../Message'
import { User, IMessage, Reply, ReplyMessage } from '../Models'
import { TypingIndicatorProps } from '../TypingIndicator/types'

/** Animated FlatList created from react-native-gesture-handler's FlatList */
const RNGHAnimatedFlatList = Animated.createAnimatedComponent(FlatList)

/**
 * Typed AnimatedFlatList component that preserves generic type parameter.
 * Uses react-native-gesture-handler's FlatList which respects keyboardShouldPersistTaps.
 */
export const AnimatedFlatList = RNGHAnimatedFlatList as <TMessage>(
  props: FlatListProps<TMessage> & {
    ref?: RefObject<FlatList<TMessage>>
  }
) => React.ReactElement

export type AnimatedListProps<TMessage extends IMessage = IMessage> = Partial<
  Omit<FlatListProps<TMessage>, 'onScroll'> & {
    onScroll?: (event: ScrollEvent) => void
  }
>

export type AnimatedList<TMessage> = FlatList<TMessage>

export interface MessagesContainerProps<TMessage extends IMessage = IMessage>
  extends Omit<TypingIndicatorProps, 'style'> {
  /** Ref for the FlatList message container */
  forwardRef?: RefObject<AnimatedList<TMessage>>
  /** Messages to display */
  messages?: TMessage[]
  /** Format to use for rendering dates; default is 'll' */
  dateFormat?: string
  /** Format to use for rendering relative times */
  dateFormatCalendar?: object
  /** User sending the messages: { _id, name, avatar } */
  user?: User
  /** Additional props for FlatList */
  listProps?: AnimatedListProps<TMessage>
  /** Reverses display order of messages; default is true */
  isInverted?: boolean
  /** Controls whether or not the message bubbles appear at the top of the chat */
  isAlignedTop?: boolean
  /** Enables the isScrollToBottomEnabled Component */
  isScrollToBottomEnabled?: boolean
  /** Scroll to bottom wrapper style */
  scrollToBottomStyle?: StyleProp<ViewStyle>
  /** Scroll to bottom content style */
  scrollToBottomContentStyle?: StyleProp<ViewStyle>
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
  /** Enable swipe-to-reply gesture on messages */
  isSwipeToReplyEnabled?: boolean
  /** Direction of swipe gesture for reply; 'left' or 'right' (default: 'right') */
  swipeToReplyDirection?: 'left' | 'right'
  /** Callback when message is swiped to reply */
  onSwipeToReply?: (message: TMessage) => void
  /** Custom render function for swipe action */
  renderSwipeToReplyAction?: (
    progressAnimatedValue: any,
    dragAnimatedValue: any,
    swipeDirection: 'left' | 'right'
  ) => React.ReactNode
  /** Style for swipe action container */
  swipeToReplyActionContainerStyle?: StyleProp<ViewStyle>
  /** Custom render function for message reply */
  renderMessageReply?: (props: MessageReplyProps<TMessage>) => React.ReactNode
  /** Callback when message reply is pressed */
  onPressMessageReply?: (replyMessage: ReplyMessage) => void
  /** Style for message reply container */
  messageReplyContainerStyle?: StyleProp<ViewStyle>
  /** Style for message reply container on left side */
  messageReplyContainerStyleLeft?: StyleProp<ViewStyle>
  /** Style for message reply container on right side */
  messageReplyContainerStyleRight?: StyleProp<ViewStyle>
  /** Style for message reply text */
  messageReplyTextStyle?: StyleProp<TextStyle>
  /** Style for message reply text on left side */
  messageReplyTextStyleLeft?: StyleProp<TextStyle>
  /** Style for message reply text on right side */
  messageReplyTextStyleRight?: StyleProp<TextStyle>
  /** Style for message reply image */
  messageReplyImageStyle?: StyleProp<ImageStyle>
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
