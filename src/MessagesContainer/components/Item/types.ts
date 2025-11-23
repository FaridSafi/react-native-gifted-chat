import { IMessage } from '../../../Models'
import { MessagesContainerProps, DaysPositions } from '../../types'

export interface ItemProps<TMessage extends IMessage> extends MessagesContainerProps<TMessage> {
  currentMessage: TMessage
  previousMessage?: TMessage
  nextMessage?: TMessage
  position: 'left' | 'right'
  scrolledY: { value: number }
  daysPositions: { value: DaysPositions }
  listHeight: { value: number }
  isDayAnimationEnabled?: boolean
}
