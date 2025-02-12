import { MessageContainerProps, DaysPositions } from '../../types'
import { IMessage } from '../../../types'

export interface ItemProps extends MessageContainerProps<IMessage> {
  onRefDayWrapper: (ref: any, id: string | number, createdAt: number) => void
  currentMessage: IMessage
  previousMessage?: IMessage
  nextMessage?: IMessage
  position: 'left' | 'right'
  scrolledY: { value: number }
  daysPositions: { value: DaysPositions }
  listHeight: { value: number }
}
