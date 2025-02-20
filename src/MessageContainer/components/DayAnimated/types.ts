import { DayProps } from '../../../Day'
import { IMessage } from '../../../types'
import { DaysPositions } from '../../types'

export interface DayAnimatedProps extends Omit<DayProps, 'createdAt'> {
  scrolledY: { value: number }
  daysPositions: { value: DaysPositions }
  listHeight: { value: number }
  renderDay?: (props: DayProps) => React.ReactNode
  messages: IMessage[]
  isLoadingEarlier: boolean
}
