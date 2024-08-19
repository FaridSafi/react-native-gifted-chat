import PropTypes from 'prop-types'
import dayjs from 'dayjs'

import { IMessage } from './Models'

export const StylePropType = PropTypes.oneOfType([
  PropTypes.array,
  PropTypes.object,
  PropTypes.number,
  PropTypes.bool,
])

export function isSameDay (
  currentMessage: IMessage,
  diffMessage: IMessage | null | undefined
) {
  if (!diffMessage || !diffMessage.createdAt)
    return false

  const currentCreatedAt = dayjs(currentMessage.createdAt)
  const diffCreatedAt = dayjs(diffMessage.createdAt)

  if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid())
    return false

  return currentCreatedAt.isSame(diffCreatedAt, 'day')
}

export function isSameUser (
  currentMessage: IMessage,
  diffMessage: IMessage | null | undefined
) {
  return !!(
    diffMessage &&
    diffMessage.user &&
    currentMessage.user &&
    diffMessage.user._id === currentMessage.user._id
  )
}
