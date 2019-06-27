import { StyleProp } from 'react-native';

export { ActionsProps } from './Actions';
export { AvatarProps } from './Avatar';
export {
  BubbleProps,
  RenderMessageImageProps,
  RenderMessageVideoProps,
  RenderMessageTextProps,
} from './Bubble';
export { ComposerProps } from './Composer';
export { DayProps } from './Day';
export { GiftedAvatarProps } from './GiftedAvatar';
export { InputToolbarProps } from './InputToolbar';
export { LoadEarlierProps } from './LoadEarlier';
export { MessageProps } from './Message';
export { MessageContainerProps } from './MessageContainer';
export { MessageImageProps } from './MessageImage';
export { MessageTextProps } from './MessageText';
export { MessageVideoProps } from './MessageVideo';
export { QuickRepliesProps } from './QuickReplies';
export { SendProps } from './Send';
export { SystemMessageProps } from './SystemMessage';
export { TimeProps } from './Time';

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

export interface LeftRightStyle<T> {
  left: StyleProp<T>
  right: StyleProp<T>
}
type renderFunction = (x: any) => JSX.Element
export interface User {
  _id: any
  name?: string
  avatar?: string | renderFunction
}

export interface Reply {
  title: string
  value: string
  messageId?: any
}

export interface QuickReplies {
  type: 'radio' | 'checkbox'
  values: Reply[]
  keepIt?: boolean
}

export interface IMessage {
  _id: any
  text: string
  createdAt: Date | number
  user: User
  image?: string
  video?: string
  audio?: string
  system?: boolean
  sent?: boolean
  received?: boolean
  pending?: boolean
  quickReplies?: QuickReplies
}

export type IChatMessage = IMessage
