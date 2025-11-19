import { ViewStyle, LayoutChangeEvent } from 'react-native'
import { AvatarProps } from '../Avatar'
import { BubbleProps } from '../Bubble'
import { DayProps } from '../Day'
import { SystemMessageProps } from '../SystemMessage'
import { IMessage, User, LeftRightStyle } from '../types'

export interface MessageProps<TMessage extends IMessage> {
  showUserAvatar?: boolean
  position: 'left' | 'right'
  currentMessage: TMessage
  nextMessage?: TMessage
  previousMessage?: TMessage
  user: User
  inverted?: boolean
  containerStyle?: LeftRightStyle<ViewStyle>
  renderBubble?(props: BubbleProps<TMessage>): React.ReactNode
  renderDay?(props: DayProps): React.ReactNode
  renderSystemMessage?(props: SystemMessageProps<TMessage>): React.ReactNode
  renderAvatar?(props: AvatarProps<TMessage>): React.ReactNode
  onMessageLayout?(event: LayoutChangeEvent): void
}
