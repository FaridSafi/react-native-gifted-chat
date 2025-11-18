import { IMessage } from '../../../types'
import { MessageContainerProps, DaysPositions } from '../../types'

export interface ItemProps<TMessage extends IMessage> extends MessageContainerProps<TMessage> {
  currentMessage: TMessage
  previousMessage?: TMessage
  nextMessage?: TMessage
  position: 'left' | 'right'
  scrolledY: { value: number }
  daysPositions: { value: DaysPositions }
  listHeight: { value: number }
}
