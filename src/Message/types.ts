import { ViewStyle, LayoutChangeEvent } from 'react-native'
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
}
