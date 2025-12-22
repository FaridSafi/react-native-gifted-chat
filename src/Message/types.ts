import { ViewStyle, LayoutChangeEvent, StyleProp } from 'react-native'
import { AvatarProps } from '../Avatar'
import { BubbleProps } from '../Bubble'
import { DayProps } from '../Day'
import { IMessage, User, LeftRightStyle } from '../Models'
import { SystemMessageProps } from '../SystemMessage'

export interface MessageProps<TMessage extends IMessage> {
  isUserAvatarVisible?: boolean
  position: 'left' | 'right'
  currentMessage: TMessage
  nextMessage?: TMessage
  previousMessage?: TMessage
  user: User
  isInverted?: boolean
  containerStyle?: LeftRightStyle<ViewStyle>
  renderBubble?: (props: BubbleProps<TMessage>) => React.ReactNode
  renderDay?: (props: DayProps) => React.ReactNode
  renderSystemMessage?: (props: SystemMessageProps<TMessage>) => React.ReactNode
  renderAvatar?: (props: AvatarProps<TMessage>) => React.ReactNode
  onMessageLayout?: (event: LayoutChangeEvent) => void
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
}
