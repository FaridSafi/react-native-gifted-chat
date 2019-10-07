import { StyleProp, ViewStyle } from 'react-native'

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

export interface MessageVideoProps<TMessage extends IMessage> {
  currentMessage?: TMessage
  containerStyle?: StyleProp<ViewStyle>
  videoStyle?: StyleProp<ViewStyle>
  videoProps?: object
  // TODO: should be LightBox properties
  lightboxProps?: object
}
