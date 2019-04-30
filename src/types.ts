import * as RN from 'react-native'

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

export interface LeftRightStyle<T> {
  left: T
  right: T
}
type renderFunction = () => JSX.Element
export interface User {
  _id: any
  name?: string
  avatar?: string | renderFunction
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
}

export type IChatMessage = IMessage
