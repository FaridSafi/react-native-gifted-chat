import { DayProps } from '../../../Day'
import { DaysPositions } from '../../types'

export interface DayAnimatedProps extends Omit<DayProps, 'createdAt'> {
  scrolledY: { value: number }
  daysPositions: { value: DaysPositions }
  listHeight: { value: number }
  isScrollActive: { value: boolean }
  // Mirror of the date the floating header is currently rendering. The header writes
  // it; the inline separators read it to cover the header's 1-frame text lag.
  floatingRenderedDate: { value: number | undefined }
  renderDay?: (props: DayProps) => React.ReactNode
  isLoading: boolean
}
