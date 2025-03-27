import { ViewStyle, LayoutChangeEvent } from 'react-native'
import { AvatarProps } from '../Avatar'
import { SystemMessageProps } from '../SystemMessage'
import { DayProps } from '../Day'
import { IMessage, User, LeftRightStyle } from '../types'
import { BubbleProps } from '../Bubble'

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
  shouldUpdateMessage?(
    props: MessageProps<IMessage>,
    nextProps: MessageProps<IMessage>,
  ): boolean
  onMessageLayout?(event: LayoutChangeEvent): void
}
