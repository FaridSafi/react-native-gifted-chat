import moment from 'moment'
import { IMessage } from './types'

export function isSameDay(currentMessage: IMessage, diffMessage: IMessage) {
  if (!diffMessage.createdAt) {
    return false
  }

  const currentCreatedAt = moment(currentMessage.createdAt)
  const diffCreatedAt = moment(diffMessage.createdAt)

  if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid()) {
    return false
  }

  return currentCreatedAt.isSame(diffCreatedAt, 'day')
}

export function isSameUser(currentMessage: IMessage, diffMessage: IMessage) {
  return !!(
    diffMessage.user &&
    currentMessage.user &&
    diffMessage.user._id === currentMessage.user._id
  )
}
