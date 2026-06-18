import {
  StyleProp,
  ViewStyle,
  TextProps,
} from 'react-native'

export interface DayProps {
  createdAt: Date | number
  dateFormat?: string
  dateFormatCalendar?: object
  containerStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
  /** Props to pass to the Text component (e.g., style, allowFontScaling, numberOfLines) */
  textProps?: Partial<TextProps>
  /**
   * `true` when rendered as the floating/animated day header that sticks to the
   * top while scrolling, `false`/`undefined` for the inline day separators.
   * Use this in a custom `renderDay` to give the floating header a different look.
   */
  isAnimated?: boolean
}
